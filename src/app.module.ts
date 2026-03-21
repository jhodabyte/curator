import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { DataSource } from 'typeorm';
import { seedProducts } from './products/infraestructure/seed/product.seed';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'curator'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    await seedProducts(this.dataSource);
  }
}
