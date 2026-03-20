import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProductState = {
  selectedGalleryId: string;
  selectedColorId: string;
};

const initialState: ProductState = {
  selectedGalleryId: "image-1",
  selectedColorId: "midnight",
};

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
  },
});

export const { setSelectedGalleryId, setSelectedColorId } = productSlice.actions;
export default productSlice.reducer;
