import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductPage from "./ProductPage";
import { renderWithProviders } from "../test/test-utils";
import type { Product } from "../types/api";

const mockProduct: Product = {
  id: "prod-1",
  name: "Laptop Pro 15",
  description: "High performance laptop",
  price: 2500000,
  stock: 10,
  images: ["/img-a.png"],
};

const mockProductLowStock: Product = {
  ...mockProduct,
  stock: 3,
};

const mockProductOutOfStock: Product = {
  ...mockProduct,
  stock: 0,
};

const productStateBase = {
  products: [mockProduct],
  selectedProduct: mockProduct,
  selectedGalleryId: "0",
  quantity: 1,
  loading: false,
  error: null,
};

describe("ProductPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading state initially when no products", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));
    renderWithProviders(<ProductPage />);
    expect(screen.getByText("Cargando productos...")).toBeInTheDocument();
  });

  it("displays product name and description", () => {
    renderWithProviders(<ProductPage />, {
      preloadedState: {
        product: productStateBase,
      },
    });

    expect(screen.getByText("Laptop Pro 15")).toBeInTheDocument();
    expect(
      screen.getByText("High performance laptop"),
    ).toBeInTheDocument();
  });

  it("displays product price formatted", () => {
    renderWithProviders(<ProductPage />, {
      preloadedState: {
        product: productStateBase,
      },
    });

    expect(screen.getByText("$2.500.000")).toBeInTheDocument();
  });

  it("shows low stock warning when stock <= 5", () => {
    renderWithProviders(<ProductPage />, {
      preloadedState: {
        product: {
          ...productStateBase,
          products: [mockProductLowStock],
          selectedProduct: mockProductLowStock,
        },
      },
    });

    expect(
      screen.getByText(/SOLO QUEDAN 3 UNIDADES EN STOCK/),
    ).toBeInTheDocument();
  });

  it("shows out of stock and disables button when stock is 0", () => {
    renderWithProviders(<ProductPage />, {
      preloadedState: {
        product: {
          ...productStateBase,
          products: [mockProductOutOfStock],
          selectedProduct: mockProductOutOfStock,
        },
      },
    });

    expect(screen.getByText("AGOTADO")).toBeInTheDocument();
    const buttons = screen.getAllByText("Sin stock disponible");
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn) => {
      expect(btn.closest("button")).toBeDisabled();
    });
  });

  it("shows error state with retry button", () => {
    renderWithProviders(<ProductPage />, {
      preloadedState: {
        product: {
          products: [mockProduct],
          selectedProduct: null,
          selectedGalleryId: "0",
          quantity: 1,
          loading: false,
          error: "Network error",
        },
      },
    });

    expect(screen.getByText("Network error")).toBeInTheDocument();
    expect(screen.getByText("Reintentar")).toBeInTheDocument();
  });

  it("shows stock count when stock > 5", () => {
    renderWithProviders(<ProductPage />, {
      preloadedState: {
        product: productStateBase,
      },
    });

    expect(screen.getByText("10 EN STOCK")).toBeInTheDocument();
  });

  it("allows selecting gallery thumbnail", async () => {
    const user = userEvent.setup();
    const multiImageProduct: Product = {
      ...mockProduct,
      images: ["/a.png", "/b.png"],
    };
    const { store } = renderWithProviders(<ProductPage />, {
      preloadedState: {
        product: {
          ...productStateBase,
          products: [multiImageProduct],
          selectedProduct: multiImageProduct,
        },
      },
    });

    const secondThumb = screen.getByLabelText("Seleccionar vista 2");
    await user.click(secondThumb);

    expect(store.getState().product.selectedGalleryId).toBe("1");
  });
});
