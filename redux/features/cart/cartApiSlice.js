import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "@/redux/api/apiSlice";

const cartAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = cartAdapter.getInitialState();

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => ({
        url: "/cart/cart-items/",
      }),
      providesTags: ["Cart"],
      transformResponse: (responseData) => {
        const loadedItems = responseData?.cart_items ?? [];

        loadedItems.forEach((item, idx) => {
          if (!item.date) {
            item.date = sub(new Date(), { minutes: idx + 1 }).toISOString();
          }
        });

        return cartAdapter.setAll(initialState, loadedItems);
      },
    }),
    addItemToCart: builder.mutation({
      query: ({ newItem }) => ({
        url: "/cart/add-item/",
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response, meta, arg) => response.data,

      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),
    decQty: builder.mutation({
      query: (inventoryId) => ({
        url: "/cart/decrease-quantity/",
        method: "PUT",
        body: inventoryId,
      }),

      transformResponse: (response, meta, arg) => response.data,

      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),
    incQty: builder.mutation({
      query: (inventoryId) => ({
        url: "/cart/increase-quantity/",
        method: "PUT",
        body: inventoryId,
      }),

      transformResponse: (response, meta, arg) => response.data,

      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),
    removeItem: builder.mutation({
      query: ({ itemId }) => ({
        url: "/cart/remove-item/",
        method: "POST",
        body: JSON.stringify(itemId),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response) => {
        const cartItems = response.cart || [];
        return {
          success: true,
          cart: cartItems,
          totalItems: response.total_items,
          // Extraer datos según la estructura del serializer
          items: cartItems.map((item) => ({
            id: item.id,
            cart: item.cart,
            inventory: item.inventory,
            quantity: item.quantity,
            coupon: item.coupon,
          })),
        };
      },
      transformErrorResponse: (error) => ({
        success: false,
        error: error.data?.error || "Error al eliminar el producto",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/cart/clear/",
        method: "POST",
      }),

      transformResponse: (response, meta, arg) => response,

      // Transformar respuesta para manejar errores
      transformErrorResponse: (response) => response,
      invalidatesTags: ["Cart", "CartItems"],

      extraOptions: {
        maxRetries: 0,
      },
    }),
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
  useGetItemsQuery,
  useAddItemToCartMutation,
  useDecQtyMutation,
  useIncQtyMutation,
  useRemoveItemMutation,
  useGetShippingOptionsQuery,
  useCheckCouponQuery,
  useClearCartMutation,
  useCalculateShippingMutation,
} = cartApiSlice;
