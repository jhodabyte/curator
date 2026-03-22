import { ApiProperty } from '@nestjs/swagger';
import { Customer } from 'src/customers/domain/customer.entity';

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  static fromDomain(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = customer.id;
    dto.name = customer.name;
    dto.email = customer.email;
    dto.phone = customer.phone;
    return dto;
  }
}
