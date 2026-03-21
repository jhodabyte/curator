import { TransactionStatus } from 'src/transactions/domain/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  productAmount: number;

  @Column()
  baseFee: number;

  @Column()
  deliveryFee: number;

  @Column()
  totalAmount: number;

  @Column()
  status: TransactionStatus;

  @Column({ nullable: true })
  wompiTransactionId: string;

  @CreateDateColumn()
  createdAt: Date;
}
