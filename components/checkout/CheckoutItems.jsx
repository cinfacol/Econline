import Image from "next/image";
import cloudinaryImageLoader from "@/actions/imageLoader";
import { Currency } from "@/components/ui";

const CheckoutItems = ({ items, isProcessing }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Productos en tu carrito</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <Image
                loader={cloudinaryImageLoader}
                src={item.inventory.image[0].image}
                alt={item.inventory.image[0].alt_text}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
              <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
              <span className="text-sm text-gray-500">Precio unitario: <Currency value={item.inventory.store_price} /></span>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-sm font-medium text-gray-900">
                <Currency value={item.inventory.store_price * item.quantity} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutItems;