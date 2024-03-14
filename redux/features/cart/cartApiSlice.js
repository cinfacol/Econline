import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
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
  }),
});

// Exportar los hooks para acceder a la API
export const { useGetItemsQuery } = cartApiSlice;
