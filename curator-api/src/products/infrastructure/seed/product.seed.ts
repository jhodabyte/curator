import { DataSource } from 'typeorm';
import { ProductOrmEntity } from '../typeorm/product.orm-entity';
import { ProductImageOrmEntity } from '../typeorm/product-image.orm-entity';

export async function seedProducts(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(ProductOrmEntity);
  const count = await repo.count();

  if (count > 0) return;

  const createImage = (url: string): ProductImageOrmEntity => {
    const img = new ProductImageOrmEntity();
    img.url = url;
    return img;
  };

  const products: Partial<ProductOrmEntity>[] = [
    {
      name: 'Reloj Inteligente',
      description:
        'Reloj inteligente con pantalla táctil y reconocimiento facial',
      price: 1200000,
      stock: 5,
      images: [
        createImage('https://prueba.shortilink.com/imagen-1.png'),
        createImage('https://prueba.shortilink.com/imagen-2.png'),
        createImage('https://prueba.shortilink.com/imagen-3.png'),
      ],
    },
    {
      name: 'Laptop Pro 15',
      description: 'Laptop de alto rendimiento con 16GB RAM y SSD 512GB',
      price: 2500000,
      stock: 10,
      images: [
        createImage(
          'https://prueba.shortilink.com/Gemini_Generated_Image_wyhzy9wyhzy9wyhz-Photoroom.png',
        ),
        createImage(
          'https://prueba.shortilink.com/Gemini_Generated_Image_361sz0361sz0361s-Photoroom.png',
        ),
      ],
    },
    {
      name: 'Audífonos Bluetooth',
      description: 'Cancelación de ruido activa, 30h de batería',
      price: 350000,
      stock: 25,
      images: [
        createImage(
          'https://prueba.shortilink.com/Diseno-sin-titulo-4-Photoroom.png',
        ),
        createImage(
          'https://prueba.shortilink.com/Gemini_Generated_Image_2rlysp2rlysp2rly-Photoroom.png',
        ),
      ],
    },
  ];

  await repo.save(products);
}
