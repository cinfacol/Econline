import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiAppSlice = createApi({
  reducerPath: "apiApp",
  tagTypes: ["Inventories", "Inventory", "Cart", "Products"], // Define global tag type
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = getState().auth.token;

    //   // If we have a token set in state, let's assume that we should be passing it.
    //   if (token) {
    //     headers.set("authorization", `JWT ${token}`);
    //   }
    //   console.log("token", token);
    //   return headers;
    // },
    credentials: "include",
  }),
  endpoints: (builder) => ({}),
});
