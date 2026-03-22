import { ApiProperty } from '@nestjs/swagger';
import { Delivery, DeliveryStatus } from 'src/deliveries/domain/delivery.entity';

export class DeliveryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty({ enum: DeliveryStatus })
  status: DeliveryStatus;

  @ApiProperty()
  createdAt: Date;

  static fromDomain(delivery: Delivery): DeliveryResponseDto {
    const dto = new DeliveryResponseDto();
    dto.id = delivery.id;
    dto.transactionId = delivery.transactionId;
    dto.customerId = delivery.customerId;
    dto.productId = delivery.productId;
    dto.quantity = delivery.quantity;
    dto.address = delivery.address;
    dto.city = delivery.city;
    dto.status = delivery.status;
    dto.createdAt = delivery.createdAt;
    return dto;
  }
}
