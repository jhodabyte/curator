export class CustomerDto {
  name: string;
  email: string;
  phone: string;
}

export class CreateTransactionRequestDto {
  productId: string;
  quantity: number;
  customer: CustomerDto;
}
