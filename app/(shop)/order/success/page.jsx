"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useVerifyPaymentQuery } from "@/redux/features/payment/paymentApiSlice";
import { useClearCartMutation } from "@/redux/features/cart/cartApiSlice";
import { toast } from "sonner";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { PaymentStatus } from "@/components/Payment/PaymentStatus";

export default function SuccessPage() {
  const router = useRouter();
  const [paymentId, setPaymentId] = useState(null);
  const [cartCleared, setCartCleared] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [clearCart] = useClearCartMutation();

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

  // 2. Consulta de verificación (sin polling)
  const {
    data: payment,
    isLoading,
    isError,
  } = useVerifyPaymentQuery(paymentId, {
    skip: !paymentId || hasVerified,
  });

  // 3. Efecto para manejar la verificación y limpieza
  useEffect(() => {
    const handleVerification = async () => {
      if (payment?.status === "P" && !hasVerified) {
        try {
          await clearCart().unwrap();
          setHasVerified(true);
          setCartCleared(true);

          // Limpiar localStorage
          localStorage.removeItem("payment_id");

          toast.success("¡Pago confirmado y carrito limpiado!");

          // Redirigir después de un momento
          /* setTimeout(() => {
            router.push("/dashboard/orders");
          }, 2000); */
        } catch (error) {
          console.error("Error al limpiar el carrito:", error);
          toast.error("Error al limpiar el carrito");
        }
      }
    };

    handleVerification();
  }, [payment, clearCart, hasVerified, router]);

  // 4. Efecto de limpieza
  useEffect(() => {
    return () => {
      if (cartCleared) {
        localStorage.removeItem("payment_id");
      }
    };
  }, [cartCleared]);

  if (isLoading || !paymentId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full">
          <span className="sr-only">Cargando...</span>
        </div>
        <p className="mt-4">Verificando el pago...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          ¡Pago exitoso!
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Tu orden ha sido procesada correctamente.
        </p>
        <div>
          <h1>¡Gracias por tu compra!</h1>
          <PaymentStatus paymentId={paymentId} />
        </div>
        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard/orders")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Ver mis órdenes
          </button>
        </div>
      </div>
    </div>
  );
}
