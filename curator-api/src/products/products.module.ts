import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/typeorm/product.orm-entity';
import { ProductImageOrmEntity } from './infrastructure/typeorm/product-image.orm-entity';
import { ProductsController } from './infrastructure/http/products.controller';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { PRODUCT_REPOSITORY } from './domain/product.repository';
import { TypeOrmProductRepository } from './infrastructure/typeorm/typeorm-product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity, ProductImageOrmEntity])],
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
