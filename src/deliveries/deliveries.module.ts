import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrmEntity } from './infrastructure/typeorm/delivery.orm-entity';
import { DELIVERY_REPOSITORY } from './domain/delivery.repository';
import { TypeOrmDeliveryRepository } from './infrastructure/typeorm/typeorm-delivery.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrmEntity])],
  providers: [
    {
      provide: DELIVERY_REPOSITORY,
      useClass: TypeOrmDeliveryRepository,
    },
  ],
  exports: [DELIVERY_REPOSITORY],
})
export class DeliveriesModule {}
