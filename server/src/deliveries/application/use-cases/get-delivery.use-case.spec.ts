import { GetDeliveryUseCase } from './get-delivery.use-case';
import { Delivery, DeliveryStatus } from 'src/deliveries/domain/delivery.entity';
import { type DeliveryRepository } from 'src/deliveries/domain/delivery.repository';

describe('GetDeliveryUseCase', () => {
  let useCase: GetDeliveryUseCase;
  const mockRepository: jest.Mocked<Pick<DeliveryRepository, 'findById'>> = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetDeliveryUseCase(mockRepository as DeliveryRepository);
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
    mockRepository.findById.mockResolvedValue(delivery);

    const result = await useCase.execute('d1');

    expect(result.ok).toBe(true);
  });

  it('returns error when missing', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('x');

    expect(result.ok).toBe(false);
  });
});
