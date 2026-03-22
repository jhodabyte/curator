import { describe, it, expect, vi, beforeEach } from "vitest";
import reducer, {
  setSelectedGalleryId,
  setSelectedProduct,
  fetchProducts,
} from "./productSlice";
import type { Product } from "../../types/api";
import { createTestStore } from "../../test/test-utils";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop Pro",
    description: "High performance laptop",
    price: 2500000,
    stock: 10,
    images: [],
  },
  {
    id: "2",
    name: "Headphones",
    description: "Bluetooth headphones",
    price: 350000,
    stock: 25,
    images: [],
  },
];

describe("productSlice", () => {
  it("should return the initial state", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state.products).toEqual([]);
    expect(state.selectedProduct).toBeNull();
    expect(state.selectedGalleryId).toBe("0");
    expect(state.quantity).toBe(1);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set selected gallery id", () => {
    const state = reducer(undefined, setSelectedGalleryId("2"));
    expect(state.selectedGalleryId).toBe("2");
  });

  it("should set selected product", () => {
    const state = reducer(undefined, setSelectedProduct(mockProducts[0]));
    expect(state.selectedProduct).toEqual(mockProducts[0]);
  });

  describe("fetchProducts thunk", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("sets loading true on pending", () => {
      const state = reducer(undefined, fetchProducts.pending(""));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it("sets products and selects first on fulfilled", () => {
      const state = reducer(
        undefined,
        fetchProducts.fulfilled(mockProducts, ""),
      );
      expect(state.products).toEqual(mockProducts);
      expect(state.selectedProduct).toEqual(mockProducts[0]);
      expect(state.loading).toBe(false);
    });

    it("does not override selectedProduct if already set", () => {
      const initial = reducer(undefined, setSelectedProduct(mockProducts[1]));
      const state = reducer(
        initial,
        fetchProducts.fulfilled(mockProducts, ""),
      );
      expect(state.selectedProduct).toEqual(mockProducts[1]);
    });

    it("updates selectedProduct from catalog when ids match", () => {
      const initial = reducer(
        undefined,
        setSelectedProduct({ ...mockProducts[0], stock: 1 }),
      );
      const freshCatalog: Product[] = [
        { ...mockProducts[0], stock: 88 },
        mockProducts[1],
      ];
      const state = reducer(
        initial,
        fetchProducts.fulfilled(freshCatalog, ""),
      );
      expect(state.selectedProduct?.stock).toBe(88);
    });

    it("sets error on rejected", () => {
      const state = reducer(
        undefined,
        fetchProducts.rejected(null, "", undefined, "Network error"),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe("Network error");
    });

    it("dispatches fetch and populates store", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      } as Response);

      const store = createTestStore();
      await store.dispatch(fetchProducts());

      const state = store.getState().product;
      expect(state.products).toEqual(mockProducts);
      expect(state.selectedProduct).toEqual(mockProducts[0]);
    });
  });
});
