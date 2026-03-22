import { Transaction } from './transaction.entity';

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  save(transaction: Transaction): Promise<void>;
}

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';
