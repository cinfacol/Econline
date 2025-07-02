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
  PAYMENT_ID_LOCAL: "payment_id",
};

const PAYMENT_STATES = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  ERROR: "error",
};

const usePayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentState, setPaymentState] = useState(PAYMENT_STATES.IDLE);
  const [error, setError] = useState(null);
  const [shouldVerify, setShouldVerify] = useState(false);

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [processPayment] = useProcessPaymentMutation();
  const [clearCart] = useClearCartMutation();

  const cleanupStorage = useCallback(() => {
    // Limpiar sessionStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      sessionStorage.removeItem(key);
    });

    // Limpiar localStorage
    localStorage.removeItem(STORAGE_KEYS.PAYMENT_ID_LOCAL);
    localStorage.removeItem(STORAGE_KEYS.PAYMENT_STATUS);
  }, []);

  const handleError = useCallback(
    (err, context = "") => {
      const errorMessage =
        [
          `Contexto: ${context}`,
          parseApiError(err?.data),
          parseApiError(err),
          "Error en el proceso de pago",
        ].find((msg) => !!msg && typeof msg === "string") ||
        "Error desconocido";
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

      cleanupStorage();
      setPaymentState(PAYMENT_STATES.PROCESSING);
      setError(null);
      setShouldVerify(true);

      try {
        if (!formData?.shipping_id || !formData?.payment_method_id) {
          throw new Error("Datos de pago incompletos");
        }

        // Enviar todos los datos calculados al backend para consistencia
        const result = await createCheckoutSession({
          shipping_id: formData.shipping_id,
          payment_method_id: formData.payment_method_id,
          coupon_id: formData.coupon_id,
          total_amount: formData.total_amount,
          subtotal: formData.subtotal,
          shipping_cost: formData.shipping_cost,
          discount: formData.discount,
        }).unwrap();

        if (result?.error || result?.detail || result?.message) {
          throw result;
        }

        if (!result?.payment_id) {
          throw new Error("No se recibió un ID de pago válido");
        }

        sessionStorage.setItem(STORAGE_KEYS.PAYMENT_ID, result.payment_id);
        localStorage.setItem(STORAGE_KEYS.PAYMENT_ID_LOCAL, result.payment_id);

        if (
          (formData.payment_option === "SC" || result?.is_stripe) &&
          result?.sessionId
        ) {
          sessionStorage.setItem(STORAGE_KEYS.PAYMENT_INTENT, result.sessionId);
          const stripe = await getStripe();
          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId: result.sessionId,
          });
          if (stripeError) throw stripeError;
        } else if (result?.checkout_url) {
          window.location.href = result.checkout_url;
        } else {
          toast.success("Sesión de pago creada correctamente");
        }
      } catch (err) {
        handleError(err, "handlePayment");
        setShouldVerify(false);
      } finally {
        setPaymentState(PAYMENT_STATES.IDLE);
      }
    },
    [createCheckoutSession, handleError, paymentState, cleanupStorage]
  );

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 2000;
    let isVerifying = false;
    let verificationTimeout = null;

    const verifyPayment = async () => {
      if (!shouldVerify) return;
      if (isVerifying) return;

      const sessionId =
        searchParams.get("session_id") ||
        sessionStorage.getItem(STORAGE_KEYS.PAYMENT_INTENT);
      const storedPaymentId =
        sessionStorage.getItem(STORAGE_KEYS.PAYMENT_ID) ||
        localStorage.getItem(STORAGE_KEYS.PAYMENT_ID_LOCAL);

      if (!sessionId && !storedPaymentId) {
        cleanupStorage();
        setShouldVerify(false);
        return;
      }

      if (paymentState === PAYMENT_STATES.PROCESSING) return;

      isVerifying = true;
      setPaymentState(PAYMENT_STATES.PROCESSING);

      try {
        const result = await processPayment(storedPaymentId).unwrap();

        if (result?.error || result?.detail || result?.message) {
          throw result;
        }

        if (
          result.status === "success" ||
          result.payment_status === "C" ||
          result.message === "Payment already completed"
        ) {
          setPaymentState(PAYMENT_STATES.SUCCESS);
          localStorage.setItem(STORAGE_KEYS.PAYMENT_STATUS, "success");
          try {
            await clearCart().unwrap();
            toast.success("Carrito limpiado exitosamente");
          } catch (cartErr) {
            toast.error(
              "El pago fue exitoso, pero no se pudo limpiar el carrito."
            );
          }
          cleanupStorage();
          setShouldVerify(false);
          toast.success("Pago procesado exitosamente");
          router.push("/order/success");
        } else if (result.status === "P" && retryCount < maxRetries) {
          retryCount++;
          verificationTimeout = setTimeout(() => {
            isVerifying = false;
            verifyPayment();
          }, retryDelay);
        } else {
          throw new Error(result.message || "El pago no pudo ser completado");
        }
      } catch (err) {
        if (retryCount < maxRetries) {
          retryCount++;
          verificationTimeout = setTimeout(() => {
            isVerifying = false;
            verifyPayment();
          }, retryDelay);
        } else {
          handleError(err, "verifyPayment");
          cleanupStorage();
          setShouldVerify(false);
          if (
            window.location.pathname.includes("/payment") ||
            window.location.pathname.includes("/checkout")
          ) {
            router.push("/order/cancelled");
          }
        }
      } finally {
        if (retryCount >= maxRetries) {
          setPaymentState(PAYMENT_STATES.IDLE);
          isVerifying = false;
        }
      }
    };

    verifyPayment();

    return () => {
      retryCount = maxRetries;
      isVerifying = false;
      if (verificationTimeout) {
        clearTimeout(verificationTimeout);
      }
    };
  }, [
    searchParams,
    processPayment,
    clearCart,
    router,
    handleError,
    cleanupStorage,
    paymentState,
    shouldVerify,
  ]);

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
};

export { usePayment };
