import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiAppSlice } from "@/redux/api/apiAppSlice";

// Adaptador para la estructura de pagos
const paymentAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// Estado inicial
const initialState = paymentAdapter.getInitialState();

// Headers comunes para las peticiones
const COMMON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Interfaz para los datos de pago
const createPaymentData = ({
  nonce,
  shipping_id,
  full_name,
  address_line_1,
  address_line_2,
  city,
  state_province_region,
  postal_zip_code,
  country_region,
  telephone_number,
}) => ({
  nonce,
  shipping_id,
  full_name,
  address_line_1,
  address_line_2,
  city,
  state_province_region,
  postal_zip_code,
  country_region,
  telephone_number,
});

// Slice de la API de pagos
export const paymentApiSlice = apiAppSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentTotal: builder.query({
      query: ({ token, shipping_id }) => ({
        url: `/payments/get-payment-total`,
        method: "GET",
        params: { shipping_id },
        headers: {
          ...COMMON_HEADERS,
          Authorization: `JWT ${token}`,
        },
      }),
      transformResponse: (response) => response.total,
      providesTags: ["Payment"],
    }),

    getClientToken: builder.query({
      query: ({ token }) => ({
        url: "/payments/get-token",
        method: "GET",
        headers: {
          ...COMMON_HEADERS,
          Authorization: `JWT ${token}`,
        },
      }),
      transformResponse: (response) => response.token,
      providesTags: ["Payment"],
    }),

    processPayment: builder.mutation({
      query: ({ token, paymentData }) => ({
        url: "/payments/make-payment",
        method: "POST",
        body: createPaymentData(paymentData),
        headers: {
          ...COMMON_HEADERS,
          Authorization: `JWT ${token}`,
        },
      }),
      transformResponse: (response) => response.data,
      transformErrorResponse: (error) => {
        return {
          status: error?.status,
          message: error?.data?.message || "Error procesando el pago",
        };
      },
      invalidatesTags: ["Payment", "Cart"],
      extraOptions: { maxRetries: 0 },
    }),

    verifyPayment: builder.query({
      query: ({ token, paymentId }) => ({
        url: `/payments/verify-payment/${paymentId}`,
        method: "GET",
        headers: {
          ...COMMON_HEADERS,
          Authorization: `JWT ${token}`,
        },
      }),
      transformResponse: (response) => response.status,
      providesTags: ["Payment"],
    }),
  }),
});

// Hooks exportados
export const {
  useGetPaymentTotalQuery,
  useGetClientTokenQuery,
  useProcessPaymentMutation,
  useVerifyPaymentQuery,
} = paymentApiSlice;
