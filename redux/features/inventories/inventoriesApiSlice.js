import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "@/redux/api/apiSlice";

const inventoriesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = inventoriesAdapter.getInitialState();

export const inventoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventories: builder.query({
      query: ({ searchTerm, categoryTerm }) => {
        const baseUrl = "/inventory/";
        let url = searchTerm ? `${baseUrl}search/?query=${searchTerm}` : "";
        url = categoryTerm ? `${baseUrl}category/${categoryTerm}` : url;
        url = !url ? `${baseUrl}all/` : url;
        return url;
      },
      transformResponse: (responseData) => {
        // Leverage optional chaining for safer access to nested properties
        const loadedInventories = responseData?.inventories
          ? responseData?.inventories?.map((inventory) => {
              if (!inventory?.date) {
                // Consider using a configurable offset or randomization for date generation
                inventory.date = sub(new Date(), {
                  minutes: Math.floor(Math.random() * 60),
                }).toISOString(); // 0-59 random minutes
              }
              return inventory;
            })
          : responseData?.results?.map((inventory) => {
              if (!inventory?.date) {
                // Consider using a configurable offset or randomization for date generation
                inventory.date = sub(new Date(), {
                  minutes: Math.floor(Math.random() * 60),
                }).toISOString(); // 0-59 random minutes
              }
              return inventory;
            });
        loadedInventories || []; // Ensure an empty array if results is undefined

        return inventoriesAdapter.setAll(initialState, loadedInventories);
      },
      providesTags: (result, error, arg) => [
        { type: "Inventory", id: "LIST" },
        ...result?.ids.map((id) => ({ type: "Inventory", id })), // Specific tags per inventory
      ],
    }),
    getInventoriesByCategory: builder.query({
      query: (categories) => {
        // Join categories into a comma-separated string
        const categoryString = categories?.join(",");

        return `/inventory/category/${categoryString}/`;
      },
      transformResponse: (responseData) => {
        let min = 1;
        const loadedInventories = responseData?.results?.map((inventory) => {
          if (!inventory.date) {
            inventory.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          return inventory;
        });
        return inventoriesAdapter.setAll(initialState, loadedInventories);
      },
    }),
    getProduct: builder.query({
      query: (inventoryId) => `/inventory/details/${inventoryId}/`,
      providesTags: ["Products"],
    }),
    getInventoryImages: builder.query({
      query: () => `/inventory/images/`,
      transformResponse: (responseData) => {
        let images = [];
        images = responseData;
        return images;
      },
      providesTags: ["Inventory"],
    }),

    // Endpoint para crear un producto
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/inventory/create/", // Asumiendo que el endpoint es /api/products/
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"], // Invalidar la caché de "Product" después de crear
    }),
    // Endpoint para actualizar un producto
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: "update/<slug:slug>/", // Asumiendo que el endpoint es /api/products/{id}/
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Product"], // Invalidar la caché de "Product" después de actualizar
    }),
    // Endpoint para eliminar un producto
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: "delete/<slug:slug>/", // Asumiendo que el endpoint es /api/products/{id}/
        method: "DELETE",
      }),
      invalidatesTags: ["Product"], // Invalidar la caché de "Product" después de eliminar
    }),
  }),
});

export const {
  useGetInventoriesQuery,
  useGetInventoriesByCategoryQuery,
  useGetInventoryImagesQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = inventoriesApiSlice;
