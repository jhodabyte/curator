import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BillingInfoModal from "./billing-info-modal";
import { renderWithProviders } from "../../test/test-utils";
import { Dialog } from "../ui/dialog";

function renderModal(preloadedState = {}) {
  return renderWithProviders(
    <Dialog open>
      <BillingInfoModal />
    </Dialog>,
    { preloadedState },
  );
}

describe("BillingInfoModal", () => {
  it("renders all form sections", () => {
    renderModal();

    expect(screen.getByText("Información Personal")).toBeInTheDocument();
    expect(screen.getByText("Información de Tarjeta")).toBeInTheDocument();
    expect(screen.getByText("Destino de Entrega")).toBeInTheDocument();
  });

  it("renders step indicator", () => {
    renderModal();
    expect(screen.getByText("PASO 2 DE 5")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    renderModal();

    expect(screen.getByLabelText("NOMBRE COMPLETO")).toBeInTheDocument();
    expect(screen.getByLabelText("NOMBRE DEL TITULAR")).toBeInTheDocument();
    expect(screen.getByLabelText("NUMERO DE TARJETA")).toBeInTheDocument();
    expect(screen.getByLabelText("EXPIRACION")).toBeInTheDocument();
    expect(screen.getByLabelText("CVV")).toBeInTheDocument();
    expect(screen.getByLabelText("CALLE Y NÚMERO")).toBeInTheDocument();
    expect(screen.getByLabelText("CIUDAD")).toBeInTheDocument();
    expect(screen.getByLabelText("CÓDIGO POSTAL")).toBeInTheDocument();
  });

  it("pre-fills fullName from store", () => {
    renderModal({
      checkout: {
        billingInfo: {
          fullName: "Test User",
          street: "",
          city: "",
          postalCode: "",
        },
        cardInfo: {
          cardholderName: "",
          brand: "",
          last4: "",
          expMonth: "",
          expYear: "",
        },
      },
    });

    const nameInput = screen.getByLabelText("NOMBRE COMPLETO") as HTMLInputElement;
    expect(nameInput.value).toBe("Test User");
  });

  it("disables submit button when form is invalid", () => {
    renderModal();
    const submitBtn = screen.getByRole("button", { name: /Continuar/i });
    expect(submitBtn).toBeDisabled();
  });

  it("detects VISA brand when typing card number", async () => {
    const user = userEvent.setup();
    renderModal();

    const cardInput = screen.getByLabelText("NUMERO DE TARJETA");
    await user.type(cardInput, "4242424242424242");

    await waitFor(() => {
      expect(screen.getByLabelText("Visa")).toBeInTheDocument();
    });
  });

  it("detects MASTERCARD brand", async () => {
    const user = userEvent.setup();
    renderModal();

    const cardInput = screen.getByLabelText("NUMERO DE TARJETA");
    await user.type(cardInput, "5111111111111118");

    await waitFor(() => {
      expect(screen.getByLabelText("Mastercard")).toBeInTheDocument();
    });
  });

  it("formats card number with spaces", async () => {
    const user = userEvent.setup();
    renderModal();

    const cardInput = screen.getByLabelText("NUMERO DE TARJETA") as HTMLInputElement;
    await user.type(cardInput, "4242424242424242");

    await waitFor(() => {
      expect(cardInput.value).toBe("4242 4242 4242 4242");
    });
  });

  it("formats expiry with slash", async () => {
    const user = userEvent.setup();
    renderModal();

    const expiryInput = screen.getByLabelText("EXPIRACION") as HTMLInputElement;
    await user.type(expiryInput, "1228");

    await waitFor(() => {
      expect(expiryInput.value).toBe("12/28");
    });
  });

  it("limits CVV to 4 digits", async () => {
    const user = userEvent.setup();
    renderModal();

    const cvvInput = screen.getByLabelText("CVV") as HTMLInputElement;
    await user.type(cvvInput, "12345");

    await waitFor(() => {
      expect(cvvInput.value).toBe("1234");
    });
  });

  it("shows validation errors when clearing a required field", async () => {
    const user = userEvent.setup();
    renderModal({
      checkout: {
        billingInfo: {
          fullName: "X",
          street: "",
          city: "",
          postalCode: "",
        },
        cardInfo: {
          cardholderName: "",
          brand: "",
          last4: "",
          expMonth: "",
          expYear: "",
        },
      },
    });

    const fullNameInput = screen.getByLabelText("NOMBRE COMPLETO");
    await user.clear(fullNameInput);

    await waitFor(() => {
      expect(screen.getByText("El nombre es obligatorio")).toBeInTheDocument();
    });
  });

  it("enables submit when all fields are valid and dispatches on submit", async () => {
    const user = userEvent.setup();
    const { store } = renderModal({
      checkout: {
        billingInfo: {
          fullName: "",
          street: "",
          city: "",
          postalCode: "",
        },
        cardInfo: {
          cardholderName: "",
          brand: "",
          last4: "",
          expMonth: "",
          expYear: "",
        },
      },
    });

    await user.type(screen.getByLabelText("NOMBRE COMPLETO"), "John Doe");
    await user.type(screen.getByLabelText("NOMBRE DEL TITULAR"), "John Doe");
    await user.type(screen.getByLabelText("NUMERO DE TARJETA"), "4242424242424242");
    await user.type(screen.getByLabelText("EXPIRACION"), "1228");
    await user.type(screen.getByLabelText("CVV"), "123");
    await user.type(screen.getByLabelText("CALLE Y NÚMERO"), "Calle 123");
    await user.type(screen.getByLabelText("CIUDAD"), "Bogotá");
    await user.type(screen.getByLabelText("CÓDIGO POSTAL"), "110111");

    await waitFor(() => {
      const submitBtn = screen.getByRole("button", { name: /Continuar/i });
      expect(submitBtn).not.toBeDisabled();
    });

    const submitBtn = screen.getByRole("button", { name: /Continuar/i });
    await user.click(submitBtn);

    await waitFor(() => {
      const state = store.getState();
      expect(state.checkout.billingInfo.fullName).toBe("John Doe");
      expect(state.checkout.cardInfo.brand).toBe("VISA");
      expect(state.checkout.cardInfo.last4).toBe("4242");
      expect(state.transaction.cardNumber).toBe("4242424242424242");
      expect(state.transaction.cvv).toBe("123");
    });
  });

  it("renders back button", () => {
    renderModal();
    expect(screen.getByRole("button", { name: /Atrás/i })).toBeInTheDocument();
  });
});
