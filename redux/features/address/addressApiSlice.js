import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
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
        is_default,
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
          is_default,
        },
      }),
      transformResponse: (response, meta, arg) => response,

      transformErrorResponse: (response, meta, arg) => response,
      invalidatesTags: ["Address"],
      extraOptions: { maxRetries: 0 },
    }),
    getAddressDetails: builder.query({
      query: (addressId) => ({
        url: `/auth/address/${addressId}/`,
      }),
      providesTags: ["Address"],
    }),
    editAddress: builder.mutation({
      query: ({ id, newAddress }) => ({
        url: `/auth/address/edit/${id}/`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAddress),
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response,
      invalidatesTags: ["Address"],
      extraOptions: { maxRetries: 0 },
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/auth/address/delete/${addressId}/`,
        method: "DELETE",
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response,
      invalidatesTags: ["Address"],
      extraOptions: { maxRetries: 0 },
    }),
    setDefaultAddress: builder.mutation({
      query: ({ addressId }) => ({
        url: `/auth/address/default/${addressId}/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response, meta, arg) => response,
      transformErrorResponse: (response, meta, arg) => response,
      invalidatesTags: ["Address"],
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const {
  useGetAddressQuery,
  useAddAddressMutation,
  useEditAddressMutation,
  useGetAddressDetailsQuery,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApiSlice;
