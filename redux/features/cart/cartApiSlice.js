import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiAppSlice } from "@/redux/api/apiAppSlice";

// Adaptar la estructura de la entidad para el carrito
const cartAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// Definir el estado inicial del carrito
const initialState = cartAdapter.getInitialState();

// Implementar la lógica de la API para el carrito
export const cartApiSlice = apiAppSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener los items del carrito
    getItems: builder.query({
      query: () => "/cart/cart-items/",
      transformResponse: (responseData) => {
        // Manejar la respuesta del API
        const loadedItems = responseData.cart ?? [];

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
    addItem: builder.mutation({
      query: (newItem) => {
        const token = document.cookie.getItem("access");
        if (!token) {
          return {
            error: {
              message: "Debe iniciar sesión para agregar un item",
            },
          };
        }

        return {
          url: "/cart/add-item/",
          method: "POST",
          body: newItem,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        };
      },
      /* query: (newItem) => ({
        url: "/cart/add-item/",
        method: "POST",
        body: newItem,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${document.cookie.getItem("access")}`,
        },
      }), */
      // Update the cache after successful addition (optional)
      onSettled: (data, { addError }) => {
        if (data.error) {
          addError(data.error.message);
          return;
        }
        // Optimistic update (assuming successful response includes new item)
        cartAdapter.addOne(data.data, initialState);
      },
    }),
    updateItem: builder.mutation({
      query: (updatedItem) => ({
        url: "/cart/update-item/",
        method: "PUT",
        body: updatedItem,
      }),
      // Update the cache after successful update (optional)
      onSettled: (data, { setError, addError }) => {
        if (data.error) {
          setError(data.error.message);
          return;
        }
        // Optimistic update (assuming successful response includes updated item)
        cartAdapter.updateOne(data.data.id, data.data, initialState);
      },
    }),
    removeItem: builder.mutation({
      query: (itemId) => ({
        url: `/cart/remove-item/${itemId}/`,
        method: "DELETE",
      }),
      // Update the cache after successful deletion (optional)
      onSettled: (data, { setError, addError }) => {
        if (data.error) {
          setError(data.error.message);
          return;
        }
        // Optimistic update (assuming successful response confirms deletion)
        cartAdapter.removeOne(itemId, initialState);
      },
    }),
    emptyCart: builder.mutation({
      query: () => ({
        url: "/cart/empty-cart/",
        method: "POST",
      }),
      // Invalidate the cart cache after successful emptying
      onSettled: () => {
        cartAdapter.setAll(initialState, []);
      },
    }),

    getTotal: builder.query({
      query: () => "/cart/get-total/",
      transformResponse: (responseData) => responseData.total, // Extract the total value
    }),
  }),
});

// Exportar los hooks para acceder a la API
export const {
  useGetItemsQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useEmptyCartMutation,
  useGetTotalQuery,
} = cartApiSlice;
