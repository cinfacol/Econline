import { useCallback, useState, useEffect } from "react";
import { useCheckCouponQuery } from "@/redux/features/shipping/shippingApiSlice";
import { toast } from "sonner";

const Coupon = ({ onCouponChange, couponState, cartTotal }) => {
  const [couponInput, setCouponInput] = useState("");
  const [skip, setSkip] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("Estado del cupón:", couponState);

  const {
    data: couponData,
    error,
    isLoading,
    isError,
  } = useCheckCouponQuery(
    {
      name: couponInput.trim().toUpperCase(),
      cart_total: cartTotal,
    },
    {
      skip,
      pollingInterval: 0,
      refetchOnMountOrArgChange: true,
    }
  );

  const validateCouponInput = (input) => {
    if (!input.trim()) {
      return "Por favor ingrese el nombre del cupón";
    }
    if (input.length < 3) {
      return "El nombre del cupón debe tener al menos 3 caracteres";
    }
    if (input.length > 50) {
      return "El nombre del cupón no puede exceder los 50 caracteres";
    }
    return null;
  };

  const handleCouponSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const validationError = validateCouponInput(couponInput);
      if (validationError) {
        toast.error(validationError);
        setIsSubmitting(false);
        return;
      }

      setSkip(false);
    },
    [couponInput]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Solo permitir letras, números y guiones, sin espacios
    if (/^[a-zA-Z0-9-]*$/.test(value)) {
      setCouponInput(value.toUpperCase());
    }
  };

  // Efecto para manejar la respuesta del cupón
  useEffect(() => {
    if (couponData) {
      if (!couponData.is_valid) {
        toast.error(couponData.error || "Cupón inválido o no aplicable");
        setIsSubmitting(false);
        return;
      }

      const totalAfterDiscount = cartTotal - couponData.discount;

      onCouponChange({
        name: couponData.coupon.name,
        applied: true,
        discount: couponData.discount,
        coupon: couponData.coupon,
        totalAfterDiscount: totalAfterDiscount,
      });

      setSkip(true);
      setIsSubmitting(false);
    }
  }, [couponData, onCouponChange, cartTotal]);

  // Efecto para manejar errores
  useEffect(() => {
    if (isError) {
      toast.error(error?.error || "Error al verificar el cupón");
      setSkip(true);
      setIsSubmitting(false);
    }
  }, [isError, error]);

  // Limpiar el estado cuando se desmonte el componente
  useEffect(() => {
    return () => {
      setCouponInput("");
      setSkip(true);
      setIsSubmitting(false);
    };
  }, []);

  const handleRemoveCoupon = () => {
    onCouponChange({
      name: "",
      applied: false,
      discount: 0,
      coupon: null,
    });
    setCouponInput("");
    setSkip(true);
    setIsSubmitting(false);
    toast.success("Cupón removido correctamente");
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleCouponSubmit} className="flex gap-2">
        <input
          type="text"
          name="coupon_input"
          placeholder="Nombre del cupón"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={couponInput}
          onChange={handleInputChange}
          disabled={isLoading || isSubmitting}
          maxLength={50}
          pattern="[A-Za-z0-9\-]+"
        />
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading || isSubmitting}
        >
          {isLoading
            ? "Verificando..."
            : isSubmitting
            ? "Aplicando..."
            : "Aplicar"}
        </button>
      </form>
      {couponState.applied && (
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">
                Cupón aplicado: {couponState.name}
              </p>
              <p className="text-sm text-gray-600">
                Descuento: ${couponState.discount.toFixed(2)}
              </p>
              {couponState.coupon.min_purchase_amount && (
                <p className="text-sm text-gray-500">
                  Monto mínimo: $
                  {Number(couponState.coupon.min_purchase_amount).toFixed(2)}
                </p>
              )}
              {couponState.coupon.max_discount_amount && (
                <p className="text-sm text-gray-500">
                  Descuento máximo: $
                  {Number(couponState.coupon.max_discount_amount).toFixed(2)}
                </p>
              )}
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remover cupón
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupon;
