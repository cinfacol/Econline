import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/redux/api/apiSlice";

const paymentAdapter = createEntityAdapter();

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentTotal: builder.query({
      query: (shipping_id) => ({
        url: `/api/payments/calculate-total/`,
        method: "GET",
        params: { shipping_id },
      }),
      transformResponse: (response) => ({
        ...response,
        calculatedTotal: response.total_amount,
      }),
      providesTags: ["PaymentTotal"],
    }),

    createCheckoutSession: builder.mutation({
      query: (paymentData) => ({
        url: `/api/payments/create-checkout-session/`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment", "Cart"],
    }),

    processPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/api/payments/${paymentId}/process/`,
        method: "POST",
      }),
      invalidatesTags: ["Payment", "Order", "Cart"],
    }),

    verifyPayment: builder.query({
      query: (paymentId) => ({
        url: `/api/payments/${paymentId}/verify/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    retryPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/api/payments/${paymentId}/retry_payment/`,
        method: "POST",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentTotalQuery,
  useCreateCheckoutSessionMutation,
  useProcessPaymentMutation,
  useVerifyPaymentQuery,
  useRetryPaymentMutation,
} = paymentApiSlice;
