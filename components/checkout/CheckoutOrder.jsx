import { useGetPaymentTotalQuery } from '@/redux/features/payment/paymentApiSlice';
import { Currency } from '@/components/ui';

const CheckoutOrder = ({ shipping_id, coupon_id, onPaymentSubmit, isProcessing }) => {
  const { data: paymentTotal, isLoading, error } = useGetPaymentTotalQuery(
    { 
      shipping_id,
      coupon_id
    }, 
    {
      skip: !shipping_id,
    }
  );

  // Valores por defecto en caso de que no haya datos
  const subtotal = paymentTotal?.subtotal || 0;
  const shippingCost = paymentTotal?.shipping_cost || 0;
  const discount = paymentTotal?.discount || 0;
  const total = paymentTotal?.total_amount || 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h3>
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h3>
        <p className="text-red-600">Error al cargar el resumen del pedido</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h3>
      <dl className="space-y-4">
        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-sm text-gray-600">Envío</dt>
          <dd className="text-sm font-medium text-gray-900">${shippingCost.toFixed(2)}</dd>
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Descuento</dt>
            <dd className="text-sm font-medium text-green-600">
              -${discount.toFixed(2)}
            </dd>
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <dt className="text-base font-medium text-gray-900">Total</dt>
            <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
          </div>
        </div>
      </dl>

      <button
        onClick={onPaymentSubmit}
        disabled={isProcessing}
        className={`mt-6 w-full rounded-md border border-transparent py-3 px-4 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
        }`}
      >
        {isProcessing ? 'Procesando...' : 'Pagar ahora'}
      </button>
    </div>
  );
};

export default CheckoutOrder;