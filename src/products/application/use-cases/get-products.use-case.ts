import { Inject, Injectable } from '@nestjs/common';
import { Product } from 'src/products/domain/product.entity';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from 'src/products/domain/product.repository';
import { ok, Result } from 'src/shared/result';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(): Promise<Result<Product[]>> {
    const products = await this.productRepository.findAll();
    return ok(products);
  }
}
