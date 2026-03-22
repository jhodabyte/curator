import { Module } from '@nestjs/common';
import { CustomerOrmEntity } from './infraestructure/typeorm/customer.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CUSTOMER_REPOSITORY } from './domain/customer.repository';
import { TypeOrmCustomerRepository } from './infraestructure/typeorm/typeorm-customer.repository';
import { CustomersController } from './infrastructure/http/customers.controller';
import { GetCustomerUseCase } from './application/use-cases/get-customer.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomersController],
  providers: [
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: TypeOrmCustomerRepository,
    },
    GetCustomerUseCase,
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomersModule {}
