import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/redux/api/apiSlice";

const paymentAdapter = createEntityAdapter();

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentTotal: builder.query({
      query: ({ shipping_id, coupon_id = null }) => ({
        url: `/payments/calculate-total/`,
        method: "GET",
        params: { 
          shipping_id,
          coupon_id: coupon_id || undefined
        },
      }),
      transformResponse: (response) => {
        if (!response) {
          console.error("Invalid response for getPaymentTotal:", response);
          return { calculatedTotal: 0 };
        }

        // Convertir los valores string a números
        const totalAmount = parseFloat(response.total_amount) || 0;
        const subtotal = parseFloat(response.subtotal) || 0;
        const shippingCost = parseFloat(response.shipping_cost) || 0;
        const discount = parseFloat(response.discount) || 0;
        return {
          ...response,
          total_amount: totalAmount,
          subtotal: subtotal,
          shipping_cost: shippingCost,
          discount: discount,
          calculatedTotal: totalAmount,
        };
      },
      providesTags: ["PaymentTotal"],
    }),

    getPaymentMethods: builder.query({
      query: () => ({
        url: "/payments/payment-methods/",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (!response || !Array.isArray(response.payment_methods)) {
          console.error("Invalid response for getPaymentMethods:", response);
          return { methods: [], hasPaymentMethods: false };
        }
        return {
          methods: response.payment_methods,
          hasPaymentMethods: response.has_payment_methods || false,
        };
      },
      providesTags: ["PaymentMethods"],
    }),

    createCheckoutSession: builder.mutation({
      transformResponse: (response) => {
        return response;
      },
      query: (paymentData) => ({
        url: `/payments/create-checkout-session/`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment", "Cart"],
    }),

    processPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/process/`,
        method: "POST",
      }),
      transformResponse: (response) => {
        if (!response || typeof response !== "object") {
          console.error("Invalid response for processPayment:", response);
          return {};
        }
        return response;
      },
      invalidatesTags: (result, error, { paymentId }) => [
        { type: "Payment", id: paymentId },
        "Order",
        "Cart",
      ],
    }),

    verifyPayment: builder.query({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/verify/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    retryPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/retry_payment/`,
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
  useGetPaymentMethodsQuery,
} = paymentApiSlice;
