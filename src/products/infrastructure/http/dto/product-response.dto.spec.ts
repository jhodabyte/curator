import { ProductResponseDto } from './product-response.dto';
import { Product } from 'src/products/domain/product.entity';

describe('ProductResponseDto', () => {
  it('should map domain product to response DTO with images', () => {
    const product = new Product({
      id: '1',
      name: 'Laptop',
      description: 'A laptop',
      price: 2500000,
      stock: 10,
      images: ['http://img.com/a.png', 'http://img.com/b.png'],
    });

    const dto = ProductResponseDto.fromDomain(product);

    expect(dto.id).toBe('1');
    expect(dto.name).toBe('Laptop');
    expect(dto.description).toBe('A laptop');
    expect(dto.price).toBe(2500000);
    expect(dto.stock).toBe(10);
    expect(dto.images).toEqual(['http://img.com/a.png', 'http://img.com/b.png']);
  });

  it('should default images to empty array', () => {
    const product = new Product({
      id: '1',
      name: 'Laptop',
      description: 'A laptop',
      price: 2500000,
      stock: 10,
    });

    const dto = ProductResponseDto.fromDomain(product);

    expect(dto.images).toEqual([]);
  });
});
