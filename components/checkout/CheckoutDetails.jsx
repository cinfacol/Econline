"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutItems from "./CheckoutItems";
import ShippingForm from "./ShippingForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetItemsQuery,
  useGetShippingOptionsQuery,
  useCheckCouponMutation,
} from "@/redux/features/cart/cartApiSlice";
import {
  useCreateCheckoutSessionMutation,
  useGetPaymentTotalQuery,
  useGetPaymentMethodsQuery,
} from "@/redux/features/payment/paymentApiSlice";
import { CheckoutSkeleton } from "@/components/skeletons/CheckoutSkeleton";
import { usePayment } from "@/hooks/use-payment";

const CheckoutDetails = () => {
  const router = useRouter();
  const { handlePayment, isProcessing, error, paymentState } = usePayment();

  // Estado del formulario
  const [formState, setFormState] = useState({
    shipping_id: "",
    shipping_cost: 0,
    coupon_name: "",
    coupon: null,
    coupon_applied: false,
    discount: 0,
    total_after_coupon: 0,
  });
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  // Queries y Mutations
  const { data: cartData, isLoading: isLoadingCart } = useGetItemsQuery();
  const { data: shippingData, isLoading: isLoadingShipping } = useGetShippingOptionsQuery();
  const { data: paymentTotal } = useGetPaymentTotalQuery(formState.shipping_id, {
    skip: !formState.shipping_id,
  });
  const { data: paymentMethods } = useGetPaymentMethodsQuery();
  const [checkCoupon] = useCheckCouponMutation();

  // Procesar datos del carrito
  const { ids = [], entities = {} } = cartData || {};
  const items = ids.map((id) => entities[id]).filter(Boolean);

  // Efecto para persistir el estado del formulario
  useEffect(() => {
    const savedForm = localStorage.getItem("checkoutForm");
    if (savedForm) {
      setFormState(JSON.parse(savedForm));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(formState));
  }, [formState]);

  // Handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleShippingChange = useCallback(
    (e, shippingCost) => {
      const { value } = e.target;
      setFormState((prev) => ({
        ...prev,
        shipping_id: value,
        shipping_cost: shippingCost,
        coupon: null,
        coupon_applied: false,
        discount: 0,
        total_after_coupon: 0,
      }));
      if (formState.coupon_applied) {
        toast.info(
          "El método de envío cambió. Por favor, vuelve a aplicar tu cupón si aún es válido."
        );
      }
    },
    [formState.coupon_applied]
  );

  const handleCouponSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formState.coupon_name) {
        toast.error("Por favor ingrese un cupón");
        return;
      }

      try {
        const result = await checkCoupon(formState.coupon_name).unwrap();

        const discountAmount =
          (paymentTotal?.total_amount * result.discount_percentage) / 100;
        const newTotal = paymentTotal?.total_amount - discountAmount;

        setFormState((prev) => ({
          ...prev,
          coupon: result,
          coupon_applied: true,
          discount: discountAmount,
          total_after_coupon: newTotal,
        }));

        toast.success("Cupón aplicado correctamente");
      } catch (err) {
        toast.error(err.data?.detail || "Cupón inválido");
      }
    },
    [formState.coupon_name, checkCoupon, paymentTotal]
  );

  useEffect(() => {
    if (paymentState === "error" && error) {
      toast.error(error);
      localStorage.removeItem("checkoutForm");
    }
  }, [paymentState, error]);

  const handlePaymentSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formState.shipping_id) {
        toast.error("Por favor seleccione un método de envío");
        return;
      }

      if (!items.length) {
        toast.error("El carrito está vacío");
        return;
      }

      const totalAmount = formState.coupon_applied
        ? formState.total_after_coupon
        : paymentTotal?.total_amount;

      if (!totalAmount || totalAmount <= 0) {
        toast.error("El monto a pagar no es válido");
        return;
      }

      if (!paymentMethods?.methods?.length) {
        toast.error("No hay métodos de pago disponibles");
        return;
      }

      try {
        const toastId = toast.loading("Iniciando proceso de pago...");

        // Usar el método de pago por defecto (el primero disponible)
        const defaultPaymentMethod = paymentMethods.methods[0];
        
        const paymentData = {
          shipping_id: formState.shipping_id,
          payment_method_id: String(defaultPaymentMethod.id),
          payment_option: defaultPaymentMethod.key,
        };

        console.log("Datos de pago:", paymentData); // Para debugging

        const result = await handlePayment(paymentData);
        console.log("Resultado del pago:", result); // Para debugging
        toast.dismiss(toastId);
      } catch (error) {
        console.error("Error en handlePayment:", error);
        const errorMessage = error?.message || error?.data?.detail || "Error al procesar el pago. Por favor, intente nuevamente.";
        toast.error(errorMessage);
        throw error; // Re-lanzar el error para que sea manejado por el hook usePayment
      }
    },
    [formState, paymentTotal, handlePayment, items, paymentMethods]
  );

  // Optimizar el cálculo de envío para evitar llamadas repetidas
  useEffect(() => {
    let timeoutId;
    let mounted = true;
    
    const calculateInitialShipping = async () => {
      if (isCalculatingShipping || !shippingData?.entities || !mounted) return;
      
      setIsCalculatingShipping(true);
      const shippingOptionsArray = Object.values(shippingData.entities);
      const defaultShippingOption = shippingOptionsArray[0];
      
      try {
        const response = await calculateShipping({
          shipping_id: defaultShippingOption.id,
          order_total: paymentTotal?.total_amount || 0,
        }).unwrap();
        
        if (!mounted) return;

        const newShippingCost = response.is_free_shipping ? 0 : response.shipping_cost;
        if (response.is_free_shipping && formState.shipping_cost !== 0) {
          toast.success("¡Felicidades! Tu pedido califica para envío gratuito");
        }
        handleShippingChange({ target: { value: defaultShippingOption.id } }, newShippingCost);
      } catch (error) {
        if (!mounted) return;
        console.error("Error al calcular envío:", error);
        toast.error(error.data?.detail || "Error al calcular el envío");
        handleShippingChange(
          { target: { value: defaultShippingOption.id } }, 
          defaultShippingOption.standard_shipping_cost
        );
      } finally {
        if (mounted) {
          setIsCalculatingShipping(false);
        }
      }
    };

    // Solo calcular el envío inicial si no hay un shipping_id seleccionado y no estamos calculando
    if (!formState.shipping_id && shippingData?.entities && !isCalculatingShipping && paymentTotal?.total_amount) {
      timeoutId = setTimeout(calculateInitialShipping, 500);
    }

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [shippingData, formState.shipping_id, handleShippingChange, isCalculatingShipping, paymentTotal?.total_amount]);

  const renderPaymentButton = ({ isShippingCalculated, isCalculatingShipping }) => {
    return (
      <div className="mt-6">
        <button
          type="submit"
          disabled={!isShippingCalculated || isCalculatingShipping}
          className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
            !isShippingCalculated || isCalculatingShipping
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {isCalculatingShipping ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Calculando envío...
            </div>
          ) : (
            "Continuar con el pago"
          )}
        </button>
      </div>
    );
  };

  // Loading states
  if (isLoadingCart || isLoadingShipping) {
    return <CheckoutSkeleton />;
  }

  // Empty cart
  if (!items.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <Button onClick={() => router.push("/products")}>
          Continuar comprando
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-5 space-y-6">
        <CheckoutItems items={items} isProcessing={isProcessing} />
      </div>

      <ShippingForm
        shippingOptions={
          shippingData?.entities ? Object.values(shippingData.entities) : []
        }
        formState={formState}
        shipping_id={formState.shipping_id}
        shipping_cost={formState.shipping_cost}
        onShippingChange={handleShippingChange}
        onChange={handleInputChange}
        onCouponSubmit={handleCouponSubmit}
        onPaymentSubmit={handlePaymentSubmit}
        renderPaymentInfo={
          <div>
            {renderPaymentButton({ 
              isShippingCalculated: !!formState.shipping_id,
              isCalculatingShipping
            })}
          </div>
        }
        paymentTotal={paymentTotal}
        isProcessing={isProcessing}
        error={error}
        coupon={formState.coupon}
        coupon_name={formState.coupon_name}
        total_after_coupon={formState.total_after_coupon}
      />
    </div>
  );
};

export default CheckoutDetails;
