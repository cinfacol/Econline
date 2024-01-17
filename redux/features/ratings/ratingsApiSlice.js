import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "@/redux/api/apiSlice";

const ratingsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = ratingsAdapter.getInitialState();

export const ratingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRatings: builder.query({
      query: ({ productId }) => `/get_ratings/${productId}`,
      transformResponse: (responseData) => {
        let min = 1;
        const loadedRatings = responseData.results.map((rating) => {
          if (!rating?.date)
            rating.date = sub(new Date(), { minutes: min++ }).toISOString();
          return rating;
        });
        return ratingsAdapter.setAll(initialState, loadedRatings);
      },
      providesTags: (result, error, arg) => [
        "ratings",
        ...result?.ids.map((id) => ({ id })),
      ],
    }),
    getRatingsByAgent: builder.query({
      query: () => "agents/",
      transformResponse: (responseData) => {
        let min = 1;
        const loadedRatings = responseData.map((rating) => {
          if (!rating?.date)
            rating.date = sub(new Date(), { minutes: min++ }).toISOString();
          return rating;
        });
        return ratingsAdapter.setAll(initialState, loadedRatings);
      },
      providesTags: (result, error, arg) => [
        "ratings",
        ...result.ids.map((id) => ({ type: "Rating", id })),
      ],
    }),
    addNewRating: builder.mutation({
      query: (initialRating) => ({
        url: "create/",
        method: "POST",
        body: {
          ...initialRating,
          userId: Number(initialRating.userId),
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: "Rating", id: "LIST" }],
    }),
    updateRating: builder.mutation({
      query: (initialRating) => ({
        url: "update-rating/<productId:productId>/",
        method: "PUT",
        body: {
          ...initialRating,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Rating", id: arg.id }],
    }),
    deleteRating: builder.mutation({
      query: ({ id }) => ({
        url: "delete-rating/<productId:productId>/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Rating", id: arg.id }],
    }),
  }),
});

export const {
  useGetRatingsQuery,
  useGetRatingsByAgentQuery,
  useAddNewRatingMutation,
  useUpdateRatingMutation,
  useDeleteRatingMutation,
} = ratingsApiSlice;
