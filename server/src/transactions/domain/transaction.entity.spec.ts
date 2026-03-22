import {
  Transaction,
  TransactionStatus,
  type TransactionProps,
} from './transaction.entity';

const createTransaction = (
  overrides: Partial<TransactionProps> = {},
): Transaction =>
  new Transaction({
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
    ...overrides,
  });

describe('Transaction', () => {
  it('should create a transaction with given props', () => {
    const tx = createTransaction();

    expect(tx.id).toBe('tx-1');
    expect(tx.customerId).toBe('customer-1');
    expect(tx.productId).toBe('product-1');
    expect(tx.quantity).toBe(1);
    expect(tx.productAmount).toBe(50000);
    expect(tx.baseFee).toBe(5000);
    expect(tx.deliveryFee).toBe(10000);
    expect(tx.totalAmount).toBe(65000);
    expect(tx.status).toBe(TransactionStatus.PENDING);
    expect(tx.wompiTransactionId).toBe('');
  });

  describe('approve', () => {
    it('should change status to COMPLETED when PENDING', () => {
      const tx = createTransaction();

      tx.approve();

      expect(tx.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should throw when approving a COMPLETED transaction', () => {
      const tx = createTransaction({ status: TransactionStatus.COMPLETED });

      expect(() => tx.approve()).toThrow('Transaction not pending');
    });

    it('should throw when approving a FAILED transaction', () => {
      const tx = createTransaction({ status: TransactionStatus.FAILED });

      expect(() => tx.approve()).toThrow('Transaction not pending');
    });
  });

  describe('decline', () => {
    it('should change status to FAILED when PENDING', () => {
      const tx = createTransaction();

      tx.decline();

      expect(tx.status).toBe(TransactionStatus.FAILED);
    });

    it('should throw when declining a COMPLETED transaction', () => {
      const tx = createTransaction({ status: TransactionStatus.COMPLETED });

      expect(() => tx.decline()).toThrow('Transaction not pending');
    });

    it('should throw when declining a FAILED transaction', () => {
      const tx = createTransaction({ status: TransactionStatus.FAILED });

      expect(() => tx.decline()).toThrow('Transaction not pending');
    });
  });

  describe('wompiTransactionId', () => {
    it('should get wompiTransactionId', () => {
      const tx = createTransaction({ wompiTransactionId: 'wompi-123' });

      expect(tx.wompiTransactionId).toBe('wompi-123');
    });

    it('should set wompiTransactionId', () => {
      const tx = createTransaction();

      tx.wompiTransactionId = 'wompi-456';

      expect(tx.wompiTransactionId).toBe('wompi-456');
    });
  });
});
