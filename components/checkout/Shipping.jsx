// components/checkout/Shipping.jsx
import { useCallback } from 'react';
import { useGetPaymentTotalQuery } from '@/redux/features/payment/paymentApiSlice';
import { useCalculateShippingMutation } from '@/redux/features/cart/cartApiSlice';
import { toast } from 'sonner';

const Shipping = ({ shippingOptions, onShippingChange, shippingState }) => {
  const { data } = useGetPaymentTotalQuery();
  const [calculateShipping] = useCalculateShippingMutation();

  const handleShippingSelection = useCallback(async (option) => {
    try {
      const response = await calculateShipping({
        shipping_id: option.id,
        order_total: data?.sub_total || 0,
      }).unwrap();

      const newShippingCost = response.is_free_shipping ? 0 : response.shipping_cost;

      onShippingChange(option.id, newShippingCost);

      if (response.is_free_shipping) {
        toast.success("¡Felicidades! Tu pedido califica para envío gratuito");
      }
    } catch (error) {
      toast.error(error.data?.detail || "Error al calcular el envío");
      onShippingChange(option.id, option.standard_shipping_cost);
    }
  }, [calculateShipping, data?.sub_total, onShippingChange]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900">Método de envío</h3>
      <div className="mt-4 space-y-4">
        {shippingOptions.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="radio"
              name="shipping"
              value={option.id}
              checked={option.id === shippingState.id}
              onChange={() => handleShippingSelection(option)}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              {option.name} - ${option.standard_shipping_cost}
            </label>
          </div>
        ))}
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