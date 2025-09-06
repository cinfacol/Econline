"use client";

import { useAppSelector } from "@/redux/hooks";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminBadge({ className = "" }) {
  const { isAuthenticated, isAdmin } = useAppSelector((state) => state.auth);

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
