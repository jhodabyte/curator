import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  isBillingOpen: boolean;
};

const initialState: UiState = {
  isBillingOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openBillingModal: (state) => {
      state.isBillingOpen = true;
    },
    closeBillingModal: (state) => {
      state.isBillingOpen = false;
    },
    setBillingOpen: (state, action: PayloadAction<boolean>) => {
      state.isBillingOpen = action.payload;
    },
  },
});

export const { openBillingModal, closeBillingModal, setBillingOpen } =
  uiSlice.actions;
export default uiSlice.reducer;
