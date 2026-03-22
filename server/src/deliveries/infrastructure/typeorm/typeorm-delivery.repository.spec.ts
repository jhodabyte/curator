import { TypeOrmDeliveryRepository } from './typeorm-delivery.repository';
import { DeliveryOrmEntity } from './delivery.orm-entity';
import {
  Delivery,
  DeliveryStatus,
} from 'src/deliveries/domain/delivery.entity';

const mockOrmRepo = {
  findOne: jest.fn(),
  save: jest.fn<Promise<DeliveryOrmEntity>, [DeliveryOrmEntity]>(),
};

describe('TypeOrmDeliveryRepository', () => {
  let repository: TypeOrmDeliveryRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TypeOrmDeliveryRepository(mockOrmRepo as any);
  });

  describe('findById', () => {
    it('should return delivery when found', async () => {
      const ormEntity = Object.assign(new DeliveryOrmEntity(), {
        id: 'd-1',
        transactionId: 'tx-1',
        customerId: 'c-1',
        productId: 'p-1',
        quantity: 1,
        address: 'Calle 123',
        city: 'Bogota',
        status: DeliveryStatus.PENDING,
        createdAt: new Date('2025-01-01'),
      });
      mockOrmRepo.findOne.mockResolvedValue(ormEntity);

      const result = await repository.findById('d-1');

      expect(result).toBeInstanceOf(Delivery);
      expect(result?.id).toBe('d-1');
      expect(result?.address).toBe('Calle 123');
    });

    it('should return null when not found', async () => {
      mockOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByTransactionId', () => {
    it('should return delivery when found by transactionId', async () => {
      const ormEntity = Object.assign(new DeliveryOrmEntity(), {
        id: 'd-1',
        transactionId: 'tx-1',
        customerId: 'c-1',
        productId: 'p-1',
        quantity: 1,
        address: 'Calle 123',
        city: 'Bogota',
        status: DeliveryStatus.PENDING,
        createdAt: new Date('2025-01-01'),
      });
      mockOrmRepo.findOne.mockResolvedValue(ormEntity);

      const result = await repository.findByTransactionId('tx-1');

      expect(result).toBeInstanceOf(Delivery);
      expect(result?.transactionId).toBe('tx-1');
    });

    it('should return null when not found by transactionId', async () => {
      mockOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findByTransactionId('no-tx');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save delivery as ORM entity', async () => {
      const delivery = new Delivery({
        id: 'd-1',
        transactionId: 'tx-1',
        customerId: 'c-1',
        productId: 'p-1',
        quantity: 1,
        address: 'Calle 123',
        city: 'Bogota',
        status: DeliveryStatus.PENDING,
        createdAt: new Date('2025-01-01'),
      });

      await repository.save(delivery);

      expect(mockOrmRepo.save).toHaveBeenCalledTimes(1);
      const saved = mockOrmRepo.save.mock.calls[0][0];
      expect(saved.id).toBe('d-1');
      expect(saved.transactionId).toBe('tx-1');
      expect(saved.address).toBe('Calle 123');
      expect(saved.status).toBe(DeliveryStatus.PENDING);
    });
  });
});
