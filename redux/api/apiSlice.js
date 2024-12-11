import { logger } from "@/services/logger";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuth, logOut } from "@/redux/features/auth/authSlice";
import { Mutex } from "async-mutex";

const AUTH_ERROR_STATUS = 401;
const REFRESH_TOKEN_ENDPOINT = "/auth/jwt/refresh/";
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  try {
    const isAuthRoute = args?.url?.includes("/auth/");

    // Esperar si hay un refresh en proceso
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
      api.dispatch(logOut());
    }

    // Manejar error de autenticación
    if (result.error?.status === AUTH_ERROR_STATUS && !isAuthRoute) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshResult = await baseQuery(
            {
              url: REFRESH_TOKEN_ENDPOINT,
              method: "POST",
            },
            api,
            extraOptions
          );

          if (refreshResult.data?.status === "success") {
            logger.info("Refresh token exitoso", {}, "API");
            api.dispatch(setAuth());
            // Reintentar petición original
            result = await baseQuery(args, api, extraOptions);
          } else {
            logger.error("Fallo en refresh token", { refreshResult }, "API");
            api.dispatch(logOut());
          }
        } finally {
          release();
        }
      } else {
        // Esperar si hay otro refresh en proceso
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }

    return result;
  } catch (error) {
    logger.error(
      "Error en petición API",
      {
        error: error.message,
        url: args?.url,
        stack: error.stack,
      },
      "API"
    );

    return {
      error: {
        status: error?.status || 500,
        data: { message: error?.message || "Error en la petición" },
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Auth"],
  endpoints: (builder) => ({}),
});
