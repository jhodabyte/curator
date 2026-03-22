import { ProcessPaymentUseCase } from './process-payment.use-case';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/transaction.entity';
import { Product } from 'src/products/domain/product.entity';
import { Customer } from 'src/customers/domain/customer.entity';
import {
  type PaymentRequest,
  type PaymentResponse,
} from 'src/transactions/domain/payment-gateway';

const mockTransactionRepository = {
  findById: jest.fn<Promise<Transaction | null>, [string]>(),
  save: jest.fn<Promise<void>, [Transaction]>(),
};

const mockProductRepository = {
  findAll: jest.fn<Promise<Product[]>, []>(),
  findById: jest.fn<Promise<Product | null>, [string]>(),
  save: jest.fn<Promise<void>, [Product]>(),
};

const mockCustomerRepository = {
  findById: jest.fn<Promise<Customer | null>, [string]>(),
  findByEmail: jest.fn<Promise<Customer | null>, [string]>(),
  save: jest.fn<Promise<void>, [Customer]>(),
};

const mockPaymentGateway = {
  getAcceptanceToken: jest.fn<Promise<string>, []>(),
  generateSignature: jest.fn<string, [string, number, string]>(),
  createTransaction: jest.fn<Promise<PaymentResponse>, [PaymentRequest]>(),
  getTransactionStatus: jest.fn<Promise<PaymentResponse>, [string]>(),
};

const createMockTransaction = (
  overrides: Partial<{
    status: TransactionStatus;
    wompiTransactionId: string;
  }> = {},
) =>
  new Transaction({
    id: 'tx-1',
    customerId: 'customer-1',
    productId: 'product-1',
    quantity: 2,
    productAmount: 100000,
    baseFee: 5000,
    deliveryFee: 10000,
    totalAmount: 115000,
    status: overrides.status ?? TransactionStatus.PENDING,
    wompiTransactionId: overrides.wompiTransactionId ?? '',
    createdAt: new Date('2025-01-01'),
  });

const mockCustomer = new Customer({
  id: 'customer-1',
  name: 'John Doe',
  email: 'john@test.com',
  phone: '3001234567',
});

const mockProduct = new Product({
  id: 'product-1',
  name: 'Test Product',
  description: 'Desc',
  price: 50000,
  stock: 10,
});

