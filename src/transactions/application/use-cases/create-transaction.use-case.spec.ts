import { CreateTransactionUseCase } from './create-transaction.use-case';
import { Product } from 'src/products/domain/product.entity';
import { Customer } from 'src/customers/domain/customer.entity';
import {
  Transaction,
  TransactionStatus,
} from 'src/transactions/domain/transaction.entity';
import { Delivery } from 'src/deliveries/domain/delivery.entity';

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

const mockDeliveryRepository = {
  findById: jest.fn<Promise<Delivery | null>, [string]>(),
  findByTransactionId: jest.fn<Promise<Delivery | null>, [string]>(),
  save: jest.fn<Promise<void>, [Delivery]>(),
};

const validInput = {
  productId: 'product-1',
  quantity: 1,
  customer: {
    name: 'John Doe',
    email: 'john@test.com',
    phone: '3001234567',
  },
  delivery: {
    address: 'Calle 123',
    city: 'Bogota',
  },
};

const mockProduct = new Product({
  id: 'product-1',
  name: 'Test Product',
  description: 'Desc',
  price: 50000,
  stock: 10,
});

const mockCustomer = new Customer({
  id: 'customer-1',
  name: 'John Doe',
  email: 'john@test.com',
  phone: '3001234567',
});

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateTransactionUseCase(
      mockTransactionRepository,
      mockProductRepository,
      mockCustomerRepository,
      mockDeliveryRepository,
    );
  });

  it('should create a transaction successfully', async () => {
    mockProductRepository.findById.mockResolvedValue(mockProduct);
    mockCustomerRepository.findByEmail.mockResolvedValue(mockCustomer);
    mockTransactionRepository.save.mockResolvedValue(undefined);
    mockDeliveryRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.productId).toBe('product-1');
      expect(result.value.customerId).toBe('customer-1');
      expect(result.value.quantity).toBe(1);
      expect(result.value.productAmount).toBe(50000);
      expect(result.value.baseFee).toBe(5000);
      expect(result.value.deliveryFee).toBe(10000);
      expect(result.value.totalAmount).toBe(65000);
      expect(result.value.status).toBe(TransactionStatus.PENDING);
    }
    expect(mockTransactionRepository.save).toHaveBeenCalledTimes(1);
    expect(mockDeliveryRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should return error when product not found', async () => {
    mockProductRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Product not found');
    }
  });

  it('should return error when product has no stock', async () => {
    const outOfStockProduct = new Product({
      id: 'product-1',
      name: 'Test',
      description: 'Desc',
      price: 50000,
      stock: 0,
    });
    mockProductRepository.findById.mockResolvedValue(outOfStockProduct);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Insufficient stock');
    }
  });

  it('should return error when quantity exceeds stock', async () => {
    const lowStockProduct = new Product({
      id: 'product-1',
      name: 'Test',
      description: 'Desc',
      price: 50000,
      stock: 2,
    });
    mockProductRepository.findById.mockResolvedValue(lowStockProduct);

    const result = await useCase.execute({ ...validInput, quantity: 5 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Insufficient stock');
    }
  });

  it('should create a new customer when not found by email', async () => {
    mockProductRepository.findById.mockResolvedValue(mockProduct);
    mockCustomerRepository.findByEmail.mockResolvedValue(null);
    mockCustomerRepository.save.mockResolvedValue(undefined);
    mockTransactionRepository.save.mockResolvedValue(undefined);
    mockDeliveryRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(true);
    expect(mockCustomerRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should reuse existing customer when found by email', async () => {
    mockProductRepository.findById.mockResolvedValue(mockProduct);
    mockCustomerRepository.findByEmail.mockResolvedValue(mockCustomer);
    mockTransactionRepository.save.mockResolvedValue(undefined);
    mockDeliveryRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute(validInput);

    expect(result.ok).toBe(true);
    expect(mockCustomerRepository.save).not.toHaveBeenCalled();
  });

  it('should calculate amounts correctly for multiple quantities', async () => {
    mockProductRepository.findById.mockResolvedValue(mockProduct);
    mockCustomerRepository.findByEmail.mockResolvedValue(mockCustomer);
    mockTransactionRepository.save.mockResolvedValue(undefined);
    mockDeliveryRepository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({ ...validInput, quantity: 3 });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.productAmount).toBe(150000);
      expect(result.value.totalAmount).toBe(165000);
    }
  });
});
