"use client";

import { useState, useCallback } from "react";
import Shipping from "./Shipping";

export default function ShippingSelector({ shippingOptions }) {
  const [shippingState, setShippingState] = useState({
    id: "",
    cost: 0,
    isCalculating: false,
    error: null,
  });

  const handleShippingChange = useCallback((shippingId, shippingCost) => {
    setShippingState({
      id: shippingId,
      cost: shippingCost,
      isCalculating: false,
      error: null,
    });
  }, []);

  return (
    <>
      <Shipping
        shippingOptions={shippingOptions}
        onShippingChange={handleShippingChange}
        shippingState={shippingState}
      />
      {shippingState.id && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="text-gray-700">
            <strong>Método seleccionado:</strong> {shippingOptions.find(opt => opt.id === shippingState.id)?.name}
          </p>
          <p className="text-gray-700">
            <strong>Costo de envío:</strong> ${shippingState.cost}
          </p>
        </div>
      )}
    </>
  );
} 