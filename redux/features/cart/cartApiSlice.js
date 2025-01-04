import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
// import { apiAppSlice } from "@/redux/api/apiAppSlice";
import { apiSlice } from "@/redux/api/apiSlice";

// Adaptar la estructura de la entidad para el carrito
const cartAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// Definir el estado inicial del carrito
const initialState = cartAdapter.getInitialState();

// Implementar la lógica de la API para el carrito
export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener los items del carrito
    getItems: builder.query({
      query: () => ({
        url: "/cart/cart-items/",
        /* headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${auth}`,
        }, */
      }),
      providesTags: ["Cart"],
      transformResponse: (responseData) => {
        // Manejar la respuesta del API
        const loadedItems = responseData?.cart_items ?? [];

        // Agregar fechas si no existen
        loadedItems.forEach((item, idx) => {
          if (!item.date) {
            item.date = sub(new Date(), { minutes: idx + 1 }).toISOString();
          }
        });

        // Devolver el estado actualizado
        return cartAdapter.setAll(initialState, loadedItems);
      },
    }),
    addItemToCart: builder.mutation({
      query: ({ newItem, token }) => ({
        url: "/cart/add-item/",
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: ["Cart"], // Invalidate 'Cart' tag on mutation
      extraOptions: { maxRetries: 0 },
    }),
    decQty: builder.mutation({
      query: (inventoryId) => ({
        url: "/cart/decrease-quantity/",
        method: "PUT",
        body: inventoryId,
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: ["Cart"], // Invalidate 'Cart' tag on mutation
      extraOptions: { maxRetries: 0 },
    }),
    incQty: builder.mutation({
      query: (inventoryId) => ({
        url: "/cart/increase-quantity/",
        method: "PUT",
        body: inventoryId,
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: ["Cart"], // Invalidate 'Cart' tag on mutation
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
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: ["Cart"], // Invalidate 'Cart' tag on mutation
      extraOptions: { maxRetries: 0 },
    }),
    // Obtener los items del Envío
    getShippingOptions: builder.query({
      query: () => ({
        url: "/shipping/get-shipping-options/",
      }),
      providesTags: ["Cart"],
      transformResponse: (responseData) => {
        // Manejar la respuesta del API
        const loadedItems = responseData?.shipping_options ?? [];

        // Agregar fechas si no existen
        loadedItems.forEach((item, idx) => {
          if (!item.date) {
            item.date = sub(new Date(), { minutes: idx + 1 }).toISOString();
          }
        });

        // Devolver el estado actualizado
        return cartAdapter.setAll(initialState, loadedItems);
      },
    }),
  }),
});

// Exportar los hooks para acceder a la API
export const {
  useGetItemsQuery,
  useAddItemToCartMutation,
  useDecQtyMutation,
  useIncQtyMutation,
  useRemoveItemMutation,
  useGetShippingOptionsQuery,
} = cartApiSlice;
