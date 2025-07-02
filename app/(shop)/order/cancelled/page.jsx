"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useGetPaymentBySessionQuery } from "@/redux/features/payment/paymentApiSlice";
import { useEffect } from "react";

export default function CancelledPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const errorCode = searchParams.get("error_code");

  // Obtener información del pago usando el session_id
  const { data: paymentInfo, isLoading, error } = useGetPaymentBySessionQuery(sessionId, {
    skip: !sessionId,
  });

  const getErrorMessage = (code) => {
    switch (code) {
      case "card_declined":
        return "Tu tarjeta fue rechazada. Por favor, intenta con otra.";
      case "insufficient_funds":
        return "No había fondos suficientes para completar la transacción.";
      default:
        return "El proceso de pago ha sido cancelado o ha fallado.";
    }
  };

  // Si no hay session_id, mostrar mensaje genérico
  if (!sessionId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Pago cancelado
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorMessage(errorCode)}
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/checkout")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si está cargando, mostrar loading
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Verificando estado del pago...</p>
        </div>
      </div>
    );
  }

  // Si hay error, mostrar mensaje de error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Error al verificar el pago
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            No se pudo verificar el estado del pago. Por favor, contacta soporte.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push("/checkout")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Volver al checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si tenemos información del pago, mostrar detalles
  if (paymentInfo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Pago cancelado
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorMessage(errorCode)}
          </p>

          {/* Información adicional del pago */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Detalles del pago
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">ID de pago:</span> {paymentInfo.payment_id}</p>
              <p><span className="font-medium">ID de orden:</span> {paymentInfo.order_id}</p>
              <p><span className="font-medium">Monto:</span> ${paymentInfo.amount} {paymentInfo.currency}</p>
              <p><span className="font-medium">Estado:</span> {paymentInfo.status_display}</p>
              <p><span className="font-medium">Estado de orden:</span> {paymentInfo.order_status_display}</p>
            </div>
          </div>

          <div className="mt-6 space-x-4">
            <button
              onClick={() => router.push("/checkout")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Intentar nuevamente
            </button>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Pago cancelado
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {getErrorMessage(errorCode)}
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/checkout")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    </div>
  );
}
