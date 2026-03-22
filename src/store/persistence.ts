import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "./rootReducer";

const STORAGE_KEY = "curator_checkout_state";

type PersistedState = {
  checkout: RootState["checkout"];
  transaction: {
    currentStep: number;
    transactionId: string | null;
    status: string;
  };
  product?: {
    selectedProduct: RootState["product"]["selectedProduct"];
    quantity: number;
    selectedGalleryId: string;
  };
};

export function loadPersistedState(): Partial<RootState> | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;

    const persisted = JSON.parse(raw) as PersistedState;

    const base: Partial<RootState> = {
      checkout: persisted.checkout,
      transaction: {
        currentStep: persisted.transaction.currentStep,
        transactionId: persisted.transaction.transactionId,
        transaction: null,
        status: "idle",
        error: null,
        cardNumber: "",
        cvv: "",
      },
    };

    if (persisted.product) {
      base.product = {
        products: [],
        selectedProduct: persisted.product.selectedProduct,
        quantity: persisted.product.quantity,
        selectedGalleryId: persisted.product.selectedGalleryId,
        loading: false,
        error: null,
      };
    }

    return base;
  } catch {
    return undefined;
  }
}

export const persistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState() as RootState;

  try {
    const toPersist: PersistedState = {
      checkout: state.checkout,
      transaction: {
        currentStep: state.transaction.currentStep,
        transactionId: state.transaction.transactionId,
        status: state.transaction.status,
      },
      product: {
        selectedProduct: state.product.selectedProduct,
        quantity: state.product.quantity,
        selectedGalleryId: state.product.selectedGalleryId,
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  } catch {
    // localStorage not available
  }

  return result;
};

export function clearPersistedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}
