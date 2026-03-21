import { Controller, Get } from '@nestjs/common';
import { GetProductsUseCase } from 'src/products/application/use-cases/get-products.use-case';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    const result = await this.getProductsUseCase.execute();
    if (!result.ok) return [];
    return result.value.map((product) =>
      ProductResponseDto.fromDomain(product),
    );
  }
}
