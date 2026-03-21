import { Product } from '../../../domain/product.entity';

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
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
