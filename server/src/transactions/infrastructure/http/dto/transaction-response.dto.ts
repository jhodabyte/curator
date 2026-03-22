import {
  Transaction,
  TransactionStatus,
} from '../../../domain/transaction.entity';

export class TransactionResponseDto {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
  status: TransactionStatus;
  wompiTransactionId: string;
  createdAt: Date;

  static fromDomain(transaction: Transaction): TransactionResponseDto {
    const dto = new TransactionResponseDto();
    dto.id = transaction.id;
    dto.customerId = transaction.customerId;
    dto.productId = transaction.productId;
    dto.quantity = transaction.quantity;
    dto.productAmount = transaction.productAmount;
    dto.baseFee = transaction.baseFee;
    dto.deliveryFee = transaction.deliveryFee;
    dto.totalAmount = transaction.totalAmount;
    dto.status = transaction.status;
    dto.wompiTransactionId = transaction.wompiTransactionId;
    dto.createdAt = transaction.createdAt;
    return dto;
  }
}
