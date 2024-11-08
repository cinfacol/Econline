import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiAppSlice } from "@/redux/api/apiAppSlice";

// Adaptar la estructura de la entidad para pagos
const paymentAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// Definir el estado inicial de pagos
const initialState = paymentAdapter.getInitialState();

// Implementar la lógica de la API para pagos
export const paymentApiSlice = apiAppSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener el total a pagar
    getPaymentTotal: builder.query({
      query: () => ({
        url: "/payments/get-payment-total/",
        method: "GET",
      }),
      transformResponse: (response) => response.total,
      providesTags: ["Payment"],
    }),

    // Obtener token de pago
    getToken: builder.query({
      query: () => ({
        url: "/payments/get-token/",
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      transformResponse: (response) => response.token,
      providesTags: ["Payment"],
    }),

    // Realizar el pago
    makePayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payments/make-payment/",
        method: "POST",
        body: JSON.stringify(paymentData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
      invalidatesTags: ["Payment", "Cart"],
      extraOptions: { maxRetries: 0 },
    }),

    // Verificar estado del pago
    verifyPayment: builder.query({
      query: (paymentId) => ({
        url: `/payments/verify-payment/${paymentId}/`,
        method: "GET",
      }),
      transformResponse: (response) => response.status,
      providesTags: ["Payment"],
    }),
  }),
});

// Exportar los hooks para acceder a la API
export const {
  useGetPaymentTotalQuery,
  useGetTokenQuery,
  useMakePaymentMutation,
  useVerifyPaymentQuery,
} = paymentApiSlice;
