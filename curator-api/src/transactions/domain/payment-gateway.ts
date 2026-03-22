export interface PaymentRequest {
  amountInCents: number;
  currency: string;
  customerEmail: string;
  reference: string;
  cardToken: string;
  installments: number;
  acceptanceToken: string;
  signature: string;
}

export interface PaymentResponse {
  id: string;
  status: string;
  reference: string;
}

export interface PaymentGateway {
  getAcceptanceToken(): Promise<string>;

  generateSignature(
    reference: string,
    amountInCents: number,
    currency: string,
  ): string;

  createTransaction(request: PaymentRequest): Promise<PaymentResponse>;

  getTransactionStatus(transactionId: string): Promise<PaymentResponse>;
}

export const PAYMENT_GATEWAY = 'PAYMENT_GATEWAY';
