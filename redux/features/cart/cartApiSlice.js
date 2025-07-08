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

        // Capture backend totals and coupons
        const subtotal = responseData?.subtotal ?? 0;
        const cart_total = responseData?.cart_total ?? 0;
        const discount_amount = responseData?.discount_amount ?? 0;
        const coupons = responseData?.coupons ?? [];


        // Return normalized items along with backend totals and coupons
        return {
            ...cartAdapter.setAll(initialState, loadedItems),
            subtotal,
            cart_total,
            discount_amount,
            coupons,
        };
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
  }),
});

export const {
  useGetItemsQuery,
  useAddItemToCartMutation,
  useDecQtyMutation,
  useIncQtyMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApiSlice;
