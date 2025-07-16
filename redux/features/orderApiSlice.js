import { apiSlice } from "@/redux/api/apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "/orders/get-orders/",
        method: "GET",
      }),
      providesTags: ["Order"],
      transformResponse: (response) => response.orders || [],
    }),
  }),
});

export const { useGetOrdersQuery } = orderApiSlice; 