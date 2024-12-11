import { logger } from "@/services/logger";
import { apiSlice } from "@/redux/api/apiSlice";
import { setAuth, setUser, logOut } from "@/redux/features/auth/authSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUser: builder.query({
      query: () => ({
        url: "/auth/users/me/",
        method: "GET",
        credentials: "include", // Importante para manejar cookies
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setAuth());

          logger.debug(
            "Usuario recuperado exitosamente",
            { userId: data?.id },
            "AuthAPI"
          );
        } catch (error) {
          // Extraer información relevante del error
          const errorInfo = {
            status: error?.error?.status || error?.status,
            data: error?.error?.data || error?.data,
            message:
              error?.error?.data?.detail ||
              error?.error?.data?.message ||
              error?.message ||
              "Error desconocido",
            code: error?.error?.status || "UNKNOWN",
          };

          // Si es un error 401, lo manejamos como un caso normal de sesión expirada
          if (errorInfo.status === 401) {
            logger.info(
              "Sesión no válida o expirada",
              {
                reason: "session_expired",
                timestamp: new Date().toISOString(),
              },
              "AuthAPI"
            );

            dispatch(logOut());

            // Opcionalmente, redirigir al login si es necesario
            // router.push('/auth/login');

            return; // Salimos temprano para no registrar como error
          }

          // Solo loggeamos como error si no es un 401
          logger.error(
            `Error al recuperar información del usuario: ${errorInfo.message}`,
            {
              error: errorInfo,
              request: {
                endpoint: "/auth/users/me/",
                method: "GET",
              },
              context: {
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
              },
            },
            "AuthAPI"
          );
        }
      },

      transformResponse: (response) => {
        logger.debug("Transformando respuesta del usuario", { response });

        return {
          id: response.id,
          email: response.email,
          username: response.username,
          first_name: response.first_name,
          last_name: response.last_name,
          full_name: `${response.first_name} ${response.last_name}`.trim(),
          profile_photo: response.profile_photo,
          is_active: response.is_active,
          is_staff: response.is_staff,
          isProfileComplete: Boolean(
            response.first_name && response.last_name && response.email
          ),
        };
      },

      transformErrorResponse: (response) => {
        // Para errores 401, transformamos a un formato más amigable
        if (response.status === 401) {
          return {
            status: 401,
            data: response.data,
            message: "Sesión expirada o no válida",
            isAuthError: true,
          };
        }

        return {
          status: response.status,
          data: response.data,
          message:
            response.data?.detail ||
            response.data?.message ||
            "Error desconocido",
          timestamp: new Date().toISOString(),
        };
      },
      // Configuración de caché y revalidación
      keepUnusedDataFor: 300, // 5 minutos
      refetchOnMountOrArgChange: true,

      // Revalidar al volver a tener conexión
      refetchOnReconnect: true,
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
      query: (credentials) => ({
        url: "/auth/jwt/create/",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      invalidatesTags: ["User"],

      transformResponse: (response, meta) => {
        logger.debug("Login response received", { response, meta });

        if (response.status === "success" || response.tokens) {
          return {
            status: "success",
            message: response.message || "Login exitoso",
            user: response.debug?.user || null,
            tokens: response.tokens || null,
          };
        }
        return response;
      },

      transformErrorResponse: (response) => {
        logger.debug("Login error response", { response });

        return {
          status: response.status,
          message:
            response.data?.detail ||
            response.data?.message ||
            "Error en el inicio de sesión",
          originalError: response,
        };
      },

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          logger.debug("Iniciando login", { email: arg.email });

          const { data } = await queryFulfilled;

          if (data.status === "success" || data.tokens) {
            dispatch(setAuth());
            if (data.user) {
              dispatch(setUser(data.user));
            }
            logger.info("Login exitoso", {
              email: arg.email,
              hasUserData: !!data.user,
            });
          }
        } catch (error) {
          logger.error("Error en proceso de login", {
            error,
            requestData: {
              email: arg?.email,
              errorType: error?.name,
              errorStatus: error?.status,
              errorMessage: error?.message,
              errorData: error?.data,
            },
          });

          dispatch(logOut());
        }
      },
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
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
        } catch (error) {
          logger.error("Error en proceso de logout", error);
        }
      },
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
} = authApiSlice;
