import { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import productReducer from "../store/slices/productSlice";
import uiReducer from "../store/slices/uiSlice";
import checkoutReducer from "../store/slices/checkoutSlice";
import transactionReducer from "../store/slices/transactionSlice";
import type { RootState } from "../store";

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore;
  route?: string;
};

export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      product: productReducer,
      ui: uiReducer,
      checkout: checkoutReducer,
      transaction: transactionReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    route = "/",
    ...renderOptions
  }: CustomRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
