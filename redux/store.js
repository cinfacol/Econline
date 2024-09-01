import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { apiAppSlice } from "./api/apiAppSlice";
import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import inventorySliceReducer from "./features/inventories/inventorySlice";
import modalSliceReducer from "./features/modal/modalSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [apiAppSlice.reducerPath]: apiAppSlice.reducer,
    auth: authReducer,
    cart: cartReducer,
    inventory: inventorySliceReducer,
    modal: modalSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiSlice.middleware,
      apiAppSlice.middleware,
    ]),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);
