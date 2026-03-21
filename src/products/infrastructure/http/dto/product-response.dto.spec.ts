import { ProductResponseDto } from './product-response.dto';
import { Product } from 'src/products/domain/product.entity';

describe('ProductResponseDto', () => {
  it('should map domain product to response DTO', () => {
    const product = new Product({
      id: '1',
      name: 'Laptop',
      description: 'A laptop',
      price: 2500000,
      stock: 10,
      imageUrl: 'http://img.com/laptop.png',
    });

    const dto = ProductResponseDto.fromDomain(product);

    expect(dto.id).toBe('1');
    expect(dto.name).toBe('Laptop');
    expect(dto.description).toBe('A laptop');
    expect(dto.price).toBe(2500000);
    expect(dto.stock).toBe(10);
    expect(dto.imageUrl).toBe('http://img.com/laptop.png');
  });

  it('should handle undefined imageUrl', () => {
    const product = new Product({
      id: '1',
      name: 'Laptop',
      description: 'A laptop',
      price: 2500000,
      stock: 10,
    });

    const dto = ProductResponseDto.fromDomain(product);

    expect(dto.imageUrl).toBeUndefined();
  });
});
