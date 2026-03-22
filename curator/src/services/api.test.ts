import {
  getProducts,
  createTransaction,
  getTransaction,
  processPayment,
  tokenizeCard,
  getAcceptanceToken,
} from "./api";

describe("api service", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("getProducts", () => {
    it("fetches products from the API", async () => {
      const mockProducts = [
        { id: "1", name: "Laptop", description: "Nice", price: 100, stock: 5 },
      ];
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      } as Response);

      const result = await getProducts();
      expect(result).toEqual(mockProducts);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/products"),
        expect.any(Object),
      );
    });

    it("throws on error response", async () => {
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: "Server error" }),
      } as Response);

      await expect(getProducts()).rejects.toThrow("Server error");
    });
  });

  describe("createTransaction", () => {
    it("posts transaction data", async () => {
      const mockResponse = {
        id: "tx-1",
        status: "pending",
        totalAmount: 100,
      };
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await createTransaction({
        productId: "1",
        quantity: 1,
        customer: { name: "John", email: "john@test.com", phone: "123" },
        delivery: { address: "Calle 1", city: "Bogotá" },
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/transactions"),
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  describe("getTransaction", () => {
    it("fetches a transaction by id", async () => {
      const mockResponse = { id: "tx-1", status: "completed" };
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await getTransaction("tx-1");
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-1"),
        expect.any(Object),
      );
    });
  });

  describe("processPayment", () => {
    it("posts payment data to correct endpoint", async () => {
      const mockResponse = { id: "tx-1", status: "completed" };
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await processPayment("tx-1", {
        cardToken: "tok-123",
        installments: 1,
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/transactions/tx-1/pay"),
        expect.objectContaining({ method: "POST" }),
      );
    });
  });

  describe("tokenizeCard", () => {
    it("posts card data to Wompi", async () => {
      const mockResponse = {
        status: "CREATED",
        data: { id: "tok-123", brand: "VISA", last_four: "4242" },
      };
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await tokenizeCard({
        number: "4242424242424242",
        cvc: "123",
        exp_month: "12",
        exp_year: "2028",
        card_holder: "John Doe",
      });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/tokens/cards"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer"),
          }),
        }),
      );
    });
  });

  describe("getAcceptanceToken", () => {
    it("returns the acceptance token", async () => {
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              presigned_acceptance: {
                acceptance_token: "token-abc",
                permalink: "https://example.com",
                type: "END_USER_POLICY",
              },
            },
          }),
      } as Response);

      const token = await getAcceptanceToken();
      expect(token).toBe("token-abc");
    });
  });

  describe("error handling", () => {
    it("falls back to status code message when no message in body", async () => {
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      } as Response);

      await expect(getProducts()).rejects.toThrow(
        "Request failed with status 404",
      );
    });

    it("handles json parse failure in error response", async () => {
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("bad json")),
      } as Response);

      await expect(getProducts()).rejects.toThrow(
        "Request failed with status 500",
      );
    });
  });
});
