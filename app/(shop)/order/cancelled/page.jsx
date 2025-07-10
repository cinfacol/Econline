"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyPaymentQuery, useCancelPaymentMutation } from "@/redux/features/payment/paymentApiSlice";
import { useRemoveAllCouponsMutation } from "@/redux/features/cart/cartApiSlice";
import { toast } from "sonner";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { PaymentStatus } from "@/components/Payment/PaymentStatus";

export default function CancelledPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [paymentId, setPaymentId] = useState(null);
  const [hasVerified, setHasVerified] = useState(false);
  const [isLoadingPaymentId, setIsLoadingPaymentId] = useState(false);
  const [hasCancelled, setHasCancelled] = useState(false);

  const [removeAllCoupons] = useRemoveAllCouponsMutation();
  const [cancelPayment] = useCancelPaymentMutation();

  // 1. Efecto inicial para obtener el payment_id de localStorage o del backend
  useEffect(() => {
    const getPaymentId = async () => {
      let storedPaymentId = localStorage.getItem("payment_id");

      // Si el valor es la cadena 'undefined', bórralo
      if (storedPaymentId === "undefined") {
        localStorage.removeItem("payment_id");
        storedPaymentId = null;
      }

      if (storedPaymentId) {
        setPaymentId(storedPaymentId);
        return;
      }

      if (sessionId) {
        setIsLoadingPaymentId(true);
        try {
          const response = await fetch(
            `/api/payments/get_payment_by_session/?session_id=${sessionId}`
          );
          const data = await response.json();

          if (data.payment_id && data.payment_id !== "undefined") {
            setPaymentId(data.payment_id);
            localStorage.setItem("payment_id", data.payment_id);
          } else {
            throw new Error("No payment_id found in response");
          }
        } catch (error) {
          console.error(
            "[CancelledPage] Error getting payment_id from session:",
            error
          );
          toast.error("No se pudo verificar el pago");
          router.push("/checkout");
        } finally {
          setIsLoadingPaymentId(false);
        }
      } else {
        toast.error("No se pudo verificar el pago");
        router.push("/checkout");
      }
    };

    getPaymentId();
  }, [router, sessionId]);

  // 2. Efecto para cancelar el pago cuando se obtiene el payment_id
  useEffect(() => {
    const handleCancellation = async () => {
      if (!paymentId || hasCancelled) return;

      try {
        console.log("[CancelledPage] Cancelling payment:", paymentId);
        const result = await cancelPayment(paymentId).unwrap();
        
        if (result?.success || result?.message) {
          console.log("[CancelledPage] Payment cancelled successfully:", result);
          setHasCancelled(true);
        } else {
          console.warn("[CancelledPage] Unexpected cancellation response:", result);
        }
      } catch (error) {
        console.error("[CancelledPage] Error cancelling payment:", error);
        // No mostrar error al usuario ya que ya está en la página de cancelación
        // Solo log para debugging
      }
    };

    handleCancellation();
  }, [paymentId, hasCancelled, cancelPayment]);

  // 3. Consulta de verificación
  const {
    data: payment,
    isLoading: isLoadingPayment,
    isError,
  } = useVerifyPaymentQuery(paymentId, {
    skip: !paymentId || paymentId === "undefined" || hasVerified,
  });

  // 4. Efecto para manejar la verificación y limpieza
  useEffect(() => {
    if (payment && !hasVerified) {
      setHasVerified(true);

      // Limpiar cupones del carrito
      const clearCoupons = async () => {
        try {
          await removeAllCoupons().unwrap();
        } catch (error) {
          console.error("Error limpiando cupones:", error);
        }
      };

      // Ejecutar limpieza
      clearCoupons();

      // Limpiar localStorage
      localStorage.removeItem("payment_id");
      sessionStorage.clear();
    }
  }, [payment, hasVerified, removeAllCoupons]);

  // 5. Efecto para manejar errores
  useEffect(() => {
    if (isError && !hasVerified) {
      setHasVerified(true);
      toast.error("Error al verificar el pago");
      router.push("/checkout");
    }
  }, [isError, hasVerified, router]);

  if (isLoadingPaymentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Verificando pago...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error al verificar el pago
          </h1>
          <p className="text-gray-600 mb-6">
            No se pudo verificar el estado de tu pago. Por favor, contacta al
            soporte.
          </p>
          <button
            onClick={() => router.push("/checkout")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Volver al checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pago cancelado
        </h1>

        <p className="text-gray-600 mb-6">
          Tu pago ha sido cancelado. No se ha realizado ningún cargo a tu
          cuenta.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Intentar de nuevo
          </button>

          <button
            onClick={() => router.push("/product")}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Continuar comprando
          </button>
        </div>

        {payment && <PaymentStatus paymentId={paymentId} />}
      </div>
    </div>
  );
}
