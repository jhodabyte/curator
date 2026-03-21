import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Customer } from 'src/customers/domain/customer.entity';
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
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/transaction.entity';

import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from 'src/transactions/domain/transaction.repository';

const BASE_FEE = 5000;
const DELIVERY_FEE = 10000;

interface CreateTransactionInput {
  productId: string;
  quantity: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Result<Transaction>> {
    const product = await this.productRepository.findById(input.productId);
    if (!product) return err('Product not found');

    if (!product.hasStock()) return err('Product out of stock');

    if (input.quantity > product.stock) return err('Insufficient stock');

    let customer = await this.customerRepository.findByEmail(
      input.customer.email,
    );

    if (!customer) {
      customer = new Customer({
        id: randomUUID(),
        name: input.customer.name,
        email: input.customer.email,
        phone: input.customer.phone,
      });

      await this.customerRepository.save(customer);
    }

    const productAmount = product.price * input.quantity;
    const totalAmount = productAmount + BASE_FEE + DELIVERY_FEE;

    const transaction = new Transaction({
      id: randomUUID(),
      customerId: customer.id,
      productId: product.id,
      quantity: input.quantity,
      productAmount,
      baseFee: BASE_FEE,
      deliveryFee: DELIVERY_FEE,
      totalAmount,
      status: TransactionStatus.PENDING,
      wompiTransactionId: '',
      createdAt: new Date(),
    });

    await this.transactionRepository.save(transaction);

    return ok(transaction);
  }
}
