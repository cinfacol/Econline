"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "@/components/common";
import { toast } from "sonner";

export default function RequireAdmin({ children }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isAdmin } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Necesitas iniciar sesión para acceder a esta página");
      router.push("/auth/login");
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      toast.error(
        "No tienes permisos de administrador para acceder a esta página"
      );
      router.push("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    );
  }

  return <>{children}</>;
}
