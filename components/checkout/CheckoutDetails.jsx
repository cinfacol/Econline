"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePayment } from "@/hooks/use-payment";
import {
  useGetItemsQuery,
  useGetShippingOptionsQuery,
  useCheckCouponMutation,
} from "@/redux/features/cart/cartApiSlice";
import { useGetPaymentTotalQuery } from "@/redux/features/payment/paymentApiSlice";
import { CheckoutSkeleton } from "@/components/skeletons/CheckoutSkeleton";
import CheckoutItems from "./CheckoutItems";
import ShippingForm from "./ShippingForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CheckoutDetails = () => {
  const router = useRouter();
  const { handlePayment, isProcessing } = usePayment();

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

  const handleShippingChange = useCallback((e, shippingCost) => {
    const { value } = e.target;
    setFormState((prev) => ({
      ...prev,
      shipping_id: value,
      shipping_cost: shippingCost,
    }));
  }, []);

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

  const handlePaymentSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formState.shipping_id) {
        toast.error("Por favor seleccione un método de envío");
        return;
      }

      try {
        await handlePayment({
          ...formState,
          total_amount: formState.coupon_applied
            ? formState.total_after_coupon
            : paymentTotal?.total_amount,
        });
      } catch (error) {
        toast.error("Error al procesar el pago");
      }
    },
    [formState, paymentTotal, handlePayment]
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
      <CheckoutItems items={items} isProcessing={isProcessing} />

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
          <div className="payment-info">
            <Button
              type="submit"
              variant="warning"
              className="w-full mt-4"
              disabled={isProcessing}
            >
              {isProcessing ? "Procesando pago..." : "Pagar con Stripe"}
            </Button>
          </div>
        }
        paymentTotal={paymentTotal}
        isProcessing={isProcessing}
        coupon={formState.coupon}
        coupon_name={formState.coupon_name}
        total_after_coupon={formState.total_after_coupon}
      />
    </div>
  );
};

export default CheckoutDetails;
