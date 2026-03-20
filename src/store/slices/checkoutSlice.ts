import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BillingInfo = {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
};

type CheckoutState = {
  billingInfo: BillingInfo;
};

const initialState: CheckoutState = {
  billingInfo: {
    fullName: "Julian Casablancas",
    street: "",
    city: "",
    postalCode: "",
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setBillingInfo: (state, action: PayloadAction<BillingInfo>) => {
      state.billingInfo = action.payload;
    },
  },
});

export const { setBillingInfo } = checkoutSlice.actions;
export default checkoutSlice.reducer;
