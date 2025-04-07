import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/redux/api/apiSlice";

const paymentAdapter = createEntityAdapter();

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentTotal: builder.query({
      query: (shipping_id) => ({
        url: `/payments/calculate-total/`,
        method: "GET",
        params: { shipping_id },
      }),
      transformResponse: (response) => ({
        ...response,
        calculatedTotal: response.total_amount,
      }),
      providesTags: ["PaymentTotal"],
    }),

    getClientToken: builder.query({
      query: () => ({
        url: `/payments/client-token/`,
        method: "GET",
      }),
      transformResponse: (response) => response.token,
      providesTags: ["ClientToken"],
    }),

    createCheckoutSession: builder.mutation({
      query: ({ orderId, paymentData }) => ({
        url: `/payments/${orderId}/create-checkout-session/`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment"],
    }),

    processPayment: builder.mutation({
      query: ({ orderId, paymentData }) => ({
        url: `/payments/${orderId}/process/`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment", "Order"],
    }),

    verifyPayment: builder.query({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/verify/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    getPaymentDetails: builder.query({
      query: (paymentId) => `/payments/${paymentId}/`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),
  }),
});

export const {
  useGetPaymentTotalQuery,
  useGetClientTokenQuery,
  useCreateCheckoutSessionMutation,
  useProcessPaymentMutation,
  useVerifyPaymentQuery,
  useGetPaymentDetailsQuery,
} = paymentApiSlice;
