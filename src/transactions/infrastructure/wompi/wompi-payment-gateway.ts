import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import {
  type PaymentGateway,
  type PaymentRequest,
  type PaymentResponse,
} from 'src/transactions/domain/payment-gateway';
import {
  type WompiErrorResponse,
  type WompiMerchantResponse,
  type WompiTransactionResponse,
} from './wompi.types';

@Injectable()
export class WompiPaymentGateway implements PaymentGateway {
  private readonly baseUrl: string;
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly integritySecret: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(
      'WOMPI_API_URL',
      'https://api-sandbox.co.uat.wompi.dev/v1',
    );
    this.publicKey = this.configService.get<string>('WOMPI_PUBLIC_KEY', '');
    this.privateKey = this.configService.get<string>('WOMPI_PRIVATE_KEY', '');
    this.integritySecret = this.configService.get<string>(
      'WOMPI_INTEGRITY_SECRET',
      '',
    );
  }

  async getAcceptanceToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/merchants/${this.publicKey}`);
    const body = (await response.json()) as WompiMerchantResponse;
    return body.data.presigned_acceptance.acceptance_token;
  }

  generateSignature(
    reference: string,
    amountInCents: number,
    currency: string,
  ): string {
    const raw = `${reference}${amountInCents}${currency}${this.integritySecret}`;
    return createHash('sha256').update(raw).digest('hex');
  }

  async createTransaction(request: PaymentRequest): Promise<PaymentResponse> {
    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.privateKey}`,
      },
      body: JSON.stringify({
        amount_in_cents: request.amountInCents,
        currency: request.currency,
        customer_email: request.customerEmail,
        reference: request.reference,
        acceptance_token: request.acceptanceToken,
        signature: request.signature,
        payment_method: {
          type: 'CARD',
          token: request.cardToken,
          installments: request.installments,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = (await response.json()) as WompiErrorResponse;
      throw new Error(
        `Wompi error: ${errorBody.error?.type ?? 'Unknown error'} - ${JSON.stringify(errorBody.error?.messages ?? errorBody)}`,
      );
    }

    const body = (await response.json()) as WompiTransactionResponse;

    return {
      id: body.data.id,
      status: body.data.status,
      reference: body.data.reference,
    };
  }

  async getTransactionStatus(transactionId: string): Promise<PaymentResponse> {
    const response = await fetch(
      `${this.baseUrl}/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
        },
      },
    );

    const body = (await response.json()) as WompiTransactionResponse;

    return {
      id: body.data.id,
      status: body.data.status,
      reference: body.data.reference,
    };
  }
}
