import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { TransactionResponse } from "../../types/api";
import * as api from "../../services/api";
import type { RootState } from "../rootReducer";

export type TransactionState = {
  currentStep: number;
  transactionId: string | null;
  transaction: TransactionResponse | null;
  status:
    | "idle"
    | "creating"
    | "tokenizing"
    | "processing"
    | "polling"
    | "done"
    | "error";
  error: string | null;
  cardNumber: string;
  cvv: string;
};

const initialState: TransactionState = {
  currentStep: 1,
  transactionId: null,
  transaction: null,
  status: "idle",
  error: null,
  cardNumber: "",
  cvv: "",
};

export const submitPayment = createAsyncThunk<
  TransactionResponse,
  void,
  { state: RootState; rejectValue: string }
>(
  "transaction/submitPayment",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const { billingInfo, cardInfo } = state.checkout;
      const { cardNumber, cvv } = state.transaction;
      const product = state.product.selectedProduct;

      if (!product) {
        return rejectWithValue("No se ha seleccionado un producto");
      }

      dispatch(setPaymentStatus("creating"));
      const transaction = await api.createTransaction({
        productId: product.id,
        quantity: 1,
        customer: {
          name: billingInfo.fullName,
          email: `${billingInfo.fullName.toLowerCase().replace(/\s+/g, ".")}@mail.com`,
          phone: "3001234567",
        },
        delivery: {
          address: `${billingInfo.street}, ${billingInfo.postalCode}`,
          city: billingInfo.city,
        },
      });

      dispatch(setTransaction(transaction));

      dispatch(setPaymentStatus("tokenizing"));
      const tokenResponse = await api.tokenizeCard({
        number: cardNumber.replace(/\s+/g, ""),
        cvc: cvv,
        exp_month: cardInfo.expMonth,
        exp_year: cardInfo.expYear,
        card_holder: cardInfo.cardholderName,
      });

      dispatch(setPaymentStatus("processing"));
      const result = await api.processPayment(transaction.id, {
        cardToken: tokenResponse.data.id,
        installments: 1,
      });

      return result;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error procesando el pago";
      return rejectWithValue(message);
    }
  },
);

export const fetchTransaction = createAsyncThunk<
  TransactionResponse,
  string,
  { rejectValue: string }
>("transaction/fetch", async (id, { rejectWithValue }) => {
  try {
    return await api.getTransaction(id);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error obteniendo la transacción";
    return rejectWithValue(message);
  }
});

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setTransaction: (state, action: PayloadAction<TransactionResponse>) => {
      state.transaction = action.payload;
      state.transactionId = action.payload.id;
    },
    setPaymentStatus: (
      state,
      action: PayloadAction<TransactionState["status"]>,
    ) => {
      state.status = action.payload;
    },
    setCardSecrets: (
      state,
      action: PayloadAction<{ cardNumber: string; cvv: string }>,
    ) => {
      state.cardNumber = action.payload.cardNumber;
      state.cvv = action.payload.cvv;
    },
    resetTransaction: (state) => {
      state.transactionId = null;
      state.transaction = null;
      state.status = "idle";
      state.error = null;
      state.cardNumber = "";
      state.cvv = "";
      state.currentStep = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.transaction = action.payload;
        state.status = "done";
        state.error = null;
        state.cardNumber = "";
        state.cvv = "";
        state.currentStep = 4;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Error desconocido";
        state.cardNumber = "";
        state.cvv = "";
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.transaction = action.payload;
        state.transactionId = action.payload.id;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.error = action.payload ?? "Error obteniendo transacción";
      });
  },
});

export const {
  setCurrentStep,
  setTransaction,
  setPaymentStatus,
  setCardSecrets,
  resetTransaction,
  clearError,
} = transactionSlice.actions;
export default transactionSlice.reducer;
