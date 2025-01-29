"use client";

import { HeroUIProvider } from "@heroui/react";

export function HerouiProviders({ children }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
