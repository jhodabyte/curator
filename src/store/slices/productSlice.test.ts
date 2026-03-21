import { describe, it, expect, vi, beforeEach } from "vitest";
import reducer, {
  setSelectedGalleryId,
  setSelectedColorId,
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
  },
  {
    id: "2",
    name: "Headphones",
    description: "Bluetooth headphones",
    price: 350000,
    stock: 25,
  },
];

describe("productSlice", () => {
  it("should return the initial state", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state.products).toEqual([]);
    expect(state.selectedProduct).toBeNull();
    expect(state.selectedGalleryId).toBe("image-1");
    expect(state.selectedColorId).toBe("midnight");
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set selected gallery id", () => {
    const state = reducer(undefined, setSelectedGalleryId("image-2"));
    expect(state.selectedGalleryId).toBe("image-2");
  });

  it("should set selected color id", () => {
    const state = reducer(undefined, setSelectedColorId("violet"));
    expect(state.selectedColorId).toBe("violet");
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
