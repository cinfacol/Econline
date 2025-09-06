"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminBadge({ className = "" }) {
  const { isAuthenticated, isGuest } = useAppSelector((state) => state.auth);
  const { data: user } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated || isGuest,
  });

  const isAdmin = user?.is_admin || false;

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Badge
      variant="secondary"
      className={`bg-blue-100 text-blue-800 ${className}`}
    >
      <ShieldCheck className="w-3 h-3 mr-1" />
      Admin
    </Badge>
  );
}
