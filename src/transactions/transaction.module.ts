import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TRANSACTION_REPOSITORY } from './domain/transaction.repository';
import { PAYMENT_GATEWAY } from './domain/payment-gateway';
import { TransactionOrmEntity } from './infrastructure/typeorm/transaction.orm-entity';
import { TypeOrmTransactionRepository } from './infrastructure/typeorm/typeorm-transaction.repository';
import { WompiPaymentGateway } from './infrastructure/wompi/wompi-payment-gateway';
import { TransactionController } from './infrastructure/http/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { CustomersModule } from 'src/customers/customers.module';
import { ProductsModule } from 'src/products/products.module';
import { DeliveriesModule } from 'src/deliveries/deliveries.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity]),
    CustomersModule,
    ProductsModule,
    DeliveriesModule,
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    GetTransactionUseCase,
    ProcessPaymentUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TypeOrmTransactionRepository,
    },
    {
      provide: PAYMENT_GATEWAY,
      useClass: WompiPaymentGateway,
    },
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionModule {}
