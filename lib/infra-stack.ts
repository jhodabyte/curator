import * as cdk from "aws-cdk-lib/core";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as rds from "aws-cdk-lib/aws-rds";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ─── VPC ───
    const vpc = new ec2.Vpc(this, "CuratorVpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    // ─── RDS PostgreSQL ───
    const dbSecurityGroup = new ec2.SecurityGroup(this, "DbSecurityGroup", {
      vpc,
      description: "Security group for RDS PostgreSQL",
    });

    const database = new rds.DatabaseInstance(this, "CuratorDb", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [dbSecurityGroup],
      databaseName: "curator",
      credentials: rds.Credentials.fromGeneratedSecret("curator_admin", {
        secretName: "curator-db-credentials",
      }),
      allocatedStorage: 20,
      maxAllocatedStorage: 20,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
    });

    // ─── ECR Repository ───
    const repository = new ecr.Repository(this, "CuratorApiRepo", {
      repositoryName: "curator-api",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
    });

    // ─── ECS Cluster ───
    const cluster = new ecs.Cluster(this, "CuratorCluster", {
      vpc,
      clusterName: "curator-cluster",
    });

    // ─── ALB ───
    const alb = new elbv2.ApplicationLoadBalancer(this, "CuratorAlb", {
      vpc,
      internetFacing: true,
    });

    // ─── ECS Task Definition ───
    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "CuratorApiTask",
      {
        memoryLimitMiB: 512,
        cpu: 256,
      }
    );

    const dbSecret = database.secret!;

    taskDefinition.addContainer("curator-api", {
      image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: "curator-api",
        logRetention: logs.RetentionDays.ONE_WEEK,
      }),
      environment: {
        PORT: "3000",
        NODE_ENV: "production",
        WOMPI_API_URL: "https://api-sandbox.co.uat.wompi.dev/v1",
        WOMPI_PUBLIC_KEY: "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7",
        WOMPI_PRIVATE_KEY: "prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg",
        WOMPI_INTEGRITY_SECRET:
          "stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp",
      },
      secrets: {
        DB_HOST: ecs.Secret.fromSecretsManager(dbSecret, "host"),
        DB_PORT: ecs.Secret.fromSecretsManager(dbSecret, "port"),
        DB_USER: ecs.Secret.fromSecretsManager(dbSecret, "username"),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, "password"),
        DB_NAME: ecs.Secret.fromSecretsManager(dbSecret, "dbname"),
      },
      portMappings: [{ containerPort: 3000 }],
    });

    // ─── ECS Service ───
    const service = new ecs.FargateService(this, "CuratorApiService", {
      cluster,
      taskDefinition,
      desiredCount: 1,
      assignPublicIp: false,
    });

    // Allow ECS → RDS
    dbSecurityGroup.addIngressRule(
      service.connections.securityGroups[0],
      ec2.Port.tcp(5432),
      "Allow ECS to connect to RDS"
    );

    // ALB → ECS
    const listener = alb.addListener("HttpListener", { port: 80 });
    listener.addTargets("EcsTarget", {
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [service],
      healthCheck: {
        path: "/api",
        interval: cdk.Duration.seconds(30),
        healthyThresholdCount: 2,
      },
    });

    // ─── S3 for Frontend ───
    const frontendBucket = new s3.Bucket(this, "CuratorFrontend", {
      bucketName: `curator-frontend-${this.account}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // ─── CloudFront Distribution ───
    const apiOrigin = new origins.HttpOrigin(alb.loadBalancerDnsName, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
    });

    const distribution = new cloudfront.Distribution(this, "CuratorCdn", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        "/api/*": {
          origin: apiOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
        },
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responsePagePath: "/index.html",
          responseHttpStatus: 200,
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responsePagePath: "/index.html",
          responseHttpStatus: 200,
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    // ─── Outputs ───
    new cdk.CfnOutput(this, "ApiUrl", {
      value: `http://${alb.loadBalancerDnsName}`,
      description: "Backend API URL",
    });

    new cdk.CfnOutput(this, "FrontendUrl", {
      value: `https://${distribution.distributionDomainName}`,
      description: "Frontend URL (CloudFront)",
    });

    new cdk.CfnOutput(this, "EcrRepositoryUri", {
      value: repository.repositoryUri,
      description: "ECR Repository URI for Docker push",
    });

    new cdk.CfnOutput(this, "FrontendBucketName", {
      value: frontendBucket.bucketName,
      description: "S3 Bucket for frontend deployment",
    });
  }
}
