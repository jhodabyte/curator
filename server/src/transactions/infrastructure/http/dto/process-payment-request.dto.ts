import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentRequestDto {
  @ApiProperty({ example: 'tok_stagtest_xxx' })
  @IsString()
  @IsNotEmpty()
  cardToken: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 36 })
  @IsInt()
  @Min(1)
  @Max(36)
  installments: number;
}
