import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
// import { apiAppSlice } from "@/redux/api/apiAppSlice";
import { apiSlice } from "@/redux/api/apiSlice";

const addressAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = addressAdapter.getInitialState();

export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddress: builder.query({
      query: () => ({
        url: "/auth/address/",
      }),
      providesTags: ["Address"],
      transformResponse: (responseData) => {
        const loadedItems = responseData ?? [];

        loadedItems.forEach((item, idx) => {
          if (!item.date) {
            item.date = sub(new Date(), { minutes: idx + 1 }).toISOString();
          }
        });

        return addressAdapter.setAll(initialState, loadedItems);
      },
    }),
    addAddress: builder.mutation({
      query: ({
        user,
        address_line_1,
        address_line_2,
        country_region,
        city,
        state_province_region,
        postal_zip_code,
        phone_number,
      }) => ({
        url: "/auth/address/create/",
        method: "POST",
        body: {
          user,
          address_line_1,
          address_line_2,
          country_region,
          city,
          state_province_region,
          postal_zip_code,
          phone_number,
        },
      }),
      transformResponse: (response, meta, arg) => response.data,

      transformErrorResponse: (response, meta, arg) => response.data,
      invalidatesTags: ["Address"],
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const { useGetAddressQuery, useAddAddressMutation } = addressApiSlice;
