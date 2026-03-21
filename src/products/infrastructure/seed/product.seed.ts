import { DataSource } from 'typeorm';
import { ProductOrmEntity } from '../typeorm/product.orm-entity';

export async function seedProducts(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(ProductOrmEntity);
  const count = await repo.count();

  if (count > 0) return;

  const products: Partial<ProductOrmEntity>[] = [
    {
      name: 'Laptop Pro 15',
      description: 'Laptop de alto rendimiento con 16GB RAM y SSD 512GB',
      price: 2500000,
      stock: 10,
    },
    {
      name: 'Audífonos Bluetooth',
      description: 'Cancelación de ruido activa, 30h de batería',
      price: 350000,
      stock: 25,
    },
    {
      name: 'Monitor 4K 27"',
      description: 'Panel IPS, 144Hz, HDR400',
      price: 1200000,
      stock: 5,
    },
    {
      name: 'Teclado Mecánico',
      description: 'Switches Cherry MX Red, retroiluminación RGB',
      price: 280000,
      stock: 15,
    },
  ];

  await repo.save(products);
}
