import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import {
  useCreateCheckoutSessionMutation,
  useProcessPaymentMutation,
  useVerifyPaymentQuery,
} from "@/redux/features/payment/paymentApiSlice";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export function usePayment() {
  const router = useRouter();
  const [paymentId, setPaymentId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [processPayment] = useProcessPaymentMutation();
  const { data: paymentStatus } = useVerifyPaymentQuery(paymentId, {
    skip: !paymentId,
    pollingInterval: 2000,
  });

  const handlePayment = useCallback(
    async (formData) => {
      try {
        setIsProcessing(true);

        // 1. Crear sesión de checkout
        const result = await createCheckoutSession({
          shipping_id: formData.shipping_id,
          payment_option: "S", // Stripe
        }).unwrap();

        setPaymentId(result.payment_id);

        // 2. Redireccionar a Stripe
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: result.sessionId,
        });

        if (error) throw new Error(error.message);
      } catch (err) {
        toast.error(err.data?.error || "Error al procesar el pago");
        setIsProcessing(false);
      }
    },
    [createCheckoutSession]
  );

  // Verificar estado cuando regresa de Stripe
  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );

      if (sessionId && paymentId) {
        try {
          const result = await processPayment(paymentId).unwrap();

          if (result.status === "success") {
            toast.success("Pago procesado exitosamente");
            router.push("/order/success");
          } else {
            toast.error("Error al procesar el pago");
            router.push("/order/cancelled");
          }
        } catch (err) {
          toast.error(err.data?.error || "Error al verificar el pago");
          router.push("/order/cancelled");
        } finally {
          setIsProcessing(false);
        }
      }
    };

    verifyPayment();
  }, [paymentId, processPayment, router]);

  return {
    handlePayment,
    isProcessing,
    paymentStatus,
  };
}
