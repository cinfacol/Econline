import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "@/redux/api/apiSlice";

const categoriesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = categoriesAdapter.getInitialState();

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories/all/",
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApiSlice;
