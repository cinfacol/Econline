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
        // console.log("response_data", responseData.results);
        let min = 1;
        const loadedProducts = responseData.results.map((product) => {
          if (!product?.date)
            product.date = sub(new Date(), { minutes: min++ }).toISOString();
          return product;
        });
        return productsAdapter.setAll(initialState, loadedProducts);
      },
      providesTags: (result, error, arg) => [
        "products",
        ...result?.ids.map((id) => ({ id })),
      ],
    }),
  }),
});

export const { useGetProductsQuery } = productsApiSlice;