const validInput = {
  transactionId: 'tx-1',
  cardToken: 'tok_test_123',
  installments: 1,
};

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    useCase = new ProcessPaymentUseCase(
      mockTransactionRepository,
      mockProductRepository,
      mockCustomerRepository,
      mockPaymentGateway,
    );
  });

  it('should process an approved payment successfully', async () => {
    mockTransactionRepository.findById.mockResolvedValue(
      createMockTransaction(),
    );
    mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
    mockPaymentGateway.getAcceptanceToken.mockResolvedValue('acceptance-token');
    mockPaymentGateway.generateSignature.mockReturnValue('signature-hash');
    mockPaymentGateway.createTransaction.mockResolvedValue({
      id: 'wompi-tx-1',
      status: 'APPROVED',
      reference: 'tx-1',
    });
    mockProductRepository.findById.mockResolvedValue(mockProduct);
    mockProductRepository.save.mockResolvedValue(undefined);
    mockTransactionRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe(TransactionStatus.COMPLETED);
      expect(result.value.wompiTransactionId).toBe('wompi-tx-1');
    }
    expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
    expect(mockTransactionRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should process a declined payment', async () => {
    mockTransactionRepository.findById.mockResolvedValue(
      createMockTransaction(),
    );
    mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
    mockPaymentGateway.getAcceptanceToken.mockResolvedValue('acceptance-token');
    mockPaymentGateway.generateSignature.mockReturnValue('signature-hash');
    mockPaymentGateway.createTransaction.mockResolvedValue({
      id: 'wompi-tx-1',
      status: 'DECLINED',
      reference: 'tx-1',
    });
    mockTransactionRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe(TransactionStatus.FAILED);
    }
    expect(mockProductRepository.save).not.toHaveBeenCalled();
  });

  it('should return error when transaction not found', async () => {
    mockTransactionRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Transaction not found');
    }
  });

  it('should return error when transaction already processed', async () => {
    mockTransactionRepository.findById.mockResolvedValue(
      createMockTransaction({ status: TransactionStatus.COMPLETED }),
    );

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Transaction already processed');
    }
  });

  it('should return error when customer not found', async () => {
    mockTransactionRepository.findById.mockResolvedValue(
      createMockTransaction(),
    );
    mockCustomerRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Customer not found');
    }
  });

  it('should decrement stock by transaction quantity on approval', async () => {
    const product = new Product({
      id: 'product-1',
      name: 'Test',
      description: 'Desc',
      price: 50000,
      stock: 10,
    });

    mockTransactionRepository.findById.mockResolvedValue(
      createMockTransaction(),
    );
    mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
    mockPaymentGateway.getAcceptanceToken.mockResolvedValue('token');
    mockPaymentGateway.generateSignature.mockReturnValue('sig');
    mockPaymentGateway.createTransaction.mockResolvedValue({
      id: 'wompi-1',
      status: 'APPROVED',
      reference: 'tx-1',
    });
    mockProductRepository.findById.mockResolvedValue(product);
    mockProductRepository.save.mockResolvedValue(undefined);
    mockTransactionRepository.save.mockResolvedValue(undefined);

    await useCase.execute(validInput);

    expect(product.stock).toBe(8);
  });

  it('should poll when Wompi returns PENDING and approve on APPROVED', async () => {
    mockTransactionRepository.findById.mockResolvedValue(
      createMockTransaction(),
    );
    mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
    mockPaymentGateway.getAcceptanceToken.mockResolvedValue('token');
    mockPaymentGateway.generateSignature.mockReturnValue('sig');
    mockPaymentGateway.createTransaction.mockResolvedValue({
      id: 'wompi-1',
      status: 'PENDING',
      reference: 'tx-1',
    });
    mockPaymentGateway.getTransactionStatus
      .mockResolvedValueOnce({
        id: 'wompi-1',
        status: 'PENDING',
        reference: 'tx-1',
      })
      .mockResolvedValueOnce({
        id: 'wompi-1',
        status: 'APPROVED',
        reference: 'tx-1',
      });
    mockProductRepository.findById.mockResolvedValue(mockProduct);
    mockProductRepository.save.mockResolvedValue(undefined);
    mockTransactionRepository.save.mockResolvedValue(undefined);

    const executePromise = useCase.execute(validInput);
    await jest.advanceTimersByTimeAsync(5000);
    await jest.advanceTimersByTimeAsync(5000);
    const result = await executePromise;

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe(TransactionStatus.COMPLETED);
    }
    expect(mockPaymentGateway.getTransactionStatus).toHaveBeenCalledTimes(2);
  });

  it('should return ERROR status after max polling attempts', async () => {
    mockTransactionRepository.findById.mockResolvedValue(
      createMockTransaction(),
    );
    mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
    mockPaymentGateway.getAcceptanceToken.mockResolvedValue('token');
    mockPaymentGateway.generateSignature.mockReturnValue('sig');
    mockPaymentGateway.createTransaction.mockResolvedValue({
      id: 'wompi-1',
      status: 'PENDING',
      reference: 'tx-1',
    });
    mockPaymentGateway.getTransactionStatus.mockResolvedValue({
      id: 'wompi-1',
      status: 'PENDING',
      reference: 'tx-1',
    });
    mockTransactionRepository.save.mockResolvedValue(undefined);

    const executePromise = useCase.execute(validInput);
    for (let i = 0; i < 12; i++) {
      await jest.advanceTimersByTimeAsync(5000);
    }
    const result = await executePromise;

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe(TransactionStatus.FAILED);
    }
    expect(mockPaymentGateway.getTransactionStatus).toHaveBeenCalledTimes(12);
  });

  it('should return error when product not found during approval', async () => {
    mockTransactionRepository.findById.mockResolvedValue(
      createMockTransaction(),
    );
    mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
    mockPaymentGateway.getAcceptanceToken.mockResolvedValue('token');
    mockPaymentGateway.generateSignature.mockReturnValue('sig');
    mockPaymentGateway.createTransaction.mockResolvedValue({
      id: 'wompi-1',
      status: 'APPROVED',
      reference: 'tx-1',
    });
    mockProductRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Product not found');
    }
  });

  it('should call payment gateway with correct parameters', async () => {
    mockTransactionRepository.findById.mockResolvedValue(
      createMockTransaction(),
    );
    mockCustomerRepository.findById.mockResolvedValue(mockCustomer);
    mockPaymentGateway.getAcceptanceToken.mockResolvedValue('acceptance-token');
    mockPaymentGateway.generateSignature.mockReturnValue('signature-hash');
    mockPaymentGateway.createTransaction.mockResolvedValue({
      id: 'wompi-1',
      status: 'DECLINED',
      reference: 'tx-1',
    });
    mockTransactionRepository.save.mockResolvedValue(undefined);

    await useCase.execute(validInput);

    expect(mockPaymentGateway.createTransaction).toHaveBeenCalledWith({
      amountInCents: 11500000,
      currency: 'COP',
      customerEmail: 'john@test.com',
      reference: 'tx-1',
      cardToken: 'tok_test_123',
      installments: 1,
      acceptanceToken: 'acceptance-token',
      signature: 'signature-hash',
    });
  });
});
