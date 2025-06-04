import { useCallback, useState, useEffect } from 'react';
import { useCheckCouponQuery } from '@/redux/features/cart/cartApiSlice';
import { toast } from 'sonner';

const Coupon = ({ onCouponChange, couponState, cartTotal }) => {
  const [couponCode, setCouponCode] = useState('');
  const [skip, setSkip] = useState(true);

  const { data: couponData, error } = useCheckCouponQuery(
    { code: couponCode, cart_total: cartTotal },
    { skip }
  );

  const handleCouponSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!couponCode) {
      toast.error("Por favor ingrese un código de cupón");
      return;
    }

    setSkip(false);
  }, [couponCode]);

  // Efecto para manejar la respuesta del cupón
  useEffect(() => {
    if (couponData) {
      if (!couponData.is_valid) {
        toast.error(couponData.error || "Cupón inválido");
        return;
      }

      onCouponChange({
        code: couponCode,
        applied: true,
        discount: couponData.discount,
        coupon: couponData.coupon
      });

      toast.success("Cupón aplicado correctamente");
      setSkip(true); // Desactivar la query hasta el siguiente intento
    }
  }, [couponData, couponCode, onCouponChange]);

  // Efecto para manejar errores
  useEffect(() => {
    if (error) {
      toast.error(error.data?.error || "Error al verificar el cupón");
      setSkip(true);
    }
  }, [error]);

  return (
    <div className="mt-6">
      <form onSubmit={handleCouponSubmit} className="flex gap-2">
        <input
          type="text"
          name="coupon_code"
          placeholder="Código de cupón"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Aplicar
        </button>
      </form>
      {couponState.applied && (
        <div className="mt-2">
          <p className="text-sm text-green-600">
            Cupón aplicado: {couponState.code}
          </p>
          <p className="text-sm text-gray-600">
            Descuento: ${couponState.discount.toFixed(2)}
          </p>
          {couponState.coupon.min_purchase_amount && (
            <p className="text-sm text-gray-500">
              Monto mínimo: ${couponState.coupon.min_purchase_amount}
            </p>
          )}
          {couponState.coupon.max_discount_amount && (
            <p className="text-sm text-gray-500">
              Descuento máximo: ${couponState.coupon.max_discount_amount}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Coupon;