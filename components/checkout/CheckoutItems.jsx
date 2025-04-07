import { memo } from "react";
import Image from "next/image";
import { Currency } from "@/components/ui";
import cloudinaryImageLoader from "@/actions/imageLoader";

const CheckoutItems = memo(({ items, isProcessing }) => {
  if (!items?.length) {
    return (
      <div className="col-span-7 text-center py-8">
        <p className="text-gray-500">No hay items en el carrito</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="cart-heading" className="lg:col-span-7">
      <h2 id="cart-heading" className="sr-only">
        Items en tu carrito
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <CheckoutItem key={item.id} item={item} disabled={isProcessing} />
        ))}
      </div>
    </section>
  );
});

const CheckoutItem = memo(({ item, disabled }) => {
  return (
    <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {disabled && <div className="absolute inset-0 bg-gray-50/50 z-10" />}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 flex-shrink-0">
          <Image
            loader={cloudinaryImageLoader}
            src={item?.inventory?.image[0].image}
            alt={item?.inventory?.image[0].alt_text}
            width={80}
            height={80}
            className="h-full w-full rounded-md object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">
                {item?.inventory?.product?.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {item?.inventory?.product?.description}
              </p>
            </div>
            <div className="text-right font-medium">
              <Currency value={item?.inventory?.store_price * item?.quantity} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">Cant: {item?.quantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

CheckoutItems.displayName = "CheckoutItems";
CheckoutItem.displayName = "CheckoutItem";

export default CheckoutItems;
