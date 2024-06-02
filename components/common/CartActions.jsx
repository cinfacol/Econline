"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useGetItemsQuery } from "@/redux/features/cart/cartApiSlice";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common";

export default function CartActions() {
  const { data: itemsData, isLoading, error } = useGetItemsQuery();

  const router = useRouter();

  if (isLoading) return <Spinner />;

  return (
    <div className="flex">
      <Button
        onClick={() => {
          router.push("/cart");
        }}
        className="text-gray-400 hover:text-gray-500"
        variant="destructive"
      >
        <span className="sr-only">items in cart, view bag</span>
        <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
        <span className="ml-1 text-sm font-medium text-gray-400">
          {itemsData?.ids?.length || 0}
        </span>
      </Button>
    </div>
  );
}
