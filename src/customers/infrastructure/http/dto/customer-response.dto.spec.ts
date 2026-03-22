import { CustomerResponseDto } from './customer-response.dto';
import { Customer } from 'src/customers/domain/customer.entity';

describe('CustomerResponseDto', () => {
  it('maps domain to dto', () => {
    const customer = new Customer({
      id: 'c1',
      name: 'John',
      email: 'j@x.com',
      phone: '300',
    });

    const dto = CustomerResponseDto.fromDomain(customer);

    expect(dto.id).toBe('c1');
    expect(dto.name).toBe('John');
    expect(dto.email).toBe('j@x.com');
    expect(dto.phone).toBe('300');
  });
});
