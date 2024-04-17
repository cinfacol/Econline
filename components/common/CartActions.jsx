"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useGetItemsQuery } from "@/redux/features/cart/cartApiSlice";
import { Button } from "@/components/ui/button";
import CreateCart from "@/components/CreateCart";

export default function CartActions() {
  const Items = useGetItemsQuery();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const cart = CreateCart();

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex">
      <Button
        onClick={() => {
          isAuthenticated ? router.push("/cart") : router.push("/auth/login");
        }}
        className="p-2 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">items in cart, view bag</span>
        <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
        <span className="ml-1 text-sm font-medium text-gray-400">
          {Items?.data?.ids?.length ?? 0}
        </span>
      </Button>
    </div>
  );
}
