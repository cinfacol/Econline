import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import {
  useCreateCheckoutSessionMutation,
  useProcessPaymentMutation,
  // useVerifyPaymentQuery,
} from "@/redux/features/payment/paymentApiSlice";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// Clave para sessionStorage
const PAYMENT_ID_STORAGE_KEY = "pendingPaymentId";

export function usePayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [paymentId, setPaymentId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [processPayment] = useProcessPaymentMutation();
  /* const { data: paymentStatus } = useVerifyPaymentQuery(paymentId, {
    skip: !paymentId,
    pollingInterval: 2000,
  }); */

  const handlePayment = useCallback(
    async (formData) => {
      setIsProcessing(true);
      let paymentIdToPersist = null;

      try {
        // 1. Crear sesión de checkout
        const result = await createCheckoutSession({
          shipping_id: formData.shipping_id,
          payment_option: "S", // Stripe
        }).unwrap();

        paymentIdToPersist = result.payment_id;

        if (!paymentIdToPersist) {
          throw new Error("No se recibió payment_id del backend.");
        }

        // 2. Persistir paymentId ANTES de redirigir
        sessionStorage.setItem(PAYMENT_ID_STORAGE_KEY, paymentIdToPersist);

        // 3. Redireccionar a Stripe
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe.js no se cargó correctamente.");
        }
        const { error } = await stripe.redirectToCheckout({
          sessionId: result.sessionId,
        });

        // Si redirectToCheckout falla, lanzará un error
        if (error) {
          sessionStorage.removeItem(PAYMENT_ID_STORAGE_KEY);
          throw new Error(error.message);
        }
      } catch (err) {
        console.error("Error en handlePayment:", err);
        sessionStorage.removeItem(PAYMENT_ID_STORAGE_KEY); // Limpiar en cualquier error
        const errorMessage =
          err?.data?.error ||
          err?.data?.detail ||
          err?.message ||
          "Error al iniciar el proceso de pago";
        toast.error(errorMessage);
        setIsProcessing(false);
      }
    },
    [createCheckoutSession]
  );

  // Verificar estado cuando regresa de Stripe
  useEffect(() => {
    const verifyOnReturn = async () => {
      const sessionId = searchParams.get("session_id");
      const storedPaymentId = sessionStorage.getItem(PAYMENT_ID_STORAGE_KEY);

      if (sessionId && storedPaymentId) {
        setIsProcessing(true);
        try {
          // Limpiar el ID de sessionStorage INMEDIATAMENTE para evitar reprocesamiento
          sessionStorage.removeItem(PAYMENT_ID_STORAGE_KEY);

          const result = await processPayment(storedPaymentId).unwrap();

          // Asumiendo que el backend devuelve un estado claro
          if (result.status === "success" || result.payment_status === "C") {
            // Ajustar según respuesta real
            toast.success("Pago procesado exitosamente");
            router.push("/order/success");
          } else {
            const failureReason =
              result.message || "El pago no pudo ser completado.";
            toast.error(`Error al procesar el pago: ${failureReason}`);
            router.push("/order/cancelled");
          }
        } catch (err) {
          console.error("Error en verifyOnReturn:", err);
          sessionStorage.removeItem(PAYMENT_ID_STORAGE_KEY); // Asegurar limpieza en error
          const errorMessage =
            err?.data?.error ||
            err?.data?.detail ||
            err?.message ||
            "Error al verificar el pago";
          toast.error(errorMessage);
          router.push("/order/cancelled");
        } finally {
          setIsProcessing(false);
        }
      }
    };

    verifyOnReturn();
  }, [searchParams, processPayment, router]);

  return {
    handlePayment,
    isProcessing,
  };
}
