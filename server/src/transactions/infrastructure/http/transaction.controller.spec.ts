import { HttpException } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { CreateTransactionUseCase } from 'src/transactions/application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from 'src/transactions/application/use-cases/get-transaction.use-case';
import { ProcessPaymentUseCase } from 'src/transactions/application/use-cases/process-payment.use-case';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/transaction.entity';
import { ok, err } from 'src/shared/result';

const mockCreateTransactionUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<CreateTransactionUseCase>;

const mockGetTransactionUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetTransactionUseCase>;

const mockProcessPaymentUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<ProcessPaymentUseCase>;

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

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new TransactionController(
      mockCreateTransactionUseCase,
      mockGetTransactionUseCase,
      mockProcessPaymentUseCase,
    );
  });

  describe('create', () => {
    it('should return transaction response on success', async () => {
      mockCreateTransactionUseCase.execute.mockResolvedValue(
        ok(mockTransaction),
      );

      const result = await controller.create({
        productId: 'product-1',
        quantity: 1,
        customer: { name: 'John', email: 'john@test.com', phone: '300123' },
        delivery: { address: 'Calle 123', city: 'Bogota' },
      });

      expect(result.id).toBe('tx-1');
      expect(result.totalAmount).toBe(65000);
      expect(result.status).toBe(TransactionStatus.PENDING);
    });

    it('should throw HttpException on error', async () => {
      mockCreateTransactionUseCase.execute.mockResolvedValue(
        err('Product not found'),
      );

      await expect(
        controller.create({
          productId: 'bad-id',
          quantity: 1,
          customer: { name: 'John', email: 'john@test.com', phone: '300123' },
          delivery: { address: 'Calle 123', city: 'Bogota' },
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findById', () => {
    it('should return transaction response when found', async () => {
      mockGetTransactionUseCase.execute.mockResolvedValue(ok(mockTransaction));

      const result = await controller.findById('tx-1');

      expect(result.id).toBe('tx-1');
    });

    it('should throw HttpException when not found', async () => {
      mockGetTransactionUseCase.execute.mockResolvedValue(
        err('Transaction not found'),
      );

      await expect(controller.findById('bad-id')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('processPayment', () => {
    it('should return updated transaction on success', async () => {
      const completedTx = new Transaction({
        ...mockTransaction,
        status: TransactionStatus.COMPLETED,
        wompiTransactionId: 'wompi-1',
      });
      mockProcessPaymentUseCase.execute.mockResolvedValue(ok(completedTx));

      const result = await controller.processPayment('tx-1', {
        cardToken: 'tok_123',
        installments: 1,
      });

      expect(result.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should throw HttpException on payment error', async () => {
      mockProcessPaymentUseCase.execute.mockResolvedValue(
        err('Transaction already processed'),
      );

      await expect(
        controller.processPayment('tx-1', {
          cardToken: 'tok_123',
          installments: 1,
        }),
      ).rejects.toThrow(HttpException);
    });
  });
});
