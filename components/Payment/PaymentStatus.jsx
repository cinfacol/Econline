"use client";

import { useVerifyPaymentQuery } from "@/redux/features/payment/paymentApiSlice";
import { Spinner } from "@/components/common";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export function PaymentStatus({ paymentId }) {
  const {
    data: payment,
    isLoading,
    isError,
    error,
  } = useVerifyPaymentQuery(paymentId);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        {" "}
        {/* Estilo de error */}
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar estado
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                No se pudo verificar el estado del pago. Inténtalo de nuevo más
                tarde.
              </p>
              {/* Opcional: mostrar detalles del error si es seguro */}
              {/* <p>{error?.data?.detail || error?.message}</p> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-gray-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">
            `Estado del pago con id: {paymentId}`
          </h3>
          <div className="mt-2 text-sm text-gray-500">
            {payment?.status === "P" && "Pendiente"}
            {payment?.status === "C" && "Completado"}
            {payment?.status === "F" && "Fallido"}
            {payment?.status === "X" && "Cancelado"}
            {!["P", "C", "F", "X"].includes(payment?.status) &&
              (payment ? "Estado desconocido" : "No disponible")}
          </div>
        </div>
      </div>
    </div>
  );
}
