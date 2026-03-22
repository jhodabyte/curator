import { Product, type ProductProps } from './product.entity';

const createProduct = (overrides: Partial<ProductProps> = {}): Product =>
  new Product({
    id: 'product-1',
    name: 'Test Product',
    description: 'A test product',
    price: 10000,
    stock: 5,
    ...overrides,
  });

describe('Product', () => {
  it('should create a product with given props', () => {
    const product = createProduct();

    expect(product.id).toBe('product-1');
    expect(product.name).toBe('Test Product');
    expect(product.description).toBe('A test product');
    expect(product.price).toBe(10000);
    expect(product.stock).toBe(5);
  });

  it('should return true when hasStock and stock is positive', () => {
    const product = createProduct({ stock: 3 });

    expect(product.hasStock()).toBe(true);
  });

  it('should return true when hasStock and stock is zero', () => {
    const product = createProduct({ stock: 0 });

    expect(product.hasStock()).toBe(true);
  });

  it('should decrement stock by 1', () => {
    const product = createProduct({ stock: 3 });

    product.decrementStock();

    expect(product.stock).toBe(2);
  });

  it('should throw error when decrementing stock at zero', () => {
    const product = createProduct({ stock: 0 });

    expect(() => product.decrementStock()).toThrow('No hay stock disponible');
  });

  it('should allow multiple decrements until zero', () => {
    const product = createProduct({ stock: 2 });

    product.decrementStock();
    product.decrementStock();

    expect(product.stock).toBe(0);
    expect(() => product.decrementStock()).toThrow('No hay stock disponible');
  });

  it('should default images to empty array when not provided', () => {
    const product = createProduct();

    expect(product.images).toEqual([]);
  });

  it('should store provided images', () => {
    const product = createProduct({
      images: ['http://img.com/a.png', 'http://img.com/b.png'],
    });

    expect(product.images).toHaveLength(2);
    expect(product.images[0]).toBe('http://img.com/a.png');
    expect(product.images[1]).toBe('http://img.com/b.png');
  });
});
