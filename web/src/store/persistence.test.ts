import { loadPersistedState, clearPersistedState, persistMiddleware } from "./persistence";

const STORAGE_KEY = "curator_checkout_state";

describe("persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  describe("loadPersistedState", () => {
    it("returns undefined when nothing is stored", () => {
      expect(loadPersistedState()).toBeUndefined();
    });

    it("returns persisted checkout and transaction state", () => {
      const persisted = {
        checkout: {
          billingInfo: {
            fullName: "John",
            street: "Calle 1",
            city: "Bogotá",
            postalCode: "110111",
          },
          cardInfo: {
            cardholderName: "John",
            brand: "VISA",
            last4: "4242",
            expMonth: "12",
            expYear: "2028",
          },
        },
        transaction: {
          currentStep: 3,
          transactionId: "tx-1",
          status: "idle",
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

      const result = loadPersistedState();
      expect(result?.checkout).toEqual(persisted.checkout);
      expect(result?.transaction?.currentStep).toBe(3);
      expect(result?.transaction?.transactionId).toBe("tx-1");
      // Should never restore sensitive data
      expect(result?.transaction?.cardNumber).toBe("");
      expect(result?.transaction?.cvv).toBe("");
    });

    it("returns undefined on invalid JSON", () => {
      localStorage.setItem(STORAGE_KEY, "not-json");
      expect(loadPersistedState()).toBeUndefined();
    });
  });

  describe("clearPersistedState", () => {
    it("removes persisted state", () => {
      localStorage.setItem(STORAGE_KEY, "data");
      clearPersistedState();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe("persistMiddleware", () => {
    it("persists checkout and transaction state on every action", () => {
      const mockState = {
        checkout: {
          billingInfo: { fullName: "Jane", street: "Av 1", city: "Cali", postalCode: "760001" },
          cardInfo: { cardholderName: "Jane", brand: "VISA", last4: "1234", expMonth: "06", expYear: "2027" },
        },
        transaction: {
          currentStep: 2,
          transactionId: "tx-abc",
          status: "idle",
        },
        product: {
          products: [],
          selectedProduct: {
            id: "p1",
            name: "Item",
            description: "Desc",
            price: 1000,
            stock: 5,
            images: [],
          },
          quantity: 2,
          selectedGalleryId: "1",
          loading: false,
          error: null,
        },
      };

      const store = { getState: () => mockState };
      const next = jest.fn((action) => action);
      const action = { type: "test/action" };

      const middleware = persistMiddleware(store as never)(next);
      middleware(action);

      expect(next).toHaveBeenCalledWith(action);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored.checkout.billingInfo.fullName).toBe("Jane");
      expect(stored.transaction.transactionId).toBe("tx-abc");
      expect(stored.transaction.currentStep).toBe(2);
      expect(stored.product.quantity).toBe(2);
      expect(stored.product.selectedProduct?.id).toBe("p1");
    });
  });

  it("loadPersistedState restores product selection", () => {
    const persisted = {
      checkout: {
        billingInfo: {
          fullName: "John",
          street: "Calle 1",
          city: "Bogotá",
          postalCode: "110111",
        },
        cardInfo: {
          cardholderName: "John",
          brand: "VISA",
          last4: "4242",
          expMonth: "12",
          expYear: "2028",
        },
      },
      transaction: {
        currentStep: 2,
        transactionId: null,
        status: "idle",
      },
      product: {
        selectedProduct: {
          id: "p99",
          name: "Watch",
          description: "Smart",
          price: 50000,
          stock: 3,
          images: ["/w.png"],
        },
        quantity: 2,
        selectedGalleryId: "0",
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    const result = loadPersistedState();
    expect(result?.product?.quantity).toBe(2);
    expect(result?.product?.selectedProduct?.id).toBe("p99");
  });
});
