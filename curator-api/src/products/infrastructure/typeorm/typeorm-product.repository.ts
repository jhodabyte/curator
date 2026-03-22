import { InjectRepository } from '@nestjs/typeorm';
import { type ProductRepository } from 'src/products/domain/product.repository';
import { ProductOrmEntity } from './product.orm-entity';
import { ProductImageOrmEntity } from './product-image.orm-entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/domain/product.entity';

export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly productRepository: Repository<ProductOrmEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.productRepository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.productRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async save(product: Product): Promise<void> {
    const entity = this.toOrmEntity(product);
    await this.productRepository.save(entity);
  }

  private toDomain(entity: ProductOrmEntity): Product {
    return new Product({
      ...entity,
      price: Number(entity.price),
      images: (entity.images ?? []).map((img) => img.url),
    });
  }

  private toOrmEntity(product: Product): ProductOrmEntity {
    const entity = new ProductOrmEntity();
    entity.id = product.id;
    entity.name = product.name;
    entity.description = product.description;
    entity.price = product.price;
    entity.stock = product.stock;
    entity.images = product.images.map((url) => {
      const img = new ProductImageOrmEntity();
      img.url = url;
      return img;
    });
    return entity;
  }
}
