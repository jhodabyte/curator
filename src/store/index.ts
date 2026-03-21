import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { persistMiddleware, loadPersistedState } from "./persistence";

const preloadedState = loadPersistedState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistMiddleware),
});

export type { RootState } from "./rootReducer";
export type AppDispatch = typeof store.dispatch;
