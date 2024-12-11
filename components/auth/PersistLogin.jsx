"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/features/auth/authSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { toast } from "sonner";
import { logger } from "@/services/logger";

export default function PersistLogin({ children }) {
  const dispatch = useAppDispatch();

  const {
    data: user,
    isLoading,
    error,
    isError,
  } = useRetrieveUserQuery(undefined, {
    // Solo intentamos obtener el usuario una vez al montar el componente
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (user) {
      logger.debug(
        "Usuario recuperado exitosamente",
        { userId: user.id },
        "PersistLogin"
      );
      dispatch(setAuth());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (isError) {
      const errorMetadata = {
        error: {
          status: error?.status,
          message: error?.message,
          data: error?.data,
          isAuthError: error?.isAuthError,
        },
        component: "PersistLogin",
        action: "retrieveUser",
        timestamp: new Date().toISOString(),
      };

      if (error?.status === 401) {
        logger.info("Sesión no válida", errorMetadata, "PersistLogin");
        // Opcionalmente mostrar un mensaje amigable
        toast.info("Por favor, inicia sesión para continuar");
      } else {
        logger.error(
          "Error al persistir la sesión del usuario",
          errorMetadata,
          "PersistLogin"
        );

        toast.error(
          error?.message || "Error al recuperar la información del usuario"
        );
      }
    }
  }, [isError, error]);

  if (isLoading) {
    logger.debug("Cargando información del usuario", {}, "PersistLogin");
    return null; // O un componente de loading
  }

  return children;
}
