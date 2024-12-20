"use client";

import { Toaster } from "sonner";
import { useVerify } from "@/hooks";

export default function Setup() {
  useVerify();

  return <Toaster />;
}
