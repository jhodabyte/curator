import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTransactionUseCase } from 'src/transactions/application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from 'src/transactions/application/use-cases/get-transaction.use-case';
import { UpdateTransactionStatusUseCase } from 'src/transactions/application/use-cases/update-transaction-status.use-case';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { UpdateTransactionStatusRequestDto } from './dto/update-transaction-status-request.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase,
  ) {}

  @Post()
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
  async findById(@Param('id') id: string): Promise<TransactionResponseDto> {
    const result = await this.getTransactionUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }

    return TransactionResponseDto.fromDomain(result.value);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateTransactionStatusRequestDto,
  ): Promise<TransactionResponseDto> {
    const result = await this.updateTransactionStatusUseCase.execute({
      transactionId: id,
      wompiTransactionId: body.wompiTransactionId,
      status: body.status,
    });

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }

    return TransactionResponseDto.fromDomain(result.value);
  }
}
