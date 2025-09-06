import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuth, logout } from "@/redux/features/auth/authSlice";
import { Mutex } from "async-mutex";

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
  credentials: "include",
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/jwt/refresh/",
            method: "POST",
          },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: [
    "Address",
    "AttributeValues",
    "Brands",
    "Cart",
    "CartItems",
    "Categories",
    "ClientToken",
    "Coupon",
    "Inventories",
    "Inventory",
    "MeasureUnits",
    "Order",
    "Products",
    "Payment",
    "PaymentMethods",
    "PaymentTotal",
    "Shipping",
    "Types",
    "Token",
    "User",
    "Auth",
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
