import { createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "@/redux/api/apiSlice";

const reviewsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = reviewsAdapter.getInitialState();

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviewsByProductId: builder.query({
      query: (productId) => ({ url: `/reviews/get-reviews/${productId}` }),
      /* transformResponse: (responseData) => {
        let min = 1;
        const loadedReviews = responseData?.results?.map((review) => {
          if (!review?.date)
            review.date = sub(new Date(), { minutes: min++ }).toISOString();
          return review;
        });
        return reviewsAdapter.setAll(initialState, loadedReviews);
      }, */
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (response, meta, arg) => response.status,
      /* providesTags: (result, error, productId) => [
        { type: "Review", productId },
      ], */
      // The 2nd parameter is the destructured `QueryLifecycleApi`
      async onQueryStarted(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          queryFulfilled,
          getCacheEntry,
          updateCachedData,
        }
      ) {},
      // The 2nd parameter is the destructured `QueryCacheLifecycleApi`
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
          updateCachedData,
        }
      ) {},
      /* providesTags: (result, error, arg) => [
        "reviews",
        ...result?.ids.map((id) => ({ id })),
      ], */
    }),
    getReviewsByAgent: builder.query({
      query: () => "agents/",
      transformResponse: (responseData) => {
        let min = 1;
        const loadedReviews = responseData.map((review) => {
          if (!review?.date)
            review.date = sub(new Date(), { minutes: min++ }).toISOString();
          return review;
        });
        return reviewsAdapter.setAll(initialState, loadedReviews);
      },
      providesTags: (result, error, arg) => [
        "reviews",
        ...result.ids.map((id) => ({ type: "Review", id })),
      ],
    }),
    addNewReview: builder.mutation({
      query: (initialReview) => ({
        url: "create/",
        method: "POST",
        body: {
          ...initialReview,
          userId: Number(initialReview.userId),
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
    updateReview: builder.mutation({
      query: (initialReview) => ({
        url: "update-review/<productId>/",
        method: "PUT",
        body: {
          ...initialReview,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Review", id: arg.id }],
    }),
    deleteReview: builder.mutation({
      query: ({ id }) => ({
        url: "delete-review/<productId>/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Review", id: arg.id }],
    }),
  }),
});

export const {
  useGetReviewsByProductIdQuery,
  useGetReviewsByAgentQuery,
  useAddNewReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApiSlice;
