import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiAppSlice } from "@/redux/api/apiAppSlice";

// Adaptar la estructura de la entidad para el carrito
const cartAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// Definir el estado inicial del carrito
const initialState = cartAdapter.getInitialState();

// Constantes para headers comunes
const COMMON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Función auxiliar para transformar respuestas
const transformResponseData = (response) => response.data;

// Función auxiliar para agregar fechas a los items
const addDatesToItems = (items) => {
  items.forEach((item, idx) => {
    if (!item.date) {
      item.date = sub(new Date(), { minutes: idx + 1 }).toISOString();
    }
  });
  return items;
};

// Implementar la lógica de la API para el carrito
export const cartApiSlice = apiAppSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => ({
        url: "/cart/cart-items/",
      }),
      providesTags: ["Cart"],
      transformResponse: (responseData) => {
        const loadedItems = responseData?.cart_items ?? [];
        const itemsWithDates = addDatesToItems(loadedItems);
        return cartAdapter.setAll(initialState, itemsWithDates);
      },
    }),

    addItemToCart: builder.mutation({
      query: ({ newItem, token }) => ({
        url: "/cart/add-item/",
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          ...COMMON_HEADERS,
          Authorization: `JWT ${token}`,
        },
      }),
      transformResponse: transformResponseData,
      transformErrorResponse: transformResponseData,
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),

    decQty: builder.mutation({
      query: (inventoryId) => ({
        url: "/cart/decrease-quantity/",
        method: "PUT",
        body: inventoryId,
      }),
      transformResponse: transformResponseData,
      transformErrorResponse: transformResponseData,
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),

    incQty: builder.mutation({
      query: (inventoryId) => ({
        url: "/cart/increase-quantity/",
        method: "PUT",
        body: inventoryId,
      }),
      transformResponse: transformResponseData,
      transformErrorResponse: transformResponseData,
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),

    removeItem: builder.mutation({
      query: ({ itemId }) => ({
        url: `/cart/remove-item/`,
        method: "POST",
        body: JSON.stringify(itemId),
        headers: COMMON_HEADERS,
      }),
      transformResponse: transformResponseData,
      transformErrorResponse: transformResponseData,
      invalidatesTags: ["Cart"],
      extraOptions: { maxRetries: 0 },
    }),

    getShippingOptions: builder.query({
      query: () => ({
        url: "/shipping/get-shipping-options/",
      }),
      providesTags: ["Cart"],
      transformResponse: (responseData) => {
        const loadedItems = responseData?.shipping_options ?? [];
        const itemsWithDates = addDatesToItems(loadedItems);
        return cartAdapter.setAll(initialState, itemsWithDates);
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
