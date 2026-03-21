import { TypeOrmProductRepository } from './typeorm-product.repository';
import { ProductOrmEntity } from './product.orm-entity';
import { Product } from 'src/products/domain/product.entity';

const mockOrmRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn<Promise<ProductOrmEntity>, [ProductOrmEntity]>(),
};

describe('TypeOrmProductRepository', () => {
  let repository: TypeOrmProductRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TypeOrmProductRepository(mockOrmRepo as any);
  });

  describe('findAll', () => {
    it('should return all products mapped to domain', async () => {
      const ormEntity = Object.assign(new ProductOrmEntity(), {
        id: '1',
        name: 'Product 1',
        description: 'Desc',
        price: '50000.00',
        stock: 10,
        imageUrl: undefined,
      });
      mockOrmRepo.find.mockResolvedValue([ormEntity]);

      const result = await repository.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[0].id).toBe('1');
      expect(result[0].price).toBe(50000);
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
      });
      mockOrmRepo.findOne.mockResolvedValue(ormEntity);

      const result = await repository.findById('1');

      expect(result).toBeInstanceOf(Product);
      expect(result?.id).toBe('1');
      expect(result?.price).toBe(25000);
    });

    it('should return null when not found', async () => {
      mockOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save product as ORM entity', async () => {
      const product = new Product({
        id: '1',
        name: 'Product 1',
        description: 'Desc',
        price: 50000,
        stock: 10,
        imageUrl: 'http://img.com/test.png',
      });

      await repository.save(product);

      expect(mockOrmRepo.save).toHaveBeenCalledTimes(1);
      const savedEntity = mockOrmRepo.save.mock.calls[0][0];
      expect(savedEntity.id).toBe('1');
      expect(savedEntity.name).toBe('Product 1');
      expect(savedEntity.price).toBe(50000);
      expect(savedEntity.stock).toBe(10);
      expect(savedEntity.imageUrl).toBe('http://img.com/test.png');
    });
  });
});
