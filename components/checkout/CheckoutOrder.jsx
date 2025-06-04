const CheckoutOrder = ({ items, shipping, coupon, onPaymentSubmit, isProcessing }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.inventory.store_price * item.quantity), 0);

  const total = subtotal + shipping.cost - (coupon.applied ? coupon.discount : 0);

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
          <dd className="text-sm font-medium text-gray-900">${shipping.cost.toFixed(2)}</dd>
        </div>

        {coupon.applied && (
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Descuento</dt>
            <dd className="text-sm font-medium text-green-600">
              -${coupon.discount.toFixed(2)}
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