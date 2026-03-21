import { Module } from '@nestjs/common';
import { CustomerOrmEntity } from './infraestructure/typeorm/customer.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_REPOSITORY } from './domain/customer.repository';
import { TypeOrmCustomerRepository } from './infraestructure/typeorm/typeorm-customer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  providers: [
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: TypeOrmCustomerRepository,
    },
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomersModule {}
