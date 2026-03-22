import { TypeOrmProductRepository } from './typeorm-product.repository';
import { ProductOrmEntity } from './product.orm-entity';
import { ProductImageOrmEntity } from './product-image.orm-entity';
import { Product } from 'src/products/domain/product.entity';

const mockOrmRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn<Promise<ProductOrmEntity>, [ProductOrmEntity]>(),
};

const createImageOrm = (url: string): ProductImageOrmEntity => {
  const img = new ProductImageOrmEntity();
  img.url = url;
  return img;
};

describe('TypeOrmProductRepository', () => {
  let repository: TypeOrmProductRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TypeOrmProductRepository(mockOrmRepo as any);
  });

  describe('findAll', () => {
    it('should return all products mapped to domain with images', async () => {
      const ormEntity = Object.assign(new ProductOrmEntity(), {
        id: '1',
        name: 'Product 1',
        description: 'Desc',
        price: '50000.00',
        stock: 10,
        images: [createImageOrm('http://img.com/a.png')],
      });
      mockOrmRepo.find.mockResolvedValue([ormEntity]);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[0].id).toBe('1');
      expect(result[0].price).toBe(50000);
      expect(result[0].images).toEqual(['http://img.com/a.png']);
    });

    it('should return empty array when no entities', async () => {
      mockOrmRepo.find.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      const ormEntity = Object.assign(new ProductOrmEntity(), {
        id: '1',
        name: 'Product 1',
        description: 'Desc',
        price: '25000.00',
        stock: 5,
        images: [
          createImageOrm('http://img.com/a.png'),
          createImageOrm('http://img.com/b.png'),
        ],
      });
      mockOrmRepo.findOne.mockResolvedValue(ormEntity);

      const result = await repository.findById('1');

      expect(result).toBeInstanceOf(Product);
      expect(result?.id).toBe('1');
      expect(result?.price).toBe(25000);
      expect(result?.images).toEqual([
        'http://img.com/a.png',
        'http://img.com/b.png',
      ]);
    });

    it('should return null when not found', async () => {
      mockOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save product with images as ORM entities', async () => {
      const product = new Product({
        id: '1',
        name: 'Product 1',
        description: 'Desc',
        price: 50000,
        stock: 10,
        images: ['http://img.com/a.png', 'http://img.com/b.png'],
      });

      await repository.save(product);

      expect(mockOrmRepo.save).toHaveBeenCalledTimes(1);
      const savedEntity = mockOrmRepo.save.mock.calls[0][0];
      expect(savedEntity.id).toBe('1');
      expect(savedEntity.name).toBe('Product 1');
      expect(savedEntity.price).toBe(50000);
      expect(savedEntity.stock).toBe(10);
      expect(savedEntity.images).toHaveLength(2);
      expect(savedEntity.images[0].url).toBe('http://img.com/a.png');
      expect(savedEntity.images[1].url).toBe('http://img.com/b.png');
    });
  });
});
