import { GetTransactionUseCase } from './get-transaction.use-case';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/transaction.entity';
import { type TransactionRepository } from 'src/transactions/domain/transaction.repository';

const mockTransactionRepository: jest.Mocked<TransactionRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
};

const mockTransaction = new Transaction({
  id: 'tx-1',
  customerId: 'customer-1',
  productId: 'product-1',
  quantity: 1,
  productAmount: 50000,
  baseFee: 5000,
  deliveryFee: 10000,
  totalAmount: 65000,
  status: TransactionStatus.PENDING,
  wompiTransactionId: '',
  createdAt: new Date('2025-01-01'),
});

describe('GetTransactionUseCase', () => {
  let useCase: GetTransactionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetTransactionUseCase(mockTransactionRepository);
  });

  it('should return a transaction when found', async () => {
    mockTransactionRepository.findById.mockResolvedValue(mockTransaction);

    const result = await useCase.execute('tx-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe('tx-1');
      expect(result.value.status).toBe(TransactionStatus.PENDING);
    }
  });

  it('should return error when transaction not found', async () => {
    mockTransactionRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Transaction not found');
    }
  });
});
