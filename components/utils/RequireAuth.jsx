"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "@/components/common";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Si no está cargando y no está autenticado, redirigir
    if (!isLoading && !isAuthenticated) {
      // Guardamos la URL actual para redirigir después del login
      const currentPath = window.location.pathname;
      if (currentPath !== "/auth/login") {
        sessionStorage.setItem("returnUrl", currentPath);
      }
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Mostrar spinner mientras carga
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner lg />
      </div>
    );
  }

  // Verificación adicional de autenticación
  if (!isAuthenticated) {
    return null; // Evita mostrar contenido mientras se realiza la redirección
  }

  // Verificación opcional de perfil completo
  if (user && !user.isProfileComplete) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Por favor completa tu perfil para acceder a todas las
              funcionalidades.
              <button
                onClick={() => router.push("/profile/edit")}
                className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
              >
                Completar perfil
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Todo está bien, mostrar el contenido protegido
  return <>{children}</>;
}
