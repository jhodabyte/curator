import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TRANSACTION_REPOSITORY } from './domain/transaction.repository';
import { TransactionOrmEntity } from './infrastructure/typeorm/transaction.orm-entity';
import { TypeOrmTransactionRepository } from './infrastructure/typeorm/typeorm-transaction.repository';
import { TransactionController } from './infrastructure/http/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { UpdateTransactionStatusUseCase } from './application/use-cases/update-transaction-status.use-case';
import { CustomersModule } from 'src/customers/customers.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity]),
    CustomersModule,
    ProductsModule,
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    GetTransactionUseCase,
    UpdateTransactionStatusUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TypeOrmTransactionRepository,
    },
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionModule {}
