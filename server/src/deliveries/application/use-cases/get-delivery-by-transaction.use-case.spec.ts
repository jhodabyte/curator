import { GetDeliveryByTransactionUseCase } from './get-delivery-by-transaction.use-case';
import { Delivery, DeliveryStatus } from 'src/deliveries/domain/delivery.entity';
import { type DeliveryRepository } from 'src/deliveries/domain/delivery.repository';

describe('GetDeliveryByTransactionUseCase', () => {
  let useCase: GetDeliveryByTransactionUseCase;
  const mockRepository: jest.Mocked<
    Pick<DeliveryRepository, 'findByTransactionId'>
  > = {
    findByTransactionId: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetDeliveryByTransactionUseCase(
      mockRepository as DeliveryRepository,
    );
  });

  it('returns delivery when found', async () => {
    const delivery = new Delivery({
      id: 'd1',
      transactionId: 't1',
      customerId: 'c1',
      productId: 'p1',
      quantity: 1,
      address: 'St',
      city: 'Bogota',
      status: DeliveryStatus.PENDING,
      createdAt: new Date(),
    });
    mockRepository.findByTransactionId.mockResolvedValue(delivery);

    const result = await useCase.execute('t1');

    expect(result.ok).toBe(true);
  });

  it('returns error when missing', async () => {
    mockRepository.findByTransactionId.mockResolvedValue(null);

    const result = await useCase.execute('t1');

    expect(result.ok).toBe(false);
  });
});
