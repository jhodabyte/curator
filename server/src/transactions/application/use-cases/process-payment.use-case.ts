import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from 'src/customers/domain/customer.repository';
import {
  PRODUCT_REPOSITORY,
  type ProductRepository,
} from 'src/products/domain/product.repository';
import { err, ok, Result } from 'src/shared/result';
import {
  PAYMENT_GATEWAY,
  type PaymentGateway,
} from 'src/transactions/domain/payment-gateway';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/transaction.entity';
import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from 'src/transactions/domain/transaction.repository';
interface ProcessPaymentInput {
  transactionId: string;
  cardToken: string;
  installments: number;
}

const WOMPI_STATUS_MAP: Record<string, TransactionStatus> = {
  APPROVED: TransactionStatus.COMPLETED,
  DECLINED: TransactionStatus.FAILED,
  ERROR: TransactionStatus.FAILED,
  VOIDED: TransactionStatus.FAILED,
};

const MAX_POLLING_ATTEMPTS = 12;
const POLLING_INTERVAL_MS = 5000;

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
    @Inject(PAYMENT_GATEWAY)
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(input: ProcessPaymentInput): Promise<Result<Transaction>> {
    const transaction = await this.transactionRepository.findById(
      input.transactionId,
    );
    if (!transaction) return err('Transaction not found');

    if (transaction.status !== TransactionStatus.PENDING) {
      return err('Transaction already processed');
    }

    const customer = await this.customerRepository.findById(
      transaction.customerId,
    );
    if (!customer) return err('Customer not found');

    const acceptanceToken = await this.paymentGateway.getAcceptanceToken();

    const signature = this.paymentGateway.generateSignature(
      transaction.id,
      Math.round(transaction.totalAmount * 100),
      'COP',
    );

    const wompiResponse = await this.paymentGateway.createTransaction({
      amountInCents: Math.round(transaction.totalAmount * 100),
      currency: 'COP',
      customerEmail: customer.email,
      reference: transaction.id,
      cardToken: input.cardToken,
      installments: input.installments,
      acceptanceToken,
      signature,
    });

    transaction.wompiTransactionId = wompiResponse.id;

    let finalStatus = wompiResponse.status;

    if (finalStatus === 'PENDING') {
      finalStatus = await this.pollTransactionStatus(wompiResponse.id);
    }

    const mappedStatus = WOMPI_STATUS_MAP[finalStatus];

    if (mappedStatus === TransactionStatus.COMPLETED) {
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

  private async pollTransactionStatus(
    wompiTransactionId: string,
  ): Promise<string> {
    for (let i = 0; i < MAX_POLLING_ATTEMPTS; i++) {
      await this.delay(POLLING_INTERVAL_MS);

      const response =
        await this.paymentGateway.getTransactionStatus(wompiTransactionId);

      if (response.status !== 'PENDING') {
        return response.status;
      }
    }

    return 'ERROR';
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
