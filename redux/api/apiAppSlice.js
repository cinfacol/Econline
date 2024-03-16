import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiAppSlice = createApi({
  reducerPath: "apiApp",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
    credentials: "include",
  }),
  endpoints: (builder) => ({}),
});
