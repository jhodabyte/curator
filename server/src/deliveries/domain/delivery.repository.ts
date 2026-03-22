import { Delivery } from './delivery.entity';

export interface DeliveryRepository {
  findById(id: string): Promise<Delivery | null>;
  findByTransactionId(transactionId: string): Promise<Delivery | null>;
  save(delivery: Delivery): Promise<void>;
}

export const DELIVERY_REPOSITORY = 'DELIVERY_REPOSITORY';
