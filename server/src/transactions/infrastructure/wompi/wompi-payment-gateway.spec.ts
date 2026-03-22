import { createHash } from 'crypto';
import { WompiPaymentGateway } from './wompi-payment-gateway';

const mockConfigService = {
  get: jest.fn((key: string, defaultValue: string) => {
    const config: Record<string, string> = {
      WOMPI_API_URL: 'https://api-sandbox.co.uat.wompi.dev/v1',
      WOMPI_PUBLIC_KEY: 'pub_test_123',
      WOMPI_PRIVATE_KEY: 'prv_test_456',
      WOMPI_INTEGRITY_SECRET: 'integrity_secret',
    };
    return config[key] ?? defaultValue;
  }),
};

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('WompiPaymentGateway', () => {
  let gateway: WompiPaymentGateway;

  beforeEach(() => {
    jest.clearAllMocks();
    gateway = new WompiPaymentGateway(mockConfigService as any);
  });

  describe('getAcceptanceToken', () => {
    it('should fetch and return acceptance token', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            data: {
              presigned_acceptance: {
                acceptance_token: 'eyJ_acceptance_token',
              },
            },
          }),
      });

      const token = await gateway.getAcceptanceToken();

      expect(token).toBe('eyJ_acceptance_token');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api-sandbox.co.uat.wompi.dev/v1/merchants/pub_test_123',
      );
    });
  });

  describe('generateSignature', () => {
    it('should generate SHA256 signature', () => {
      const reference = 'tx-ref-1';
      const amountInCents = 500000;
      const currency = 'COP';

      const result = gateway.generateSignature(
        reference,
        amountInCents,
        currency,
      );

      const expected = createHash('sha256')
        .update(`${reference}${amountInCents}${currency}integrity_secret`)
        .digest('hex');

      expect(result).toBe(expected);
    });
  });

  describe('createTransaction', () => {
    it('should create transaction and return response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              id: 'wompi-tx-1',
              status: 'APPROVED',
              reference: 'tx-ref-1',
            },
          }),
      });

      const result = await gateway.createTransaction({
        amountInCents: 500000,
        currency: 'COP',
        customerEmail: 'john@test.com',
        reference: 'tx-ref-1',
        cardToken: 'tok_test',
        installments: 1,
        acceptanceToken: 'acceptance-token',
        signature: 'sig-hash',
      });

      expect(result).toEqual({
        id: 'wompi-tx-1',
        status: 'APPROVED',
        reference: 'tx-ref-1',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api-sandbox.co.uat.wompi.dev/v1/transactions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer prv_test_456',
          },
        }),
      );
    });

    it('should throw error on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({
            error: {
              type: 'INPUT_VALIDATION_ERROR',
              messages: { amount_in_cents: ['is required'] },
            },
          }),
      });

      await expect(
        gateway.createTransaction({
          amountInCents: 0,
          currency: 'COP',
          customerEmail: 'john@test.com',
          reference: 'tx-ref-1',
          cardToken: 'tok_test',
          installments: 1,
          acceptanceToken: 'acceptance-token',
          signature: 'sig-hash',
        }),
      ).rejects.toThrow('Wompi error: INPUT_VALIDATION_ERROR');
    });
  });

  describe('getTransactionStatus', () => {
    it('should fetch and return transaction status', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            data: {
              id: 'wompi-tx-1',
              status: 'APPROVED',
              reference: 'tx-ref-1',
            },
          }),
      });

      const result = await gateway.getTransactionStatus('wompi-tx-1');

      expect(result).toEqual({
        id: 'wompi-tx-1',
        status: 'APPROVED',
        reference: 'tx-ref-1',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api-sandbox.co.uat.wompi.dev/v1/transactions/wompi-tx-1',
        expect.objectContaining({
          headers: { Authorization: 'Bearer prv_test_456' },
        }),
      );
    });
  });
});
