import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTransactionUseCase } from 'src/transactions/application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from 'src/transactions/application/use-cases/get-transaction.use-case';
import { ProcessPaymentUseCase } from 'src/transactions/application/use-cases/process-payment.use-case';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { ProcessPaymentRequestDto } from './dto/process-payment-request.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create pending transaction' })
  async create(
    @Body() body: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const result = await this.createTransactionUseCase.execute(body);

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return TransactionResponseDto.fromDomain(result.value);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by id' })
  async findById(@Param('id') id: string): Promise<TransactionResponseDto> {
    const result = await this.getTransactionUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }

    return TransactionResponseDto.fromDomain(result.value);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Process payment with Wompi' })
  async processPayment(
    @Param('id') id: string,
    @Body() body: ProcessPaymentRequestDto,
  ): Promise<TransactionResponseDto> {
    const result = await this.processPaymentUseCase.execute({
      transactionId: id,
      cardToken: body.cardToken,
      installments: body.installments,
    });

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return TransactionResponseDto.fromDomain(result.value);
  }
}
