"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { Spinner } from "@/components/common";
import { toast } from "sonner";

export default function RequireAdmin({ children }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isGuest } = useAppSelector(
    (state) => state.auth
  );
  const { data: user, isLoading: userLoading } = useRetrieveUserQuery(
    undefined,
    {
      skip: !isAuthenticated || isGuest,
    }
  );

  const isAdmin = user?.is_admin || false;
  const totalLoading = isLoading || userLoading;

  useEffect(() => {
    if (!totalLoading && !isAuthenticated) {
      toast.error("Necesitas iniciar sesión para acceder a esta página");
      router.push("/auth/login");
    } else if (!totalLoading && isAuthenticated && !isAdmin) {
      toast.error(
        "No tienes permisos de administrador para acceder a esta página"
      );
      router.push("/");
    }
  }, [totalLoading, isAuthenticated, isAdmin, router]);

  if (totalLoading) {
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
