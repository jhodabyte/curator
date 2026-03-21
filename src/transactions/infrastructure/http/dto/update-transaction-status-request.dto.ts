import { TransactionStatus } from '../../../domain/transaction.entity';

export class UpdateTransactionStatusRequestDto {
  wompiTransactionId: string;
  status: TransactionStatus;
}
