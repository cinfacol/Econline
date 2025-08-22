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
    setSelectedCategories: builder.mutation({
      queryFn: async (ids) => {
        // Guarda los IDs en localStorage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "selectedCategoryIds",
            JSON.stringify(ids)
          );
        }
        return { data: ids };
      },
    }),
    getSelectedCategories: builder.query({
      queryFn: () => {
        let ids = [];
        if (typeof window !== "undefined") {
          const stored = window.localStorage.getItem("selectedCategoryIds");
          if (stored) {
            try {
              ids = JSON.parse(stored);
            } catch {
              ids = [];
            }
          }
        }
        return { data: ids };
      },
      // El cacheKey será el mismo que la mutation
      async onCacheEntryAdded(arg, { cacheDataLoaded, getCacheEntry }) {
        await cacheDataLoaded;
        // No hace nada, solo asegura que el cache esté disponible
      },
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
  useSetSelectedCategoriesMutation,
  useGetSelectedCategoriesQuery,
} = categoriesApiSlice;
