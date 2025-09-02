import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "@/redux/api/apiSlice";

const inventoriesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = inventoriesAdapter.getInitialState();

export const inventoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => "/inventory/brands/list/",
      transformResponse: (responseData) => {
        // La respuesta es paginada o lista simple
        return responseData.results || responseData || [];
      },
      providesTags: ["Brands"],
    }),
    createBrand: builder.mutation({
      query: (brandData) => ({
        url: "/inventory/brands/create/",
        method: "POST",
        body: brandData,
      }),
      invalidatesTags: ["Brands"],
    }),
    getProducts: builder.query({
      query: () => "/products/list/",
      transformResponse: (responseData) => {
        // La respuesta es paginada: { count, next, previous, results }
        return responseData.results || [];
      },
      providesTags: ["Products"],
    }),
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
    createInventory: builder.mutation({
      query: (inventoryData) => ({
        url: "/inventory/create/",
        method: "POST",
        body: inventoryData,
      }),
      invalidatesTags: ["Inventory"],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products/create/",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: "update/<slug:slug>/",
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: "delete/<slug:slug>/",
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetInventoriesQuery,
  useGetInventoriesByCategoryQuery,
  useCreateInventoryMutation,
  useGetInventoryImagesQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useGetBrandsQuery,
  useCreateBrandMutation,
} = inventoriesApiSlice;
