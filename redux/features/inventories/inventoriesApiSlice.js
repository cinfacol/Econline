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
      query: ({ searchTerm, categorySlug }) => {
        const baseUrl = "/inventory/";
        let url = searchTerm ? `${baseUrl}search/?query=${searchTerm}` : "";
        url = categorySlug ? `${baseUrl}category/${categorySlug}` : url;
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
      // Re-enable `providesTags` for potential caching benefits (uncomment if needed)
      /* providesTags: (result, error, arg) => [
            "products",
            ...result?.ids.map((id) => ({ type: 'Inventory', id })),
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
