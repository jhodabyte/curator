import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCustomerUseCase } from 'src/customers/application/use-cases/get-customer.use-case';
import { CustomerResponseDto } from './dto/customer-response.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly getCustomerUseCase: GetCustomerUseCase) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by id' })
  async findById(@Param('id') id: string): Promise<CustomerResponseDto> {
    const result = await this.getCustomerUseCase.execute(id);

    if (!result.ok) {
      throw new HttpException(result.error, HttpStatus.NOT_FOUND);
    }

    return CustomerResponseDto.fromDomain(result.value);
  }
}
