"use client";

import { useGetShippingOptionsQuery } from "@/redux/features/shipping/shippingApiSlice";
import { Currency } from "@/components/ui";

export default function Shipping() {
  const { data, isLoading, error } = useGetShippingOptionsQuery();
  const shippingOptions = data?.entities ? Object.values(data.entities) : [];

  if (isLoading) return <p>Cargando métodos de envío...</p>;
  if (error) return <p>Error al cargar métodos de envío.</p>;
  if (!shippingOptions.length) return <p>No hay métodos de envío disponibles.</p>;

  // El método por defecto es el de menor costo
  const defaultShipping = [...shippingOptions].sort((a, b) => parseFloat(a.standard_shipping_cost) - parseFloat(b.standard_shipping_cost))[0];
  const otherShippings = shippingOptions.filter(opt => opt.id !== defaultShipping.id);

  return (
    <div>
      <div className="p-6 mb-6 bg-indigo-50 border border-indigo-200 rounded-lg shadow">
        <h3 className="text-lg font-bold text-indigo-800 mb-2">Información de envío aplicado a tu orden</h3>
        <div className="text-gray-800">
          <p><strong>{defaultShipping.name}</strong></p>
          <p>
            Costo: 
            <span className="font-semibold">
            <Currency value={defaultShipping.standard_shipping_cost} />
            </span>
          </p>
          <p>Entrega estimada: {defaultShipping.estimated_delivery_days}</p>
          <p className="mt-2 text-sm text-indigo-700">Este método se aplicará automáticamente a tu orden.</p>
        </div>
        <div className="mt-4 text-sm text-gray-700">
          {parseFloat(defaultShipping.free_shipping_threshold) > 0 && (
            <>
              <span>Envío gratis en compras desde </span>
              <span className="font-semibold">
                <Currency value={defaultShipping.free_shipping_threshold} />
              </span>
            </>
          )}
        </div>
      </div>

      {otherShippings.length > 0 && (
        <div className="mt-8">
          <h4 className="text-md font-semibold mb-2 text-gray-700">Otros métodos de envío disponibles:</h4>
          <ul className="space-y-2">
            {otherShippings.map(opt => (
              <li key={opt.id} className="p-4 bg-gray-50 border border-gray-200 rounded">
                <div className="font-medium">{opt.name}</div>
                <div>Costo: ${opt.standard_shipping_cost}</div>
                <div>Entrega estimada: {opt.estimated_delivery_days}</div>
                {parseFloat(opt.free_shipping_threshold) > 0 && (
                  <div className="text-xs text-gray-500">Envío gratis desde ${opt.free_shipping_threshold}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 