import { screen } from "@testing-library/react";
import CheckoutPage from "./CheckoutPage";
import { renderWithProviders } from "../test/test-utils";

const defaultState = {
  checkout: {
    billingInfo: {
      fullName: "John Doe",
      street: "Calle 123",
      city: "Bogotá",
      postalCode: "110111",
    },
    cardInfo: {
      cardholderName: "John Doe",
      brand: "VISA",
      last4: "4242",
      expMonth: "12",
      expYear: "2028",
    },
  },
  product: {
    products: [],
    selectedProduct: {
      id: "prod-1",
      name: "Laptop Pro",
      description: "Laptop",
      price: 2500000,
      stock: 10,
      images: [],
    },
    selectedGalleryId: "0",
    quantity: 1,
    loading: false,
    error: null,
  },
  transaction: {
    currentStep: 3,
    transactionId: null,
    transaction: null,
    status: "idle" as const,
    error: null,
    cardNumber: "4242424242424242",
    cvv: "123",
  },
};

describe("CheckoutPage", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("renders step indicator", () => {
    renderWithProviders(<CheckoutPage />, { preloadedState: defaultState });
    expect(screen.getByText("PASO 3 DE 5")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Revisa tu pedido" })).toBeInTheDocument();
  });

  it("displays product amount, base fee, delivery fee, and total", () => {
    renderWithProviders(<CheckoutPage />, { preloadedState: defaultState });

    expect(screen.getByText("$2.500.000")).toBeInTheDocument();
    expect(screen.getByText("$5.000")).toBeInTheDocument();
    expect(screen.getByText("$10.000")).toBeInTheDocument();
    expect(screen.getByText("$2.515.000")).toBeInTheDocument();
  });

  it("displays shipping address from billing info", () => {
    renderWithProviders(<CheckoutPage />, { preloadedState: defaultState });
    expect(screen.getByText("Calle 123, Bogotá")).toBeInTheDocument();
  });

  it("displays card brand and last 4 digits", () => {
    renderWithProviders(<CheckoutPage />, { preloadedState: defaultState });
    expect(screen.getByLabelText("Visa")).toBeInTheDocument();
    expect(screen.getByText("•••• •••• •••• 4242")).toBeInTheDocument();
  });

  it("shows confirm payment button", () => {
    renderWithProviders(<CheckoutPage />, { preloadedState: defaultState });
    expect(screen.getByText("Confirmar pago")).toBeInTheDocument();
  });

  it("shows loading state when processing", () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: {
        ...defaultState,
        transaction: {
          ...defaultState.transaction,
          status: "processing" as const,
        },
      },
    });
    expect(screen.getByText("Procesando pago...")).toBeInTheDocument();
  });

  it("shows creating state label", () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: {
        ...defaultState,
        transaction: {
          ...defaultState.transaction,
          status: "creating" as const,
        },
      },
    });
    expect(screen.getByText("Creando transacción...")).toBeInTheDocument();
  });

  it("shows tokenizing state label", () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: {
        ...defaultState,
        transaction: {
          ...defaultState.transaction,
          status: "tokenizing" as const,
        },
      },
    });
    expect(screen.getByText("Validando tarjeta...")).toBeInTheDocument();
  });

  it("shows error message when there is an error", () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: {
        ...defaultState,
        transaction: {
          ...defaultState.transaction,
          status: "error" as const,
          error: "Payment declined",
        },
      },
    });
    expect(screen.getByText("Payment declined")).toBeInTheDocument();
  });

  it("disables button while processing", () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: {
        ...defaultState,
        transaction: {
          ...defaultState.transaction,
          status: "creating" as const,
        },
      },
    });
    const button = screen.getByRole("button", {
      name: /Creando transacción/,
    });
    expect(button).toBeDisabled();
  });

  it("shows product info card", () => {
    renderWithProviders(<CheckoutPage />, { preloadedState: defaultState });
    expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  });

  it("shows change buttons for shipping and payment", () => {
    renderWithProviders(<CheckoutPage />, { preloadedState: defaultState });
    const changeButtons = screen.getAllByText("CAMBIAR");
    expect(changeButtons).toHaveLength(2);
  });
});
