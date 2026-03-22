import { TypeOrmCustomerRepository } from './typeorm-customer.repository';
import { CustomerOrmEntity } from './customer.orm-entity';
import { Customer } from 'src/customers/domain/customer.entity';

const mockOrmRepo = {
  findOne: jest.fn(),
  save: jest.fn<Promise<CustomerOrmEntity>, [CustomerOrmEntity]>(),
};

describe('TypeOrmCustomerRepository', () => {
  let repository: TypeOrmCustomerRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TypeOrmCustomerRepository(mockOrmRepo as any);
  });

  describe('findById', () => {
    it('should return customer when found', async () => {
      const ormEntity = Object.assign(new CustomerOrmEntity(), {
        id: '1',
        name: 'John',
        email: 'john@test.com',
        phone: '300123',
      });
      mockOrmRepo.findOne.mockResolvedValue(ormEntity);

      const result = await repository.findById('1');

      expect(result).toBeInstanceOf(Customer);
      expect(result?.id).toBe('1');
      expect(result?.email).toBe('john@test.com');
    });

    it('should return null when not found', async () => {
      mockOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return customer when found by email', async () => {
      const ormEntity = Object.assign(new CustomerOrmEntity(), {
        id: '1',
        name: 'John',
        email: 'john@test.com',
        phone: '300123',
      });
      mockOrmRepo.findOne.mockResolvedValue(ormEntity);

      const result = await repository.findByEmail('john@test.com');

      expect(result).toBeInstanceOf(Customer);
      expect(result?.email).toBe('john@test.com');
    });

    it('should return null when not found by email', async () => {
      mockOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByEmail('not@found.com');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save customer as ORM entity', async () => {
      const customer = new Customer({
        id: '1',
        name: 'John',
        email: 'john@test.com',
        phone: '300123',
      });

      await repository.save(customer);

      expect(mockOrmRepo.save).toHaveBeenCalledTimes(1);
      const saved = mockOrmRepo.save.mock.calls[0][0];
      expect(saved.id).toBe('1');
      expect(saved.email).toBe('john@test.com');
    });
  });
});
