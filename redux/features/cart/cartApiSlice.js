import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiAppSlice } from "@/redux/api/apiAppSlice";
// import Cookies from "js-cookie";
// import { getCookie } from "cookies-next";

// Adaptar la estructura de la entidad para el carrito
const cartAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

/* export async function getServerSideProps({ req }) {
  // const { req } = context;
  const token = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith("access="))
    .split("=")[1];
  console.log("token", token);

  return {
    props: {
      token,
    },
  };
} */

// Definir el estado inicial del carrito
const initialState = cartAdapter.getInitialState();

// Implementar la lógica de la API para el carrito
export const cartApiSlice = apiAppSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener los items del carrito
    getItems: builder.query({
      query: () => ({
        url: "/cart/cart-items/",
      }),
      providesTags: ["Cart"],
      transformResponse: (responseData) => {
        // Manejar la respuesta del API
        const loadedItems = responseData?.results?.cart_items ?? [];

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
      query: ({ newItem, acceso }) => ({
        url: "/cart/add-item/",
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${acceso}`,
        },
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: ["Cart"], // Invalidate 'Cart' tag on mutation
      extraOptions: { maxRetries: 0 },
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
  useAddItemToCartMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useEmptyCartMutation,
  useGetTotalQuery,
} = cartApiSlice;
