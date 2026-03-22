import { InjectRepository } from '@nestjs/typeorm';
import { type TransactionRepository } from 'src/transactions/domain/transaction.repository';
import { TransactionOrmEntity } from './transaction.orm-entity';
import { Repository } from 'typeorm';
import { Transaction } from 'src/transactions/domain/transaction.entity';

export class TypeOrmTransactionRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly transactionRepository: Repository<TransactionOrmEntity>,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.transactionRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async save(transaction: Transaction): Promise<void> {
    const entity = this.toOrmEntity(transaction);
    await this.transactionRepository.save(entity);
  }

  private toOrmEntity(transaction: Transaction): TransactionOrmEntity {
    const entity = new TransactionOrmEntity();
    entity.id = transaction.id;
    entity.customerId = transaction.customerId;
    entity.productId = transaction.productId;
    entity.quantity = transaction.quantity;
    entity.productAmount = transaction.productAmount;
    entity.baseFee = transaction.baseFee;
    entity.deliveryFee = transaction.deliveryFee;
    entity.totalAmount = transaction.totalAmount;
    entity.status = transaction.status;
    entity.wompiTransactionId = transaction.wompiTransactionId;
    entity.createdAt = transaction.createdAt;
    return entity;
  }

  private toDomain(entity: TransactionOrmEntity): Transaction {
    return new Transaction({
      ...entity,
      productAmount: Number(entity.productAmount),
      baseFee: Number(entity.baseFee),
      deliveryFee: Number(entity.deliveryFee),
      totalAmount: Number(entity.totalAmount),
    });
  }
}
