import { TransactionResponseDto } from './transaction-response.dto';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/transaction.entity';

describe('TransactionResponseDto', () => {
  it('should map domain transaction to response DTO', () => {
    const createdAt = new Date('2025-01-01');
    const transaction = new Transaction({
      id: 'tx-1',
      customerId: 'customer-1',
      productId: 'product-1',
      quantity: 2,
      productAmount: 100000,
      baseFee: 5000,
      deliveryFee: 10000,
      totalAmount: 115000,
      status: TransactionStatus.PENDING,
      wompiTransactionId: 'wompi-123',
      createdAt,
    });

    const dto = TransactionResponseDto.fromDomain(transaction);

    expect(dto.id).toBe('tx-1');
    expect(dto.customerId).toBe('customer-1');
    expect(dto.productId).toBe('product-1');
    expect(dto.quantity).toBe(2);
    expect(dto.productAmount).toBe(100000);
    expect(dto.baseFee).toBe(5000);
    expect(dto.deliveryFee).toBe(10000);
    expect(dto.totalAmount).toBe(115000);
    expect(dto.status).toBe(TransactionStatus.PENDING);
    expect(dto.wompiTransactionId).toBe('wompi-123');
    expect(dto.createdAt).toBe(createdAt);
  });
});
