import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '3001234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class DeliveryDto {
  @ApiProperty({ example: 'Cra 50 #30-20' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Medellín' })
  @IsString()
  @IsNotEmpty()
  city: string;
}

export class CreateTransactionRequestDto {
  @ApiProperty({ example: 'uuid-product-id' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: DeliveryDto })
  @ValidateNested()
  @Type(() => DeliveryDto)
  delivery: DeliveryDto;
}
