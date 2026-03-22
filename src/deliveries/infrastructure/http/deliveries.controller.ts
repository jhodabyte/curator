import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDeliveryUseCase } from 'src/deliveries/application/use-cases/get-delivery.use-case';
import { GetDeliveryByTransactionUseCase } from 'src/deliveries/application/use-cases/get-delivery-by-transaction.use-case';
import { DeliveryResponseDto } from './dto/delivery-response.dto';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(
    private readonly getDeliveryUseCase: GetDeliveryUseCase,
    private readonly getDeliveryByTransactionUseCase: GetDeliveryByTransactionUseCase,
  ) {}

  @Get('by-transaction/:transactionId')
  @ApiOperation({ summary: 'Get delivery by transaction id' })
  async findByTransaction(
    @Param('transactionId') transactionId: string,
  ): Promise<DeliveryResponseDto> {
    const result =
      await this.getDeliveryByTransactionUseCase.execute(transactionId);

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }

    return DeliveryResponseDto.fromDomain(result.value);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get delivery by id' })
  async findById(@Param('id') id: string): Promise<DeliveryResponseDto> {
    const result = await this.getDeliveryUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }

    return DeliveryResponseDto.fromDomain(result.value);
  }
}
