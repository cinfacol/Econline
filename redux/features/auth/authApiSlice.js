import { apiSlice } from "@/redux/api/apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUser: builder.query({
      query: () => "/auth/users/me/",
      providesTags: ["User"],
    }),
    socialAuthenticate: builder.mutation({
      query: ({ provider, state, code }) => ({
        url: `/auth/o/${provider}/?state=${encodeURIComponent(
          state
        )}&code=${encodeURIComponent(code)}`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/jwt/create/",
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation({
      query: ({
        username,
        first_name,
        last_name,
        email,
        password,
        re_password,
      }) => ({
        url: "/auth/users/",
        method: "POST",
        body: { username, first_name, last_name, email, password, re_password },
      }),
    }),
    verify: builder.mutation({
      query: () => ({
        url: "/auth/jwt/verify/",
        method: "POST",
      }),
      transformResponse: (response) => {
        if (response.is_guest) {
          return { isGuest: true };
        }
        return { isAuthenticated: true };
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    activation: builder.mutation({
      query: ({ uid, token }) => ({
        url: "/auth/users/activation/",
        method: "POST",
        body: { uid, token },
      }),
    }),
    resetPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/users/reset_password/",
        method: "POST",
        body: { email },
      }),
    }),
    resetPasswordConfirm: builder.mutation({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: "/auth/users/reset_password_confirm/",
        method: "POST",
        body: { uid, token, new_password, re_new_password },
      }),
    }),
    getProfile: builder.query({
      query: () => "/profile/me/",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: ({ username, data }) => ({
        url: `/profile/update/${username}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRetrieveUserQuery,
  useSocialAuthenticateMutation,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useActivationMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApiSlice;
