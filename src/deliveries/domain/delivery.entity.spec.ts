import {
  Delivery,
  DeliveryStatus,
  type DeliveryProps,
} from './delivery.entity';

const createDelivery = (overrides: Partial<DeliveryProps> = {}): Delivery =>
  new Delivery({
    id: 'delivery-1',
    transactionId: 'tx-1',
    customerId: 'customer-1',
    productId: 'product-1',
    quantity: 1,
    address: 'Calle 123',
    city: 'Bogota',
    status: DeliveryStatus.PENDING,
    createdAt: new Date('2025-01-01'),
    ...overrides,
  });

describe('Delivery', () => {
  it('should create a delivery with given props', () => {
    const delivery = createDelivery();

    expect(delivery.id).toBe('delivery-1');
    expect(delivery.transactionId).toBe('tx-1');
    expect(delivery.customerId).toBe('customer-1');
    expect(delivery.productId).toBe('product-1');
    expect(delivery.quantity).toBe(1);
    expect(delivery.address).toBe('Calle 123');
    expect(delivery.city).toBe('Bogota');
    expect(delivery.status).toBe(DeliveryStatus.PENDING);
  });

  describe('ship', () => {
    it('should change status from PENDING to SHIPPED', () => {
      const delivery = createDelivery();

      delivery.ship();

      expect(delivery.status).toBe(DeliveryStatus.SHIPPED);
    });

    it('should throw when shipping a non-PENDING delivery', () => {
      const delivery = createDelivery({ status: DeliveryStatus.SHIPPED });

      expect(() => delivery.ship()).toThrow('Delivery is not pending');
    });

    it('should throw when shipping a DELIVERED delivery', () => {
      const delivery = createDelivery({ status: DeliveryStatus.DELIVERED });

      expect(() => delivery.ship()).toThrow('Delivery is not pending');
    });
  });

  describe('deliver', () => {
    it('should change status from SHIPPED to DELIVERED', () => {
      const delivery = createDelivery({ status: DeliveryStatus.SHIPPED });

      delivery.deliver();

      expect(delivery.status).toBe(DeliveryStatus.DELIVERED);
    });

    it('should throw when delivering a PENDING delivery', () => {
      const delivery = createDelivery();

      expect(() => delivery.deliver()).toThrow('Delivery is not shipped');
    });

    it('should throw when delivering an already DELIVERED delivery', () => {
      const delivery = createDelivery({ status: DeliveryStatus.DELIVERED });

      expect(() => delivery.deliver()).toThrow('Delivery is not shipped');
    });
  });

  it('should follow full lifecycle: PENDING -> SHIPPED -> DELIVERED', () => {
    const delivery = createDelivery();

    expect(delivery.status).toBe(DeliveryStatus.PENDING);

    delivery.ship();
    expect(delivery.status).toBe(DeliveryStatus.SHIPPED);

    delivery.deliver();
    expect(delivery.status).toBe(DeliveryStatus.DELIVERED);
  });
});
