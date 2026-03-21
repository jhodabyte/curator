import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BillingInfo = {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
};

export type CardInfo = {
  cardholderName: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
};

type CheckoutState = {
  billingInfo: BillingInfo;
  cardInfo: CardInfo;
};

const initialState: CheckoutState = {
  billingInfo: {
    fullName: "Julian Casablancas",
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
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setBillingInfo: (state, action: PayloadAction<BillingInfo>) => {
      state.billingInfo = action.payload;
    },
    setCardInfo: (state, action: PayloadAction<CardInfo>) => {
      state.cardInfo = action.payload;
    },
  },
});

export const { setBillingInfo, setCardInfo } = checkoutSlice.actions;
export default checkoutSlice.reducer;
