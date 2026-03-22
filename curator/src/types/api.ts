export type TransactionStatus = "pending" | "completed" | "failed";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  images: string[];
};

export type CreateTransactionRequest = {
  productId: string;
  quantity: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  delivery: {
    address: string;
    city: string;
  };
};

export type TransactionResponse = {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
  status: TransactionStatus;
  wompiTransactionId: string;
  createdAt: string;
};

export type ProcessPaymentRequest = {
  cardToken: string;
  installments: number;
};

export type WompiTokenizeCardRequest = {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
};

export type WompiTokenResponse = {
  status: string;
  data: {
    id: string;
    created_at: string;
    brand: string;
    name: string;
    last_four: string;
    bin: string;
    exp_year: string;
    exp_month: string;
    card_holder: string;
    expires_at: string;
  };
};

export type WompiAcceptanceResponse = {
  data: {
    presigned_acceptance: {
      acceptance_token: string;
      permalink: string;
      type: string;
    };
  };
};
