import { GetProductsUseCase } from './get-products.use-case';
import { Product } from 'src/products/domain/product.entity';

const mockProductRepository = {
  findAll: jest.fn<Promise<Product[]>, []>(),
  findById: jest.fn<Promise<Product | null>, [string]>(),
  save: jest.fn<Promise<void>, [Product]>(),
};

describe('GetProductsUseCase', () => {
  let useCase: GetProductsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetProductsUseCase(mockProductRepository);
  });

  it('should return all products', async () => {
    const products = [
      new Product({
        id: '1',
        name: 'Product 1',
        description: 'Desc 1',
        price: 10000,
        stock: 5,
      }),
      new Product({
        id: '2',
        name: 'Product 2',
        description: 'Desc 2',
        price: 20000,
        stock: 10,
      }),
    ];
    mockProductRepository.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0].name).toBe('Product 1');
    }
    expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no products exist', async () => {
    mockProductRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toHaveLength(0);
    }
  });
});
