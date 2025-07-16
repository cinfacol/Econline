import React from "react";
import Image from "next/image";
import cloudinaryImageLoader from "@/actions/imageLoader";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  SHIPPED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-green-200 text-green-900",
  CANCELLED: "bg-red-100 text-red-800",
};

const OrderCard = ({ order }) => {
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 shadow-md p-6 mb-8">
      {/* Resumen de la orden */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
          >
            {order.status}
          </span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Orden #{order.transaction_id}</h2>
          <div className="text-sm text-gray-500 dark:text-gray-300">
            {new Date(order.created_at).toLocaleString()}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-right min-w-[120px]">
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            Total: <span className="text-primary">${order.amount}</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Envío: {order.shipping_price !== null ? `$${order.shipping_price}` : "-"}
          </span>
        </div>
      </div>
      {/* Dirección */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        <span className="font-medium">Dirección:</span> {order.address_line_1}
        {order.address_line_2 ? `, ${order.address_line_2}` : ""}
      </div>
      {/* Artículos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Nombre</th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cantidad</th>
              <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Precio</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {order.order_items.map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-2">
                  {item.image && typeof item.image === "string" ? (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden border bg-gray-50 dark:bg-gray-800">
                      <Image
                        loader={cloudinaryImageLoader}
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                <td className="px-2 py-2 text-center text-sm text-gray-700 dark:text-gray-300">{item.count}</td>
                <td className="px-2 py-2 text-right text-sm text-gray-900 dark:text-white">${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderCard; 