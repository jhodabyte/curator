import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Product } from "../../types/api";
import * as api from "../../services/api";

type ProductState = {
  products: Product[];
  selectedProduct: Product | null;
  selectedGalleryId: string;
  selectedColorId: string;
  loading: boolean;
  error: string | null;
};

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  selectedGalleryId: "image-1",
  selectedColorId: "midnight",
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("product/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    return await api.getProducts();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error cargando productos";
    return rejectWithValue(message);
  }
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedGalleryId: (state, action: PayloadAction<string>) => {
      state.selectedGalleryId = action.payload;
    },
    setSelectedColorId: (state, action: PayloadAction<string>) => {
      state.selectedColorId = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
        if (action.payload.length > 0 && !state.selectedProduct) {
          state.selectedProduct = action.payload[0];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error cargando productos";
      });
  },
});

export const { setSelectedGalleryId, setSelectedColorId, setSelectedProduct } =
  productSlice.actions;
export default productSlice.reducer;
