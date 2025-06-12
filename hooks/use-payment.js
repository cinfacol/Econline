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

      // Limpiar cualquier estado anterior antes de iniciar un nuevo pago
      cleanupStorage();
      setPaymentState(PAYMENT_STATES.PROCESSING);
      setError(null);
      setShouldVerify(true);

      try {
        if (!formData?.shipping_id || !formData?.payment_method_id) {
          throw new Error("Datos de pago incompletos");
        }

        const result = await createCheckoutSession({
          shipping_id: formData.shipping_id,
          payment_method_id: formData.payment_method_id,
        }).unwrap();

        if (!result?.payment_id) {
          throw new Error("No se recibió un ID de pago válido");
        }

        // Guardar el payment_id en ambos storages
        sessionStorage.setItem(STORAGE_KEYS.PAYMENT_ID, result.payment_id);
        localStorage.setItem(STORAGE_KEYS.PAYMENT_ID_LOCAL, result.payment_id);

        if ((formData.payment_option === "SC" || result?.is_stripe) && result?.sessionId) {
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
        console.error("Error en handlePayment:", err);
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
      // Solo verificar si shouldVerify es true
      if (!shouldVerify) {
        console.log('No hay verificación pendiente');
        return;
      }

      // Prevent multiple simultaneous verifications
      if (isVerifying) {
        console.log('Ya hay una verificación en proceso');
        return;
      }

      const sessionId = searchParams.get("session_id") || sessionStorage.getItem(STORAGE_KEYS.PAYMENT_INTENT);
      const storedPaymentId = sessionStorage.getItem(STORAGE_KEYS.PAYMENT_ID) || localStorage.getItem(STORAGE_KEYS.PAYMENT_ID_LOCAL);

      console.log('Verificando pago:', {
        sessionId,
        storedPaymentId,
        paymentState,
        shouldVerify,
        searchParams: Object.fromEntries(searchParams.entries())
      });

      // Si no hay datos de pago activos, limpiar y salir
      if (!sessionId && !storedPaymentId) {
        console.log('No hay datos de pago activos, limpiando storage');
        cleanupStorage();
        setShouldVerify(false);
        return;
      }

      // Si ya estamos en estado de procesamiento, no verificar de nuevo
      if (paymentState === PAYMENT_STATES.PROCESSING) {
        console.log('Ya estamos procesando un pago');
        return;
      }

      isVerifying = true;
      setPaymentState(PAYMENT_STATES.PROCESSING);

      try {
        console.log('Procesando pago con ID:', storedPaymentId);
        const result = await processPayment(storedPaymentId).unwrap();
        console.log('Resultado del pago:', result);

        if (result.status === "success" || result.payment_status === "C" || result.message === "Payment already completed") {
          setPaymentState(PAYMENT_STATES.SUCCESS);
          localStorage.setItem(STORAGE_KEYS.PAYMENT_STATUS, "success");
          
          try {
            await clearCart().unwrap();
            toast.success("Carrito limpiado exitosamente");
          } catch (cartErr) {
            console.error('Error al limpiar el carrito:', cartErr);
            toast.error("El pago fue exitoso, pero no se pudo limpiar el carrito.");
          }

          cleanupStorage();
          setShouldVerify(false);
          toast.success("Pago procesado exitosamente");
          router.push("/order/success");
        } else if (result.status === "P" && retryCount < maxRetries) {
          retryCount++;
          console.log(`Pago pendiente, reintentando (${retryCount}/${maxRetries})`);
          verificationTimeout = setTimeout(() => {
            isVerifying = false;
            verifyPayment();
          }, retryDelay);
        } else {
          throw new Error(result.message || "El pago no pudo ser completado");
        }
      } catch (err) {
        console.error('Error en verificación de pago:', err);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Error en verificación, reintentando (${retryCount}/${maxRetries})`);
          verificationTimeout = setTimeout(() => {
            isVerifying = false;
            verifyPayment();
          }, retryDelay);
        } else {
          handleError(err, "verifyPayment");
          cleanupStorage();
          setShouldVerify(false);
          // Solo redirigir a cancelled si estamos en una página de pago
          if (window.location.pathname.includes('/payment') || window.location.pathname.includes('/checkout')) {
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
  }, [searchParams, processPayment, clearCart, router, handleError, cleanupStorage, paymentState, shouldVerify]);

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

export { usePayment };
