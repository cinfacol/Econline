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
        [
          `Contexto: ${context}`,
          err?.data?.error,
          err?.data?.detail,
          err?.message,
          "Error en el proceso de pago",
        ].find((msg) => msg) || "Error desconocido";
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
        if (
          !formData?.shipping_id ||
          typeof formData.shipping_id !== "string"
        ) {
          throw new Error("Método de envío inválido o no proporcionado");
        }
        if (
          !formData?.payment_method_id ||
          typeof formData.payment_method_id !== "string"
        ) {
          throw new Error("Método de pago inválido o no proporcionado");
        }

        const result = await createCheckoutSession({
          shipping_id: formData.shipping_id,
          payment_method_id: formData.payment_method_id,
        }).unwrap();

        if (!result?.payment_id) {
          console.error(
            "El payment_id no está presente en la respuesta:",
            result
          );
        } else {
          localStorage.setItem("payment_id", result.payment_id);
        }
        if (!result?.payment_id) {
          console.error(
            "El payment_id no está presente en la respuesta:",
            result
          );
        } else {
          localStorage.setItem("payment_id", result.payment_id);
        }
        if (!result?.payment_id) {
          console.error(
            "El payment_id no está presente en la respuesta:",
            result
          );
        } else {
          localStorage.setItem("payment_id", result.payment_id);
        }
        if (!result?.payment_id) {
          console.error(
            "El payment_id no está presente en la respuesta:",
            result
          );
        } else {
          localStorage.setItem("payment_id", result.payment_id);
        }

        if (
          (formData.payment_option === "SC" || result?.is_stripe) &&
          result?.sessionId
        ) {
          if (result?.payment_id) {
            localStorage.setItem("payment_id", result.payment_id);
          } else {
            console.error("payment_id no disponible en la respuesta:", result);
          }
          sessionStorage.setItem(STORAGE_KEYS.PAYMENT_INTENT, result.sessionId);

          const stripe = await getStripe();
          await new Promise((resolve) => setTimeout(resolve, 5000));
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
        console.error("Error en handlePayment:", err);
        handleError(err, "handlePayment");
      } finally {
        setPaymentState(PAYMENT_STATES.IDLE);
      }
    },
    [createCheckoutSession, handleError, paymentState]
  );

  // Verificación del pago mejorada
  useEffect(() => {
    let alreadyProcessed = false;
    const verifyPayment = async () => {
      const sessionId =
        searchParams.get("session_id") ||
        sessionStorage.getItem(STORAGE_KEYS.PAYMENT_INTENT);
      const storedPaymentId =
        sessionStorage.getItem(STORAGE_KEYS.PAYMENT_ID) ||
        localStorage.getItem("payment_id");

      if (!sessionId || !storedPaymentId) return;

      setPaymentState((prevState) => {
        if (prevState === PAYMENT_STATES.PROCESSING) return prevState;
        return PAYMENT_STATES.PROCESSING;
      });
      setPaymentState(PAYMENT_STATES.PROCESSING);

      try {
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
