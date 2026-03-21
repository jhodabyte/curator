import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from 'src/products/domain/product.repository';
import { err, ok, Result } from 'src/shared/result';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/transaction.entity';
import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from 'src/transactions/domain/transaction.repository';

interface UpdateTransactionStatusInput {
  transactionId: string;
  wompiTransactionId: string;
  status: TransactionStatus;
}

@Injectable()
export class UpdateTransactionStatusUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    input: UpdateTransactionStatusInput,
  ): Promise<Result<Transaction>> {
    const transaction = await this.transactionRepository.findById(
      input.transactionId,
    );
    if (!transaction) return err('Transaction not found');

    if (transaction.status !== TransactionStatus.PENDING) {
      return err('Transaction already processed');
    }

    transaction.wompiTransactionId = input.wompiTransactionId;

    if (input.status === TransactionStatus.COMPLETED) {
      const product = await this.productRepository.findById(
        transaction.productId,
      );
      if (!product) return err('Product not found');

      for (let i = 0; i < transaction.quantity; i++) {
        product.decrementStock();
      }

      transaction.approve();
      await this.productRepository.save(product);
    } else {
      transaction.decline();
    }

    await this.transactionRepository.save(transaction);

    return ok(transaction);
  }
}
