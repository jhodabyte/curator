import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'src/transactions/domain/transaction.entity';
import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from 'src/transactions/domain/transaction.repository';
import { err, ok, Result } from 'src/shared/result';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(id: string): Promise<Result<Transaction>> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) return err('Transaction not found');
    return ok(transaction);
  }
}
