import { Inject, Injectable } from '@nestjs/common';
import { Delivery } from 'src/deliveries/domain/delivery.entity';
import {
  DELIVERY_REPOSITORY,
  type DeliveryRepository,
} from 'src/deliveries/domain/delivery.repository';
import { err, ok, Result } from 'src/shared/result';

@Injectable()
export class GetDeliveryUseCase {
  constructor(
    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepository: DeliveryRepository,
  ) {}

  async execute(id: string): Promise<Result<Delivery>> {
    const delivery = await this.deliveryRepository.findById(id);
    if (!delivery) return err('Delivery not found');
    return ok(delivery);
  }
}
