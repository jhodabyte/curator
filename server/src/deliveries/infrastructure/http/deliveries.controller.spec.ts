import { HttpException } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { GetDeliveryUseCase } from 'src/deliveries/application/use-cases/get-delivery.use-case';
import { GetDeliveryByTransactionUseCase } from 'src/deliveries/application/use-cases/get-delivery-by-transaction.use-case';
import { Delivery, DeliveryStatus } from 'src/deliveries/domain/delivery.entity';
import { ok, err } from 'src/shared/result';

const mockGetDelivery = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetDeliveryUseCase>;

const mockGetByTx = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetDeliveryByTransactionUseCase>;

const sampleDelivery = new Delivery({
  id: 'd1',
  transactionId: 't1',
  customerId: 'c1',
  productId: 'p1',
  quantity: 1,
  address: 'St',
  city: 'Bogota',
  status: DeliveryStatus.PENDING,
  createdAt: new Date('2025-01-01'),
});

describe('DeliveriesController', () => {
  let controller: DeliveriesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DeliveriesController(mockGetDelivery, mockGetByTx);
  });

  it('findById returns dto', async () => {
    mockGetDelivery.execute.mockResolvedValue(ok(sampleDelivery));

    const result = await controller.findById('d1');

    expect(result.id).toBe('d1');
  });

  it('findById throws when missing', async () => {
    mockGetDelivery.execute.mockResolvedValue(err('Delivery not found'));

    await expect(controller.findById('x')).rejects.toThrow(HttpException);
  });

  it('findByTransaction returns dto', async () => {
    mockGetByTx.execute.mockResolvedValue(ok(sampleDelivery));

    const result = await controller.findByTransaction('t1');

    expect(result.transactionId).toBe('t1');
  });
});
