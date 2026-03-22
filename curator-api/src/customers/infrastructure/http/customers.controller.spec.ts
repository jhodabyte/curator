import { HttpException } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { GetCustomerUseCase } from 'src/customers/application/use-cases/get-customer.use-case';
import { Customer } from 'src/customers/domain/customer.entity';
import { ok, err } from 'src/shared/result';

const mockUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetCustomerUseCase>;

describe('CustomersController', () => {
  let controller: CustomersController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new CustomersController(mockUseCase);
  });

  it('returns dto on success', async () => {
    const customer = new Customer({
      id: 'c1',
      name: 'John',
      email: 'j@x.com',
      phone: '300',
    });
    mockUseCase.execute.mockResolvedValue(ok(customer));

    const result = await controller.findById('c1');

    expect(result.id).toBe('c1');
    expect(result.email).toBe('j@x.com');
  });

  it('throws when not found', async () => {
    mockUseCase.execute.mockResolvedValue(err('Customer not found'));

    await expect(controller.findById('x')).rejects.toThrow(HttpException);
  });
});
