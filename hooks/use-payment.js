import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  useCreateCheckoutSessionMutation,
  useProcessPaymentMutation,
} from "@/redux/features/payment/paymentApiSlice";
import { getStripe } from "@/lib/stripe";
import { useClearCartMutation } from "@/redux/features/cart/cartApiSlice";

// Constantes
const STORAGE_KEYS = {
  PAYMENT_ID: "pendingPaymentId",
  PAYMENT_INTENT: "paymentIntent",
  PAYMENT_STATUS: "paymentStatus",
};

const PAYMENT_STATES = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  ERROR: "error",
};

export function usePayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentState, setPaymentState] = useState(PAYMENT_STATES.IDLE);
  const [error, setError] = useState(null);

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [processPayment] = useProcessPaymentMutation();
  const [clearCart] = useClearCartMutation();

  // Limpiar storage al desmontar o en error
  const cleanupStorage = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) =>
      sessionStorage.removeItem(key)
    );
  }, []);

  // Manejo de errores mejorado
  const handleError = useCallback(
    (err, context = "") => {
      const errorMessage =
        err?.data?.error ||
        err?.data?.detail ||
        err?.message ||
        "Error en el proceso de pago";
      setError(errorMessage);
      toast.error(errorMessage);
      cleanupStorage();
      setPaymentState(PAYMENT_STATES.ERROR);
    },
    [cleanupStorage]
  );

  const handlePayment = useCallback(
    async (formData) => {
      if (paymentState === PAYMENT_STATES.PROCESSING) {
        toast.warning("Hay un pago en proceso");
        return;
      }
      console.log("Handling payment with formData:", formData);

      setPaymentState(PAYMENT_STATES.PROCESSING);
      setError(null);

      try {
        if (!formData?.shipping_id) {
          throw new Error("Método de envío requerido");
        }
        if (!formData?.payment_method_id) {
          throw new Error("Método de pago requerido");
        }

        // 1. Crear sesión de checkout
        const result = await createCheckoutSession({
          shipping_id: formData.shipping_id,
          payment_method_id: formData.payment_method_id,
        }).unwrap();

        // Si el método es Stripe (SC), redirige a Stripe
        if (
          (formData.payment_option === "SC" || result?.is_stripe) &&
          result?.sessionId
        ) {
          localStorage.setItem("payment_id", result.payment_id);
          sessionStorage.setItem(STORAGE_KEYS.PAYMENT_INTENT, result.sessionId);

          const stripe = await getStripe();
          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId: result.sessionId,
          });
          if (stripeError) throw stripeError;
        } else if (result?.checkout_url) {
          // Si el backend retorna una URL para otros métodos (PayPal, PSE, etc.)
          window.location.href = result.checkout_url;
        } else {
          // Si es efectivo u otro método sin redirección
          toast.success("Sesión de pago creada correctamente");
          // Aquí podrías redirigir a una página de instrucciones, etc.
        }
      } catch (err) {
        handleError(err, "handlePayment");
      }
    },
    [createCheckoutSession, handleError, paymentState]
  );

  // Verificación del pago mejorada
  useEffect(() => {
    let alreadyProcessed = false;
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const storedPaymentId = sessionStorage.getItem(STORAGE_KEYS.PAYMENT_ID);

      if (!sessionId || !storedPaymentId || alreadyProcessed) return;

      alreadyProcessed = true;
      setPaymentState(PAYMENT_STATES.PROCESSING);

      try {
        // Intentar procesar el pago
        const result = await processPayment(storedPaymentId).unwrap();

        if (result.status === "success" || result.payment_status === "C") {
          // Limpiar carrito solo si el pago fue exitoso
          try {
            await clearCart().unwrap();
            toast.success("Carrito limpiado exitosamente");
          } catch (cartErr) {
            toast.error(
              "El pago fue exitoso, pero no se pudo limpiar el carrito."
            );
          }
          setPaymentState(PAYMENT_STATES.SUCCESS);

          // Guardar ID para la página de éxito y limpiar session storage
          localStorage.setItem(STORAGE_KEYS.PAYMENT_STATUS, "success");
          cleanupStorage();

          toast.success("Pago procesado exitosamente");
          router.push("/order/success");
        } else {
          throw new Error(result.message || "El pago no pudo ser completado");
        }
      } catch (err) {
        handleError(err, "verifyPayment");
        router.push("/order/cancelled");
      } finally {
        setPaymentState(PAYMENT_STATES.IDLE);
      }
    };

    verifyPayment();
  }, [
    searchParams,
    processPayment,
    clearCart,
    router,
    handleError,
    cleanupStorage,
  ]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (paymentState === PAYMENT_STATES.ERROR) {
        cleanupStorage();
      }
    };
  }, [paymentState, cleanupStorage]);

  return {
    handlePayment,
    isProcessing: paymentState === PAYMENT_STATES.PROCESSING,
    error,
    paymentState,
  };
}
