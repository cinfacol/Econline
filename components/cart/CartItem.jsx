import Link from "next/link";
import Image from "next/image";
import cloudinaryImageLoader from "@/actions/imageLoader";
import { QuantityControl } from "./QuantityControl";
import { Button, buttonVariants } from "@/components/ui/button";
import { Heart, Trash2, MoveRight, Minus, Plus } from "lucide-react";
import { Currency } from "@/components/ui";

export function CartItem({ item, onQuantityChange, onRemove }) {
  const { inventory } = item;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <Link href={`/product/${inventory.id}`} className="shrink-0">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              loader={cloudinaryImageLoader}
              src={inventory.image[0].image}
              alt={inventory.image[0].alt_text}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-md"
            />
          </div>
        </Link>

        <div className="flex-1 space-y-2">
          <Link
            href={`/product/${inventory.id}`}
            className="text-lg font-medium hover:underline"
          >
            {inventory.product.name}
          </Link>

          <p className="text-sm text-gray-500 line-clamp-2">
            {inventory.product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QuantityControl
                quantity={item.quantity}
                onIncrease={() => onQuantityChange(inventory.id, "inc")}
                onDecrease={() => onQuantityChange(inventory.id, "dec")}
                minQuantity={1}
                maxQuantity={inventory.quantity} // Límite según stock
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Currency
              value={inventory.store_price * item.quantity}
              className="text-lg font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
