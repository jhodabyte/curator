import type {
  Product,
  CreateTransactionRequest,
  TransactionResponse,
  ProcessPaymentRequest,
  WompiTokenizeCardRequest,
  WompiTokenResponse,
  WompiAcceptanceResponse,
} from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const WOMPI_API_URL =
  import.meta.env.VITE_WOMPI_API_URL ||
  "https://api-sandbox.co.uat.wompi.dev/v1";

const WOMPI_PUBLIC_KEY =
  import.meta.env.VITE_WOMPI_PUBLIC_KEY ||
  "pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { message?: string }).message ||
        `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
  return request<Product[]>(`${API_BASE_URL}/products`);
}

export async function createTransaction(
  data: CreateTransactionRequest,
): Promise<TransactionResponse> {
  return request<TransactionResponse>(`${API_BASE_URL}/transactions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getTransaction(
  id: string,
): Promise<TransactionResponse> {
  return request<TransactionResponse>(`${API_BASE_URL}/transactions/${id}`);
}

export async function processPayment(
  transactionId: string,
  data: ProcessPaymentRequest,
): Promise<TransactionResponse> {
  return request<TransactionResponse>(
    `${API_BASE_URL}/transactions/${transactionId}/pay`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function tokenizeCard(
  card: WompiTokenizeCardRequest,
): Promise<WompiTokenResponse> {
  return request<WompiTokenResponse>(`${WOMPI_API_URL}/tokens/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`,
    },
    body: JSON.stringify(card),
  });
}

export async function getAcceptanceToken(): Promise<string> {
  const data = await request<WompiAcceptanceResponse>(
    `${WOMPI_API_URL}/merchants/${WOMPI_PUBLIC_KEY}`,
  );
  return data.data.presigned_acceptance.acceptance_token;
}
