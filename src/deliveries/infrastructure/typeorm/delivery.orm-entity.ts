import { DeliveryStatus } from 'src/deliveries/domain/delivery.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('deliveries')
export class DeliveryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transactionId: string;

  @Column()
  customerId: string;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ type: 'varchar', default: DeliveryStatus.PENDING })
  status: DeliveryStatus;

  @CreateDateColumn()
  createdAt: Date;
}
