"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useGetItemsQuery,
  useGetShippingOptionsQuery,
  useCheckCouponMutation,
} from "@/redux/features/cart/cartApiSlice";
import {
  useGetClientTokenQuery,
  useProcessPaymentMutation,
  useGetPaymentTotalQuery,
} from "@/redux/features/payment/paymentApiSlice";
import { CheckoutSkeleton } from "@/squeletons/CheckoutSkeleton";
import CheckoutItems from "./CheckoutItems";
import ShippingForm from "./ShippingForm";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { Button } from "@headlessui/react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutDetails = () => {
  const router = useRouter();
  const [formState, setFormState] = useState(() => {
    // Recuperar estado del localStorage si existe
    const savedState = localStorage.getItem("checkoutForm");
    return savedState
      ? JSON.parse(savedState)
      : {
          coupon_name: "",
          shipping_id: 0,
          shipping_cost: 0,
        };
  });

  const { data: cartData, isLoading: isLoadingCart } = useGetItemsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  // Destructure data and handle empty cart case concisely
  const { ids = [], entities = {} } = cartData || {};
  // Calculate cart items
  const items = ids.map((id) => entities[id] || null).filter(Boolean);

  const { data: shippingData, isLoading: isLoadingShipping } =
    useGetShippingOptionsQuery("shipping", {
      refetchOnMountOrArgChange: true,
    });

  const { data: tokenData, isLoading: isLoadingToken } = useGetClientTokenQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false,
    }
  );

  const { data: paymentTotal } = useGetPaymentTotalQuery(
    formState.shipping_id,
    {
      skip: !formState.shipping_id,
      // Refetch cuando cambie el shipping_id
      refetchOnMountOrArgChange: true,
    }
  );

  const [processPayment, { isLoading: isProcessingPayment }] =
    useProcessPaymentMutation();
  const [checkCoupon, { isLoading: isCheckingCoupon }] =
    useCheckCouponMutation();

  // Persistir formState en localStorage
  useEffect(() => {
    localStorage.setItem("checkoutForm", JSON.stringify(formState));
  }, [formState]);

  // Añadir esta función para manejar cambios en inputs generales
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleShippingChange = useCallback((e, shippingCost) => {
    const { name, value } = e.target;
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
        toast.success("Cupón aplicado correctamente");
        setFormState((prev) => ({
          ...prev,
          coupon_applied: true,
          discount: result.discount,
        }));
      } catch (err) {
        toast.error(err.data?.detail || "Error al aplicar el cupón");
      }
    },
    [formState.coupon_name, checkCoupon]
  );

  const handlePaymentSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formState.shipping_id) {
        toast.error("Por favor seleccione un método de envío");
        return;
      }

      try {
        // Crear sesión de checkout con Stripe
        const result = await processPayment({
          shipping_id: formState.shipping_id,
          ...formState,
        }).unwrap();

        // Redireccionar a Stripe Checkout
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: result.sessionId,
        });

        if (error) {
          toast.error(error.message);
        }
      } catch (err) {
        toast.error(err.data?.detail || "Error al procesar el pago");
      }
    },
    [formState, processPayment]
  );

  // Manejo de estados de carga
  const isLoading = isLoadingCart || isLoadingShipping || isLoadingToken;
  const isProcessing = isProcessingPayment || isCheckingCoupon;

  if (isLoading) {
    return <CheckoutSkeleton />;
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
              {isProcessing ? "Procesando..." : "Pagar con Stripe"}
            </Button>
          </div>
        }
        clientToken={tokenData}
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
