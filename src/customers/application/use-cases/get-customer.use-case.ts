import { Inject, Injectable } from '@nestjs/common';
import { Customer } from 'src/customers/domain/customer.entity';
import {
  CUSTOMER_REPOSITORY,
  type CustomerRepository,
} from 'src/customers/domain/customer.repository';
import { err, ok, Result } from 'src/shared/result';

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(id: string): Promise<Result<Customer>> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) return err('Customer not found');
    return ok(customer);
  }
}
