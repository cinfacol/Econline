"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import CheckoutItems from "./CheckoutItems";
import Shipping from "./Shipping";
import Coupon from "./Coupon";
import CheckoutOrder from "./CheckoutOrder";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/contexts/CheckoutContext";
import { toast } from "sonner";
import { useGetItemsQuery } from "@/redux/features/cart/cartApiSlice";
import { useGetShippingOptionsQuery } from "@/redux/features/shipping/shippingApiSlice";
import {
  useGetPaymentTotalQuery,
  useGetPaymentMethodsQuery,
} from "@/redux/features/payment/paymentApiSlice";
import { CheckoutSkeleton } from "@/components/skeletons/CheckoutSkeleton";
import { usePayment } from "@/hooks/use-payment";
import AddressDefault from "@/components/user/Addressdefault";

const CheckoutDetails = () => {
  const router = useRouter();
  const { state, dispatch } = useCheckout();
  const { handlePayment, isProcessing } = usePayment();

  const { data: cartData, isLoading: isLoadingCart } = useGetItemsQuery();
  const { data: shippingData, isLoading: isLoadingShipping } = useGetShippingOptionsQuery();
  const { data: paymentMethods } = useGetPaymentMethodsQuery();

  // Hook para obtener los totales calculados desde el backend
  const { data: paymentTotal } = useGetPaymentTotalQuery(
    { 
      shipping_id: state.shipping.id,
      coupon_id: state.coupon.applied && state.coupon.coupon?.id ? state.coupon.coupon.id : null
    }, 
    {
      skip: !state.shipping.id,
    }
  );

  const { ids = [], entities = {} } = cartData || {};
  const items = ids.map((id) => entities[id]).filter(Boolean);

  const cartTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.inventory.store_price * item.quantity), 0);
  }, [items]);

  const handleShippingChange = useCallback((shippingId, shippingCost) => {
    dispatch({
      type: 'SET_SHIPPING',
      payload: {
        id: shippingId,
        cost: shippingCost,
        isCalculating: false
      }
    });
  }, [dispatch]);

  const handleCouponChange = useCallback((couponData) => {
    dispatch({
      type: 'SET_COUPON',
      payload: couponData
    });
  }, [dispatch]);

  const handlePaymentSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!state.shipping.id) {
      toast.error("Por favor seleccione un método de envío");
      return;
    }

    if (!items.length) {
      toast.error("El carrito está vacío");
      return;
    }

    if (!paymentTotal) {
      toast.error("Error al calcular el total del pedido");
      return;
    }

    if (!paymentMethods?.methods?.length) {
      toast.error("No hay métodos de pago disponibles");
      return;
    }

    try {
      const toastId = toast.loading("Iniciando proceso de pago...");
      const defaultPaymentMethod = paymentMethods.methods[0];

      // Usar los datos del hook useGetPaymentTotalQuery para consistencia
      const paymentData = {
        shipping_id: state.shipping.id,
        payment_method_id: String(defaultPaymentMethod.id),
        payment_option: defaultPaymentMethod.key,
        coupon_id: state.coupon.applied && state.coupon.coupon?.id ? state.coupon.coupon.id : null,
        total_amount: paymentTotal.total_amount,
        subtotal: paymentTotal.subtotal,
        shipping_cost: paymentTotal.shipping_cost,
        discount: paymentTotal.discount
      };

      console.log("Datos de pago que se enviarán:", paymentData);
      console.log("PaymentTotal completo:", paymentTotal);

      await handlePayment(paymentData);
      toast.dismiss(toastId);
    } catch (error) {
      const errorMessage = error?.message || error?.data?.detail || "Error al procesar el pago";
      toast.error(errorMessage);
      dispatch({
        type: 'SET_PAYMENT_ERROR',
        payload: errorMessage
      });
    }
  }, [state, paymentTotal, handlePayment, items, paymentMethods, dispatch]);

  if (isLoadingCart || isLoadingShipping) {
    return <CheckoutSkeleton />;
  }

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
      <section className="lg:col-span-5">
        <CheckoutItems items={items} isProcessing={isProcessing} />
      </section>
      <section className="lg:col-span-7">
        <Coupon
          onCouponChange={handleCouponChange}
          couponState={state.coupon}
          cartTotal={cartTotal}
        />
        <Shipping
          shippingOptions={shippingData?.entities ? Object.values(shippingData.entities) : []}
          onShippingChange={handleShippingChange}
          shippingState={state.shipping}
          cartTotal={cartTotal}
        />
        <CheckoutOrder
          shipping_id={state.shipping.id}
          coupon_id={state.coupon.applied && state.coupon.coupon?.id ? state.coupon.coupon.id : null}
          onPaymentSubmit={handlePaymentSubmit}
          isProcessing={isProcessing}
        />
        <div className="mt-6">
          <AddressDefault />
        </div>
      </section>
    </div>
  );
};

export default CheckoutDetails;