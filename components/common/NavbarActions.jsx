"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetItemsQuery } from "@/redux/features/cart/cartApiSlice";
import { Button } from "@/components/ui/button";
import CreateCart from "@/components/CreateCart";

export default function NavbarActions() {
  const Items = useGetItemsQuery("getItems");
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
    <div className="ml-auto flex items-center gap-x-4">
      <Button
        onClick={() => router.push("/cart")}
        className="flex items-center rounded-full bg-gray-800 px-4 py-2"
      >
        <ShoppingCart size={24} />
        <span className="ml-2 text-sm font-medium ">
          {Items?.data?.ids?.length ?? 0}
        </span>
      </Button>
    </div>
  );
}
