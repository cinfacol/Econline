"use client";

import { useCallback, useMemo, useEffect } from "react";
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
import { usePayment } from "@/hooks";
import AddressDefault from "@/components/user/Addressdefault";

const CheckoutDetails = () => {
  const router = useRouter();
  const { state, dispatch } = useCheckout();
  const { handlePayment, isProcessing, error, paymentState, setError } =
    usePayment();

  const {
    data: cartData,
    isLoading: isLoadingCart,
    refetch: refetchCart,
  } = useGetItemsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: shippingData,
    isLoading: isLoadingShipping,
    refetch: refetchShipping,
  } = useGetShippingOptionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: paymentMethods, refetch: refetchPaymentMethods } =
    useGetPaymentMethodsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  // Hook para obtener los totales calculados desde el backend
  const { data: paymentTotal, refetch: refetchPaymentTotal } =
    useGetPaymentTotalQuery(
      {
        shipping_id: state.shipping.id,
        coupon_id:
          state.coupon.applied && state.coupon.coupon?.id
            ? state.coupon.coupon.id
            : null,
      },
      {
        skip: !state.shipping.id,
        refetchOnMountOrArgChange: true,
      }
    );

  // Refresca los datos al montar el componente o cuando cambia el shipping/cupón
  useEffect(() => {
    refetchCart();
    refetchShipping();
    refetchPaymentMethods();
    if (state.shipping.id) {
      refetchPaymentTotal();
    }
    // Limpia el error si cambia el método de envío, cupón o método de pago
    if (setError) setError(null);
  }, [
    state.shipping.id,
    state.coupon.coupon?.id,
    state.paymentMethod?.id,
    setError,
    refetchCart,
    refetchShipping,
    refetchPaymentMethods,
    refetchPaymentTotal,
  ]);

  const { ids = [], entities = {} } = cartData || {};
  const items = ids.map((id) => entities[id]).filter(Boolean);

  const cartTotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.inventory.store_price * item.quantity,
      0
    );
  }, [items]);

  const handleShippingChange = useCallback(
    (shippingId, shippingCost) => {
      dispatch({
        type: "SET_SHIPPING",
        payload: {
          id: shippingId,
          cost: shippingCost,
          isCalculating: false,
        },
      });
    },
    [dispatch]
  );

  const handleCouponChange = useCallback(
    (couponData) => {
      dispatch({
        type: "SET_COUPON",
        payload: couponData,
      });
    },
    [dispatch]
  );

  const handlePaymentSubmit = useCallback(
    async (e) => {
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
          coupon_id:
            state.coupon.applied && state.coupon.coupon?.id
              ? state.coupon.coupon.id
              : null,
          total_amount: paymentTotal.total_amount,
          subtotal: paymentTotal.subtotal,
          shipping_cost: paymentTotal.shipping_cost,
          discount: paymentTotal.discount,
        };

        await handlePayment(paymentData);
        toast.dismiss(toastId);
        // Refresca el carrito tras el pago
        refetchCart();
      } catch (error) {
        const errorMessage =
          error?.message || error?.data?.detail || "Error al procesar el pago";
        toast.error(errorMessage);
        dispatch({
          type: "SET_PAYMENT_ERROR",
          payload: errorMessage,
        });
      }
    },
    [
      state,
      paymentTotal,
      handlePayment,
      items,
      paymentMethods,
      dispatch,
      refetchCart,
    ]
  );

  if (isLoadingCart || isLoadingShipping) {
    return <CheckoutSkeleton />;
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <Button onClick={() => router.push("/product")}>
          Continuar comprando
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
      <section className="lg:col-span-5">
        <CheckoutItems
          items={items}
          isProcessing={isProcessing}
          shippingCost={paymentTotal?.shipping_cost}
          discount={paymentTotal?.discount}
        />
      </section>
      <section className="lg:col-span-7">
        <Coupon
          onCouponChange={handleCouponChange}
          couponState={state.coupon}
          cartTotal={cartTotal}
        />
        <Shipping
          shippingOptions={
            shippingData?.entities ? Object.values(shippingData.entities) : []
          }
          onShippingChange={handleShippingChange}
          shippingState={state.shipping}
          cartTotal={cartTotal}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {paymentState === "success" && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ¡Pago realizado con éxito!
          </div>
        )}

        <CheckoutOrder
          shipping_id={state.shipping.id}
          coupon_id={
            state.coupon.applied && state.coupon.coupon?.id
              ? state.coupon.coupon.id
              : null
          }
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
