import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../../domain/product.entity';

export class ProductResponseDto {
  @ApiProperty({ example: 'uuid-product-id' })
  id: string;

  @ApiProperty({ example: 'Laptop Pro 15' })
  name: string;

  @ApiProperty({ example: 'Laptop de alto rendimiento' })
  description: string;

  @ApiProperty({ example: 2500000 })
  price: number;

  @ApiProperty({ example: 10 })
  stock: number;

  @ApiProperty({ example: ['https://example.com/img1.png'] })
  images: string[];

  static fromDomain(product: Product): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = product.id;
    dto.name = product.name;
    dto.description = product.description;
    dto.price = product.price;
    dto.stock = product.stock;
    dto.images = product.images;
    return dto;
  }
}
