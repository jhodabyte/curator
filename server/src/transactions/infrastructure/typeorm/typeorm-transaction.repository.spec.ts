import { TypeOrmTransactionRepository } from './typeorm-transaction.repository';
import { TransactionOrmEntity } from './transaction.orm-entity';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/transaction.entity';

const mockOrmRepo = {
  findOne: jest.fn(),
  save: jest.fn<Promise<TransactionOrmEntity>, [TransactionOrmEntity]>(),
};

describe('TypeOrmTransactionRepository', () => {
  let repository: TypeOrmTransactionRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TypeOrmTransactionRepository(mockOrmRepo as any);
  });

  describe('findById', () => {
    it('should return transaction when found', async () => {
      const ormEntity = Object.assign(new TransactionOrmEntity(), {
        id: 'tx-1',
        customerId: 'c-1',
        productId: 'p-1',
        quantity: 2,
        productAmount: '100000.00',
        baseFee: '5000.00',
        deliveryFee: '10000.00',
        totalAmount: '115000.00',
        status: TransactionStatus.PENDING,
        wompiTransactionId: '',
        createdAt: new Date('2025-01-01'),
      });
      mockOrmRepo.findOne.mockResolvedValue(ormEntity);

      const result = await repository.findById('tx-1');

      expect(result).toBeInstanceOf(Transaction);
      expect(result?.id).toBe('tx-1');
      expect(result?.productAmount).toBe(100000);
      expect(result?.totalAmount).toBe(115000);
    });

    it('should return null when not found', async () => {
      mockOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save transaction as ORM entity', async () => {
      const transaction = new Transaction({
        id: 'tx-1',
        customerId: 'c-1',
        productId: 'p-1',
        quantity: 2,
        productAmount: 100000,
        baseFee: 5000,
        deliveryFee: 10000,
        totalAmount: 115000,
        status: TransactionStatus.PENDING,
        wompiTransactionId: 'wompi-123',
        createdAt: new Date('2025-01-01'),
      });

      await repository.save(transaction);

      expect(mockOrmRepo.save).toHaveBeenCalledTimes(1);
      const saved = mockOrmRepo.save.mock.calls[0][0];
      expect(saved.id).toBe('tx-1');
      expect(saved.totalAmount).toBe(115000);
      expect(saved.wompiTransactionId).toBe('wompi-123');
      expect(saved.status).toBe(TransactionStatus.PENDING);
    });
  });
});
