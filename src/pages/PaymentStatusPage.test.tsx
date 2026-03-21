import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentStatusPage from "./PaymentStatusPage";
import { renderWithProviders } from "../test/test-utils";
import type { TransactionResponse } from "../types/api";

const completedTransaction: TransactionResponse = {
  id: "tx-123",
  customerId: "cust-1",
  productId: "prod-1",
  quantity: 1,
  productAmount: 2500000,
  baseFee: 5000,
  deliveryFee: 10000,
  totalAmount: 2515000,
  status: "completed",
  wompiTransactionId: "wompi-123",
  createdAt: "2026-01-01T00:00:00Z",
};

const failedTransaction: TransactionResponse = {
  ...completedTransaction,
  status: "failed",
};

describe("PaymentStatusPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading state when no transaction", () => {
    renderWithProviders(<PaymentStatusPage />, {
      route: "/status/tx-123",
      preloadedState: {
        transaction: {
          currentStep: 4,
          transactionId: "tx-123",
          transaction: null,
          status: "idle",
          error: null,
          cardNumber: "",
          cvv: "",
        },
      },
    });
    expect(
      screen.getByText("Verificando estado del pago..."),
    ).toBeInTheDocument();
  });

  it("shows approved status for completed transaction", () => {
    renderWithProviders(<PaymentStatusPage />, {
      route: "/status/tx-123",
      preloadedState: {
        transaction: {
          currentStep: 4,
          transactionId: "tx-123",
          transaction: completedTransaction,
          status: "done",
          error: null,
          cardNumber: "",
          cvv: "",
        },
      },
    });

    expect(screen.getByText("Pago aprobado")).toBeInTheDocument();
    expect(screen.getByText("APROBADO")).toBeInTheDocument();
    expect(screen.getByText("tx-123")).toBeInTheDocument();
  });

  it("shows rejected status for failed transaction", () => {
    renderWithProviders(<PaymentStatusPage />, {
      route: "/status/tx-456",
      preloadedState: {
        transaction: {
          currentStep: 4,
          transactionId: "tx-456",
          transaction: failedTransaction,
          status: "done",
          error: null,
          cardNumber: "",
          cvv: "",
        },
      },
    });

    expect(screen.getByText("Pago rechazado")).toBeInTheDocument();
    expect(screen.getByText("RECHAZADO")).toBeInTheDocument();
  });

  it("displays transaction amounts correctly", () => {
    renderWithProviders(<PaymentStatusPage />, {
      route: "/status/tx-123",
      preloadedState: {
        transaction: {
          currentStep: 4,
          transactionId: "tx-123",
          transaction: completedTransaction,
          status: "done",
          error: null,
          cardNumber: "",
          cvv: "",
        },
      },
    });

    expect(screen.getByText("$2.500.000")).toBeInTheDocument();
    expect(screen.getByText("$5.000")).toBeInTheDocument();
    expect(screen.getByText("$10.000")).toBeInTheDocument();
    expect(screen.getByText("$2.515.000")).toBeInTheDocument();
  });

  it("shows return to store button", () => {
    renderWithProviders(<PaymentStatusPage />, {
      route: "/status/tx-123",
      preloadedState: {
        transaction: {
          currentStep: 4,
          transactionId: "tx-123",
          transaction: completedTransaction,
          status: "done",
          error: null,
          cardNumber: "",
          cvv: "",
        },
      },
    });

    expect(screen.getByText("Volver a la tienda")).toBeInTheDocument();
  });

  it("resets transaction state when clicking back to store", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<PaymentStatusPage />, {
      route: "/status/tx-123",
      preloadedState: {
        transaction: {
          currentStep: 4,
          transactionId: "tx-123",
          transaction: completedTransaction,
          status: "done",
          error: null,
          cardNumber: "",
          cvv: "",
        },
      },
    });

    await user.click(screen.getByText("Volver a la tienda"));
    expect(store.getState().transaction.transactionId).toBeNull();
    expect(store.getState().transaction.currentStep).toBe(1);
  });

  it("shows error message when present", () => {
    renderWithProviders(<PaymentStatusPage />, {
      route: "/status/tx-123",
      preloadedState: {
        transaction: {
          currentStep: 4,
          transactionId: "tx-123",
          transaction: failedTransaction,
          status: "error",
          error: "Something went wrong",
          cardNumber: "",
          cvv: "",
        },
      },
    });

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows step indicator at 80%", () => {
    renderWithProviders(<PaymentStatusPage />, {
      route: "/status/tx-123",
      preloadedState: {
        transaction: {
          currentStep: 4,
          transactionId: "tx-123",
          transaction: completedTransaction,
          status: "done",
          error: null,
          cardNumber: "",
          cvv: "",
        },
      },
    });

    expect(screen.getByText("PASO 4 DE 5")).toBeInTheDocument();
  });
});
