import { ProductsController } from './products.controller';
import { GetProductsUseCase } from 'src/products/application/use-cases/get-products.use-case';
import { Product } from 'src/products/domain/product.entity';
import { ok, err } from 'src/shared/result';

const mockGetProductsUseCase = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetProductsUseCase>;

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProductsController(mockGetProductsUseCase);
  });

  describe('findAll', () => {
    it('should return product response DTOs', async () => {
      const products = [
        new Product({
          id: '1',
          name: 'Product 1',
          description: 'Desc',
          price: 10000,
          stock: 5,
        }),
      ];
      mockGetProductsUseCase.execute.mockResolvedValue(ok(products));

      const result = await controller.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].name).toBe('Product 1');
      expect(result[0].price).toBe(10000);
      expect(result[0].stock).toBe(5);
    });

    it('should return empty array when result is not ok', async () => {
      mockGetProductsUseCase.execute.mockResolvedValue(
        err('Something went wrong'),
      );

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('should return empty array when no products', async () => {
      mockGetProductsUseCase.execute.mockResolvedValue(ok([]));

      const result = await controller.findAll();

      expect(result).toHaveLength(0);
    });
  });
});
