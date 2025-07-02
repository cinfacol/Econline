import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "@/redux/api/apiSlice";

const paymentAdapter = createEntityAdapter();

// Utilidad para extraer mensajes de error de la API
const parseApiError = (response) => {
  if (!response) return { error: "Error desconocido. Intenta de nuevo." };
  if (typeof response === "string") return { error: response };
  if (response.detail) return { error: response.detail };
  if (response.error) return { error: response.error };
  if (response.message) return { error: response.message };
  return { error: "Error inesperado. Intenta más tarde." };
};

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentTotal: builder.query({
      query: ({ shipping_id, coupon_id = null }) => ({
        url: `/payments/calculate-total/`,
        method: "GET",
        params: {
          shipping_id,
          coupon_id: coupon_id || undefined,
        },
      }),
      transformResponse: (response) => {
        if (!response) {
          console.error("Invalid response for getPaymentTotal:", response);
          return { calculatedTotal: 0, ...parseApiError(response) };
        }
        if (response.error || response.detail || response.message) {
          return { calculatedTotal: 0, ...parseApiError(response) };
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
          return {
            methods: [],
            hasPaymentMethods: false,
            ...parseApiError(response),
          };
        }
        if (response.error || response.detail || response.message) {
          return {
            methods: [],
            hasPaymentMethods: false,
            ...parseApiError(response),
          };
        }
        return {
          methods: response.payment_methods,
          hasPaymentMethods: response.has_payment_methods || false,
        };
      },
      providesTags: ["PaymentMethods"],
    }),

    createCheckoutSession: builder.mutation({
      query: (paymentData) => ({
        url: `/payments/create-checkout-session/`,
        method: "POST",
        body: paymentData,
      }),
      transformResponse: (response) => {
        if (!response || typeof response !== "object") {
          console.error(
            "Invalid response for createCheckoutSession:",
            response
          );
          return parseApiError(response);
        }
        if (response.error || response.detail || response.message) {
          return parseApiError(response);
        }
        return response;
      },
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
          return parseApiError(response);
        }
        if (response.error || response.detail || response.message) {
          return parseApiError(response);
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
      transformResponse: (response) => {
        if (!response || typeof response !== "object") {
          console.error("Invalid response for verifyPayment:", response);
          return parseApiError(response);
        }
        if (response.error || response.detail || response.message) {
          return parseApiError(response);
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    retryPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/retry_payment/`,
        method: "POST",
      }),
      transformResponse: (response) => {
        if (!response || typeof response !== "object") {
          console.error("Invalid response for retryPayment:", response);
          return parseApiError(response);
        }
        if (response.error || response.detail || response.message) {
          return parseApiError(response);
        }
        return response;
      },
      invalidatesTags: ["Payment"],
    }),

    cancelPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/cancel/`,
        method: "POST",
      }),
      transformResponse: (response) => {
        if (!response || typeof response !== "object") {
          console.error("Invalid response for cancelPayment:", response);
          return parseApiError(response);
        }
        if (response.error || response.detail || response.message) {
          return parseApiError(response);
        }
        return response;
      },
      invalidatesTags: (result, error, paymentId) => [
        { type: "Payment", id: paymentId },
        "Order",
        "Cart",
      ],
    }),

    getPaymentBySession: builder.query({
      query: (sessionId) => ({
        url: `/payments/get-payment-by-session/`,
        method: "GET",
        params: { session_id: sessionId },
      }),
      transformResponse: (response) => {
        if (!response || typeof response !== "object") {
          console.error("Invalid response for getPaymentBySession:", response);
          return parseApiError(response);
        }
        if (response.error || response.detail || response.message) {
          return parseApiError(response);
        }
        return response;
      },
      providesTags: (result, error, sessionId) => [
        { type: "Payment", id: result?.payment_id },
        "Order",
      ],
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
  useCancelPaymentMutation,
  useGetPaymentBySessionQuery,
} = paymentApiSlice;
