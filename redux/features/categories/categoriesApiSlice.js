import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiAppSlice } from "@/redux/api/apiAppSlice";

const categoriesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = categoriesAdapter.getInitialState();

export const categoriesApiSlice = apiAppSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/categories/all/",
      transformResponse: (responseData) => {
        // Manejar la respuesta del API
        const loadedItems = responseData.results ?? [];

        // Agregar fechas si no existen
        loadedItems.forEach((item, idx) => {
          if (!item.date) {
            item.date = sub(new Date(), { minutes: idx + 1 }).toISOString();
          }
        });

        // Devolver el estado actualizado
        return categoriesAdapter.setAll(initialState, loadedItems);
      },
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApiSlice;
