import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
        <ShoppingCart className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Tu carrito está vacío
      </h2>
      <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
        Parece que aún no has agregado productos a tu carrito.
      </p>
      <Link href="/products" className="mt-6">
        <Button variant="warning" className="flex items-center gap-2">
          Explorar productos
        </Button>
      </Link>
    </div>
  );
}
