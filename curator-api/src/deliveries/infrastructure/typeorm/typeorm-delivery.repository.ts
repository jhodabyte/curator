import { InjectRepository } from '@nestjs/typeorm';
import { type DeliveryRepository } from 'src/deliveries/domain/delivery.repository';
import { DeliveryOrmEntity } from './delivery.orm-entity';
import { Repository } from 'typeorm';
import { Delivery } from 'src/deliveries/domain/delivery.entity';

export class TypeOrmDeliveryRepository implements DeliveryRepository {
  constructor(
    @InjectRepository(DeliveryOrmEntity)
    private readonly deliveryRepository: Repository<DeliveryOrmEntity>,
  ) {}

  async findById(id: string): Promise<Delivery | null> {
    const entity = await this.deliveryRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    const entity = await this.deliveryRepository.findOne({
      where: { transactionId },
    });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async save(delivery: Delivery): Promise<void> {
    const entity = this.toOrmEntity(delivery);
    await this.deliveryRepository.save(entity);
  }

  private toOrmEntity(delivery: Delivery): DeliveryOrmEntity {
    const entity = new DeliveryOrmEntity();
    entity.id = delivery.id;
    entity.transactionId = delivery.transactionId;
    entity.customerId = delivery.customerId;
    entity.productId = delivery.productId;
    entity.quantity = delivery.quantity;
    entity.address = delivery.address;
    entity.city = delivery.city;
    entity.status = delivery.status;
    entity.createdAt = delivery.createdAt;
    return entity;
  }

  private toDomain(entity: DeliveryOrmEntity): Delivery {
    return new Delivery({
      id: entity.id,
      transactionId: entity.transactionId,
      customerId: entity.customerId,
      productId: entity.productId,
      quantity: entity.quantity,
      address: entity.address,
      city: entity.city,
      status: entity.status,
      createdAt: entity.createdAt,
    });
  }
}
