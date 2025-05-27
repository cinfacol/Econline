"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
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

  // Estado para el método de pago seleccionado
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    () => localStorage.getItem("selectedPaymentMethod") || ""
  );

  useEffect(() => {
    if (selectedPaymentMethod) {
      localStorage.setItem("selectedPaymentMethod", selectedPaymentMethod);
    }
  }, [selectedPaymentMethod]);

  // Queries y Mutations
  const { data: cartData, isLoading: isLoadingCart } = useGetItemsQuery();
  const { data: shippingData, isLoading: isLoadingShipping } =
    useGetShippingOptionsQuery();
  const { data: paymentTotal } = useGetPaymentTotalQuery(
    formState.shipping_id,
    {
      skip: !formState.shipping_id,
    }
  );
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
        // Resetear cupón al cambiar envío
        coupon: null,
        coupon_applied: false,
        discount: 0,
        total_after_coupon: 0,
        // Opcional: Limpiar el input del cupón si se resetea
        // coupon_name: "",
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
      // Opcionalmente, limpiar el formulario o redirigir
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

      // Validar monto mínimo si es necesario
      const totalAmount = formState.coupon_applied
        ? formState.total_after_coupon
        : paymentTotal?.total_amount;

      if (!totalAmount || totalAmount <= 0) {
        toast.error("El monto a pagar no es válido");
        return;
      }

      // Buscar el método seleccionado por key
      const selectedMethodObj = paymentMethods?.methods?.find(
        (m) => m.key === selectedPaymentMethod
      );
      if (!selectedMethodObj) {
        toast.error("Por favor selecciona un método de pago.");
        return;
      }

      try {
        toast.loading("Iniciando proceso de pago...");

        await handlePayment({
          shipping_id: formState.shipping_id,
          payment_method_id: selectedMethodObj.id,
          payment_option: selectedMethodObj.key,
        });
      } catch (error) {
        console.error("Error en checkout:", error);
      }
    },
    [
      formState,
      paymentTotal,
      handlePayment,
      items,
      selectedPaymentMethod,
      paymentMethods,
    ]
  );

  const renderPaymentButton = () => (
    <div className="payment-info">
      <Button
        type="submit"
        variant="warning"
        className="w-full mt-4"
        disabled={
          isProcessing ||
          !items.length ||
          !formState.shipping_id ||
          !selectedPaymentMethod
        }
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <span className="animate-spin">⭕</span>
            <span>Procesando pago...</span>
          </div>
        ) : (
          "Continuar con el pago"
        )}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );

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
        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onMethodChange={setSelectedPaymentMethod}
        />
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
            {!selectedPaymentMethod ? (
              <div className="text-sm text-gray-500 mb-2">
                No se ha seleccionado método de pago.
              </div>
            ) : (
              <div className="text-sm text-green-700 mb-2">
                Método seleccionado:{" "}
                <b>
                  {paymentMethods?.methods?.find(
                    (m) => m.key === selectedPaymentMethod
                  )?.label || ""}
                </b>
              </div>
            )}
            {renderPaymentButton()}
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
