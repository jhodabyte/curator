import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductOrmEntity } from './product.orm-entity';

@Entity('product_images')
export class ProductImageOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ManyToOne(() => ProductOrmEntity, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: ProductOrmEntity;
}
