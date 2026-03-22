import { InjectRepository } from '@nestjs/typeorm';
import { CustomerOrmEntity } from './customer.orm-entity';
import { Repository } from 'typeorm';
import { CustomerRepository } from 'src/customers/domain/customer.repository';
import { Customer } from 'src/customers/domain/customer.entity';

export class TypeOrmCustomerRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customerRepository: Repository<CustomerOrmEntity>,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const entity = await this.customerRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async save(customer: Customer): Promise<void> {
    const entity = this.toOrmEntity(customer);
    await this.customerRepository.save(entity);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const entity = await this.customerRepository.findOne({ where: { email } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  private toOrmEntity(customer: Customer): CustomerOrmEntity {
    const entity = new CustomerOrmEntity();
    entity.id = customer.id;
    entity.name = customer.name;
    entity.email = customer.email;
    entity.phone = customer.phone;
    return entity;
  }

  private toDomain(entity: CustomerOrmEntity): Customer {
    return new Customer({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
    });
  }
}
