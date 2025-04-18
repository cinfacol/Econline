import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
// import { apiAppSlice } from "@/redux/api/apiAppSlice";
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
        url: `/cart/remove-item/`,
        method: "POST",
        body: JSON.stringify(itemId),
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
        url: "/shipping/get-shipping-options/",
      }),
      providesTags: ["Cart"],
      transformResponse: (responseData) => {
        const loadedItems = responseData?.shipping_options ?? [];

        loadedItems.forEach((item, idx) => {
          if (!item.date) {
            item.date = sub(new Date(), { minutes: idx + 1 }).toISOString();
          }
        });

        return cartAdapter.setAll(initialState, loadedItems);
      },
    }),
    checkCoupon: builder.mutation({
      query: ({ coupon_name }) => ({
        url: "/coupons/check/",
        method: "POST",
        body: JSON.stringify(coupon_name),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),
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
  useCheckCouponMutation,
  useClearCartMutation,
} = cartApiSlice;
