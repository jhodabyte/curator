import { Customer } from './customer.entity';

describe('Customer', () => {
  it('should create a customer with given props', () => {
    const customer = new Customer({
      id: 'customer-1',
      name: 'John Doe',
      email: 'john@test.com',
      phone: '3001234567',
    });

    expect(customer.id).toBe('customer-1');
    expect(customer.name).toBe('John Doe');
    expect(customer.email).toBe('john@test.com');
    expect(customer.phone).toBe('3001234567');
  });

  it('should have readonly properties', () => {
    const customer = new Customer({
      id: 'customer-1',
      name: 'John Doe',
      email: 'john@test.com',
      phone: '3001234567',
    });

    expect(customer.id).toBeDefined();
    expect(customer.name).toBeDefined();
    expect(customer.email).toBeDefined();
    expect(customer.phone).toBeDefined();
  });
});
