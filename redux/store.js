import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { apiAppSlice } from "./api/apiAppSlice";
import authReducer from "./features/auth/authSlice";
import inventorySliceReducer from "./features/inventories/inventorySlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [apiAppSlice.reducerPath]: apiAppSlice.reducer,
    auth: authReducer,
    inventory: inventorySliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiSlice.middleware,
      apiAppSlice.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
