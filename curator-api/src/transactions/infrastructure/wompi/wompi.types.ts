export interface WompiMerchantResponse {
  data: {
    id: number;
    name: string;
    legal_name: string;
    presigned_acceptance: {
      acceptance_token: string;
      permalink: string;
      type: string;
    };
  };
}

export interface WompiTransactionRequest {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  reference: string;
  acceptance_token: string;
  signature: string;
  payment_method: {
    type: string;
    token: string;
    installments: number;
  };
}

export interface WompiTransactionResponse {
  data: {
    id: string;
    reference: string;
    created_at: string;
    amount_in_cents: number;
    currency: string;
    customer_email: string;
    payment_method_type: string;
    status: WompiTransactionStatus;
    status_message: string;
    merchant: {
      id: string;
      name: string;
      legal_name: string;
    };
    payment_method: {
      type: string;
      brand: string;
      last_four: string;
    };
  };
}

export interface WompiErrorResponse {
  error: {
    type: string;
    messages: Record<string, string[]>;
  };
}

export type WompiTransactionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'VOIDED'
  | 'ERROR';
