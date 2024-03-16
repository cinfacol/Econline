import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiAppSlice } from "@/redux/api/apiAppSlice";

const inventoriesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = inventoriesAdapter.getInitialState();

export const inventoriesApiSlice = apiAppSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInventories: builder.query({
      query: () => "/inventory/all/",
      transformResponse: (responseData) => {
        let min = 1;
        const loadedInventories = responseData.results.map((inventory) => {
          if (!inventory?.date)
            inventory.date = sub(new Date(), { minutes: min++ }).toISOString();
          return inventory;
        });
        return inventoriesAdapter.setAll(initialState, loadedInventories);
      },
      /* providesTags: (result, error, arg) => [
        "products",
        ...result?.ids.map((id) => ({ id })),
      ], */
    }),
    getInventoriesByCategory: builder.query({
      query: (categories) => {
        // Join categories into a comma-separated string
        const categoryString = categories.join(",");

        return `/inventory/category/${categoryString}/`;
      },
      transformResponse: (responseData) => {
        let min = 1;
        const loadedInventories = responseData.results.map((inventory) => {
          if (!inventory?.date) {
            inventory.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          return inventory;
        });
        return inventoriesAdapter.setAll(initialState, loadedInventories);
      },
    }),

    /* getProductsByAgent: builder.query({
      query: () => "agents/",
      transformResponse: (responseData) => {
        let min = 1;
        const loadedProducts = responseData.map((product) => {
          if (!product?.date)
            product.date = sub(new Date(), { minutes: min++ }).toISOString();
          return product;
        });
        return productsAdapter.setAll(initialState, loadedProducts);
      },
      providesTags: (result, error, arg) => [
        "products",
        ...result.ids.map((id) => ({ type: "Product", id })),
      ],
    }), */
    /* addNewProduct: builder.mutation({
      query: (initialProduct) => ({
        url: "create/",
        method: "POST",
        body: {
          ...initialProduct,
          userId: Number(initialProduct.userId),
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }), */
    /* updateProduct: builder.mutation({
      query: (initialProduct) => ({
        url: "update/<slug:slug>/",
        method: "PUT",
        body: {
          ...initialProduct,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Product", id: arg.id },
      ],
    }), */
    /* deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: "delete/<slug:slug>/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Product", id: arg.id },
      ],
    }), */
  }),
});

export const {
  useGetInventoriesQuery,
  useGetInventoriesByCategoryQuery,
  // useGetProductsByAgentQuery,
  // useAddNewProductMutation,
  // useUpdateProductMutation,
  // useDeleteProductMutation,
} = inventoriesApiSlice;
