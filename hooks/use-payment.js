import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import {
  useCreateCheckoutSessionMutation,
  useProcessPaymentMutation,
  useVerifyPaymentQuery,
} from "@/redux/features/payment/paymentApiSlice";
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

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
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
    (error, context = "") => {
      console.error(`Error en ${context}:`, error);
      const errorMessage =
        error?.data?.error ||
        error?.data?.detail ||
        error?.message ||
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

      setPaymentState(PAYMENT_STATES.PROCESSING);
      setError(null);

      try {
        // Validar datos del formulario
        if (!formData?.shipping_id) {
          throw new Error("Método de envío requerido");
        }

        // 1. Crear sesión de checkout
        const result = await createCheckoutSession({
          shipping_id: formData.shipping_id,
          payment_option: "S",
        }).unwrap();

        if (!result?.payment_id || !result?.sessionId) {
          throw new Error("Respuesta inválida del servidor");
        }

        // Guardar el ID del pago en localStorage
        localStorage.setItem("payment_id", result.payment_id);
        sessionStorage.setItem(STORAGE_KEYS.PAYMENT_INTENT, result.sessionId);

        // 2. Persistir datos necesarios
        /* sessionStorage.setItem(STORAGE_KEYS.PAYMENT_ID, result.payment_id);
        sessionStorage.setItem(STORAGE_KEYS.PAYMENT_INTENT, result.sessionId); */

        // 3. Redireccionar a Stripe
        const stripe = await getStripe();
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: result.sessionId,
        });

        if (stripeError) throw stripeError;
      } catch (err) {
        handleError(err, "handlePayment");
      }
    },
    [createCheckoutSession, handleError, paymentState]
  );

  // Verificación del pago mejorada
  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      const storedPaymentId = sessionStorage.getItem(STORAGE_KEYS.PAYMENT_ID);

      if (!sessionId || !storedPaymentId) return;

      setPaymentState(PAYMENT_STATES.PROCESSING);

      try {
        // Intentar procesar el pago
        const result = await processPayment(storedPaymentId).unwrap();

        if (result.status === "success" || result.payment_status === "C") {
          // Limpiar carrito solo si el pago fue exitoso
          await clearCart().unwrap();
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
