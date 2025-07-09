"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyPaymentQuery } from "@/redux/features/payment/paymentApiSlice";
import {
  useClearCartMutation,
  useRemoveAllCouponsMutation,
} from "@/redux/features/cart/cartApiSlice";
import { toast } from "sonner";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { PaymentStatus } from "@/components/Payment/PaymentStatus";

export default function CancelledPage() {
  const router = useRouter();
  const [paymentId, setPaymentId] = useState(null);
  const [hasVerified, setHasVerified] = useState(false);
  const [clearCart] = useClearCartMutation();
  const [removeAllCoupons] = useRemoveAllCouponsMutation();

  // 1. Efecto inicial para verificar el pago
  useEffect(() => {
    const storedPaymentId = localStorage.getItem("payment_id");

    if (storedPaymentId) {
      setPaymentId(storedPaymentId);
    } else {
      toast.error("No se pudo verificar el pago");
      router.push("/checkout");
    }
  }, [router]);

  // 2. Consulta de verificación
  const {
    data: payment,
    isLoading,
    isError,
  } = useVerifyPaymentQuery(paymentId, {
    skip: !paymentId || hasVerified,
  });

  // 3. Efecto para manejar la verificación y limpieza
  useEffect(() => {
    if (payment && !hasVerified) {
      setHasVerified(true);

      // Limpiar cupones del carrito
      const clearCoupons = async () => {
        try {
          await removeAllCoupons().unwrap();
          console.log("Cupones limpiados exitosamente");
        } catch (error) {
          console.error("Error limpiando cupones:", error);
        }
      };

      // Limpiar carrito
      const clearUserCart = async () => {
        try {
          await clearCart().unwrap();
          console.log("Carrito limpiado exitosamente");
        } catch (error) {
          console.error("Error limpiando carrito:", error);
        }
      };

      // Ejecutar limpieza
      clearCoupons();
      clearUserCart();

      // Limpiar localStorage
      localStorage.removeItem("payment_id");
      sessionStorage.clear();
    }
  }, [payment, hasVerified, removeAllCoupons, clearCart]);

  // 4. Efecto para manejar errores
  useEffect(() => {
    if (isError && !hasVerified) {
      setHasVerified(true);
      toast.error("Error al verificar el pago");
      router.push("/checkout");
    }
  }, [isError, hasVerified, router]);

  if (isLoading) {
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

        {payment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Detalles del pago:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>ID de Orden:</strong> {payment.order_id}
              </p>
              <p>
                <strong>Monto:</strong> ${payment.amount}
              </p>
              <p>
                <strong>Estado:</strong> {payment.status_display}
              </p>
            </div>
          </div>
        )}

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

        {payment && <PaymentStatus payment={payment} />}
      </div>
    </div>
  );
}
