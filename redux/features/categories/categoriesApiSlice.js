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
      transformResponse: (responseData) => {
        // Manejar la respuesta del API
        const loadedItems = responseData.categories ?? [];
        // Agregar fechas si no existen
        loadedItems.forEach((item, idx) => {
          if (!item.date) {
            item.date = sub(new Date(), { minutes: idx + 1 }).toISOString();
          }
        });

        // Devolver el estado actualizado
        return categoriesAdapter.setAll(initialState, loadedItems);
      },
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/categories/create/",
        method: "POST",
        body: categoryData,
      }),
      transformResponse: (response) => {
        if (response.category && !response.category.date) {
          response.category.date = new Date().toISOString();
        }
        return response;
      },
      invalidatesTags: ["Categories"],
    }),
    getMeasureUnits: builder.query({
      query: () => "/categories/measure-units/",
      transformResponse: (responseData) => {
        return responseData.measure_units ?? [];
      },
      providesTags: ["MeasureUnits"],
    }),
    createMeasureUnit: builder.mutation({
      query: (measureUnitData) => ({
        url: "/categories/measure-units/create/",
        method: "POST",
        body: measureUnitData,
      }),
      transformResponse: (response) => {
        return response;
      },
      invalidatesTags: ["MeasureUnits"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetMeasureUnitsQuery,
  useCreateMeasureUnitMutation,
} = categoriesApiSlice;
