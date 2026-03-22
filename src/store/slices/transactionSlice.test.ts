import reducer, {
  setCurrentStep,
  setTransaction,
  setPaymentStatus,
  setCardSecrets,
  resetTransaction,
  clearError,
  submitPayment,
  fetchTransaction,
  type TransactionState,
} from "./transactionSlice";
import type { TransactionResponse } from "../../types/api";
import { createTestStore } from "../../test/test-utils";

const mockTransaction: TransactionResponse = {
  id: "tx-123",
  customerId: "cust-1",
  productId: "prod-1",
  quantity: 1,
  productAmount: 2500000,
  baseFee: 5000,
  deliveryFee: 10000,
  totalAmount: 2515000,
  status: "pending",
  wompiTransactionId: "wompi-123",
  createdAt: "2026-01-01T00:00:00Z",
};

describe("transactionSlice", () => {
  it("should return the initial state", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state.currentStep).toBe(1);
    expect(state.transactionId).toBeNull();
    expect(state.transaction).toBeNull();
    expect(state.status).toBe("idle");
    expect(state.error).toBeNull();
    expect(state.cardNumber).toBe("");
    expect(state.cvv).toBe("");
  });

  it("should set current step", () => {
    const state = reducer(undefined, setCurrentStep(3));
    expect(state.currentStep).toBe(3);
  });

  it("should set transaction", () => {
    const state = reducer(undefined, setTransaction(mockTransaction));
    expect(state.transaction).toEqual(mockTransaction);
    expect(state.transactionId).toBe("tx-123");
  });

  it("should set payment status", () => {
    const state = reducer(undefined, setPaymentStatus("processing"));
    expect(state.status).toBe("processing");
  });

  it("should set card secrets", () => {
    const state = reducer(
      undefined,
      setCardSecrets({ cardNumber: "4242424242424242", cvv: "123" }),
    );
    expect(state.cardNumber).toBe("4242424242424242");
    expect(state.cvv).toBe("123");
  });

  it("should reset transaction", () => {
    let state = reducer(undefined, setTransaction(mockTransaction));
    state = reducer(state, setPaymentStatus("done"));
    state = reducer(state, setCurrentStep(4));
    state = reducer(state, resetTransaction());

    expect(state.transactionId).toBeNull();
    expect(state.transaction).toBeNull();
    expect(state.status).toBe("idle");
    expect(state.currentStep).toBe(1);
    expect(state.cardNumber).toBe("");
    expect(state.cvv).toBe("");
  });

  it("should clear error", () => {
    const state: TransactionState = {
      ...reducer(undefined, { type: "unknown" }),
      error: "some error",
    };
    const newState = reducer(state, clearError());
    expect(newState.error).toBeNull();
  });

  describe("submitPayment thunk", () => {
    it("clears card secrets and sets step 4 on success", () => {
      const fulfilled = { ...mockTransaction, status: "completed" as const };

      let state = reducer(
        undefined,
        setCardSecrets({ cardNumber: "4242424242424242", cvv: "123" }),
      );
      state = reducer(state, submitPayment.fulfilled(fulfilled, ""));
      expect(state.transaction).toEqual(fulfilled);
      expect(state.status).toBe("done");
      expect(state.currentStep).toBe(4);
      expect(state.cardNumber).toBe("");
      expect(state.cvv).toBe("");
    });

    it("sets error and clears secrets on rejection", () => {
      let state = reducer(
        undefined,
        setCardSecrets({ cardNumber: "4242424242424242", cvv: "123" }),
      );
      state = reducer(
        state,
        submitPayment.rejected(null, "", undefined, "Payment failed"),
      );
      expect(state.status).toBe("error");
      expect(state.error).toBe("Payment failed");
      expect(state.cardNumber).toBe("");
    });
  });

  describe("fetchTransaction thunk", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it("sets transaction on fulfilled", () => {
      const state = reducer(
        undefined,
        fetchTransaction.fulfilled(mockTransaction, "", "tx-123"),
      );
      expect(state.transaction).toEqual(mockTransaction);
      expect(state.transactionId).toBe("tx-123");
    });

    it("sets error on rejected", () => {
      const state = reducer(
        undefined,
        fetchTransaction.rejected(null, "", "tx-123", "Not found"),
      );
      expect(state.error).toBe("Not found");
    });

    it("dispatches fetch and populates store", async () => {
      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTransaction),
      } as Response);

      const store = createTestStore();
      await store.dispatch(fetchTransaction("tx-123"));

      const state = store.getState().transaction;
      expect(state.transaction).toEqual(mockTransaction);
    });
  });
});
