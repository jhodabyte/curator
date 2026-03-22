import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrmEntity } from './infrastructure/typeorm/delivery.orm-entity';
import { DELIVERY_REPOSITORY } from './domain/delivery.repository';
import { TypeOrmDeliveryRepository } from './infrastructure/typeorm/typeorm-delivery.repository';
import { DeliveriesController } from './infrastructure/http/deliveries.controller';
import { GetDeliveryUseCase } from './application/use-cases/get-delivery.use-case';
import { GetDeliveryByTransactionUseCase } from './application/use-cases/get-delivery-by-transaction.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrmEntity])],
  controllers: [DeliveriesController],
  providers: [
    {
      provide: DELIVERY_REPOSITORY,
      useClass: TypeOrmDeliveryRepository,
    },
    GetDeliveryUseCase,
    GetDeliveryByTransactionUseCase,
  ],
  exports: [DELIVERY_REPOSITORY],
})
export class DeliveriesModule {}
