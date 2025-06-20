import { apiSlice } from "@/redux/api/apiSlice";

export const shippingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShippingOptions: builder.query({
      query: () => ({
        url: "/shipping/",
      }),
      providesTags: ["Shipping"],
      transformResponse: (responseData) => {
        const shippingOptions = responseData?.shipping_options || [];

        return {
          ids: shippingOptions.map((item) => item.id),
          entities: shippingOptions.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {}),
        };
      },
    }),
    calculateShipping: builder.mutation({
      query: ({ shipping_id, order_total }) => ({
        url: "/shipping/calculate_shipping/",
        method: "POST",
        body: { shipping_id, order_total },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response) => response,
      transformErrorResponse: (error) => ({
        success: false,
        error: error.data?.detail || "Error al calcular el envío",
      }),
    }),
    checkCoupon: builder.query({
      query: ({ name, cart_total }) => {
        // Construir los parámetros de la query
        const params = new URLSearchParams();
        params.append("cart_total", cart_total);

        // Siempre usar el valor como nombre del cupón
        const couponName = (name || "").trim().toUpperCase();
        if (couponName) {
          params.append("name", couponName);
        }

        return {
          url: `/coupons/check/?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        return {
          coupon: response.coupon,
          discount: response.discount,
          is_valid: response.is_valid,
          error: response.error,
        };
      },
      transformErrorResponse: (response) => {
        const error = response.data?.error || "Error al verificar el cupón";
        return {
          error,
          is_valid: false,
          discount: 0,
        };
      },
      providesTags: ["Coupon"],
      keepUnusedDataFor: 300,
      retry: 2,
      retryDelay: 1000,
    }),
  }),
});

export const {
  useGetShippingOptionsQuery,
  useCheckCouponQuery,
  useCalculateShippingMutation,
} = shippingApiSlice;
