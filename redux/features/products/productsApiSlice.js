import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "@/redux/api/apiSlice";

const productsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = productsAdapter.getInitialState();

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products/all/",
      transformResponse: (responseData) => {
        let min = 1;
        const loadedProducts = responseData.results.map((product) => {
          if (!product?.date)
            product.date = sub(new Date(), { minutes: min++ }).toISOString();
          return product;
        });
        return productsAdapter.setAll(initialState, loadedProducts);
      },
      /* providesTags: (result, error, arg) => [
        "products",
        ...result?.ids.map((id) => ({ id })),
      ], */
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
  useGetProductsQuery,
  // useGetProductsByAgentQuery,
  // useAddNewProductMutation,
  // useUpdateProductMutation,
  // useDeleteProductMutation,
} = productsApiSlice;
