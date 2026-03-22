import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import uiReducer from "./slices/uiSlice";
import checkoutReducer from "./slices/checkoutSlice";
import transactionReducer from "./slices/transactionSlice";

export const rootReducer = combineReducers({
  product: productReducer,
  ui: uiReducer,
  checkout: checkoutReducer,
  transaction: transactionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
