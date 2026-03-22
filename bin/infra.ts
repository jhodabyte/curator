#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'CuratorStack', {
  env: {
    account: '446091108148',
    region: 'us-east-1',
  },
});
