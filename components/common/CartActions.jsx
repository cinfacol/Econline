"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetItemsQuery } from "@/redux/features/cart/cartApiSlice";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common";

export default function CartActions() {
  const { data: itemsData, isLoading, error } = useGetItemsQuery();

  const router = useRouter();

  if (isLoading) return <Spinner />;

  return (
    <div className="relative flex">
      <Button
        className="text-gray-400 hover:text-gray-500 cursor-pointer"
        onClick={() => {
          router.push("/cart");
        }}
        variant="outline"
        size="lg"
      >
        <span className="sr-only">items in cart, view bag</span>
        <ShoppingCart className="h-6 w-6" aria-hidden="true" />
        <span className="absolute top-2 right-0 inline-flex items-center justify-center px-2 py-1 mr-3 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full">
          {itemsData?.ids?.length || 0}
        </span>
      </Button>
    </div>
  );
}
