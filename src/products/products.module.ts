import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infraestructure/typeorm/product.orm-entity';
import { ProductsController } from './infraestructure/http/products.controller';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { PRODUCT_REPOSITORY } from './domain/product.repository';
import { TypeOrmProductRepository } from './infraestructure/typeorm/typeorm-product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    GetProductsUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: TypeOrmProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
