// components/checkout/Shipping.jsx
import { useCallback, useEffect } from 'react';
import { useCalculateShippingMutation } from '@/redux/features/shipping/shippingApiSlice';
import { toast } from 'sonner';

const Shipping = ({ shippingOptions, onShippingChange, shippingState, cartTotal = 0 }) => {
  const [calculateShipping] = useCalculateShippingMutation();

  const handleShippingSelection = useCallback(async (option) => {
    try {
      const response = await calculateShipping({
        shipping_id: option.id,
        order_total: cartTotal,
      }).unwrap();

      const newShippingCost = response.is_free_shipping ? 0 : response.shipping_cost;

      onShippingChange(option.id, newShippingCost);

    } catch (error) {
      toast.error(error.data?.detail || "Error al calcular el envío");
      // En caso de error, usar el costo estándar
      const standardCost = parseFloat(option.standard_shipping_cost);
      const isFree = cartTotal >= parseFloat(option.free_shipping_threshold);
      const finalCost = isFree ? 0 : standardCost;
      onShippingChange(option.id, finalCost);
    }
  }, [calculateShipping, cartTotal, onShippingChange]);

  // Encontrar la opción de envío por defecto
  const defaultShippingOption = shippingOptions.find(option => option.is_default === true);

  // Seleccionar automáticamente la opción por defecto cuando se carga el componente
  // o cuando cambia el total de la orden
  useEffect(() => {
    if (defaultShippingOption && cartTotal !== undefined && !shippingState.id) {
      handleShippingSelection(defaultShippingOption);
    }
  }, [defaultShippingOption, cartTotal, shippingState.id, handleShippingSelection]);

  // Recalcular cuando cambia el cartTotal y ya hay una selección
  useEffect(() => {
    if (defaultShippingOption && cartTotal !== undefined && shippingState.id === defaultShippingOption.id) {
      handleShippingSelection(defaultShippingOption);
    }
  }, [cartTotal, defaultShippingOption, shippingState.id, handleShippingSelection]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900">Detalle de envío</h3>
      <div className="mt-4">
        {defaultShippingOption ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{defaultShippingOption.name}</h4>
                <p className="text-sm text-gray-600">Entrega estimada: {defaultShippingOption.estimated_delivery_days}</p>
              </div>
              <div className="text-right">
                {cartTotal >= parseFloat(defaultShippingOption.free_shipping_threshold) ? (
                  <span className="text-lg font-semibold text-green-600">GRATIS</span>
                ) : (
                  <span className="text-lg font-semibold text-gray-900">
                    ${defaultShippingOption.standard_shipping_cost}
                  </span>
                )}
              </div>
            </div>
            
            {cartTotal > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                {cartTotal >= parseFloat(defaultShippingOption.free_shipping_threshold) ? (
                  <p className="text-sm text-green-600 font-medium">
                    ¡Tu pedido califica para envío gratuito!
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Agrega ${(parseFloat(defaultShippingOption.free_shipping_threshold) - cartTotal).toFixed(2)} más para envío gratuito
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No hay opciones de envío disponibles</p>
        )}
      </div>
      {shippingState.error && (
        <p className="mt-2 text-sm text-red-600">{shippingState.error}</p>
      )}
      {shippingState.isCalculating && (
        <p className="mt-2 text-sm text-gray-500">Calculando envío...</p>
      )}
    </div>
  );
};

export default Shipping;