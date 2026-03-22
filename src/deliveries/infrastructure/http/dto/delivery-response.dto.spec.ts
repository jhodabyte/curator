import { DeliveryResponseDto } from './delivery-response.dto';
import { Delivery, DeliveryStatus } from 'src/deliveries/domain/delivery.entity';

describe('DeliveryResponseDto', () => {
  it('maps domain to dto', () => {
    const delivery = new Delivery({
      id: 'd1',
      transactionId: 't1',
      customerId: 'c1',
      productId: 'p1',
      quantity: 2,
      address: 'Calle 1',
      city: 'Bogota',
      status: DeliveryStatus.PENDING,
      createdAt: new Date('2025-06-01'),
    });

    const dto = DeliveryResponseDto.fromDomain(delivery);

    expect(dto.id).toBe('d1');
    expect(dto.transactionId).toBe('t1');
    expect(dto.quantity).toBe(2);
    expect(dto.status).toBe(DeliveryStatus.PENDING);
  });
});
