import { GetCustomerUseCase } from './get-customer.use-case';
import { Customer } from 'src/customers/domain/customer.entity';
import { type CustomerRepository } from 'src/customers/domain/customer.repository';

describe('GetCustomerUseCase', () => {
  let useCase: GetCustomerUseCase;
  const mockRepository: jest.Mocked<Pick<CustomerRepository, 'findById'>> = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetCustomerUseCase(mockRepository as CustomerRepository);
  });

  it('returns customer when found', async () => {
    const customer = new Customer({
      id: 'c1',
      name: 'John',
      email: 'j@x.com',
      phone: '300',
    });
    mockRepository.findById.mockResolvedValue(customer);

    const result = await useCase.execute('c1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe('c1');
    }
  });

  it('returns error when not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('missing');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe('Customer not found');
    }
  });
});
