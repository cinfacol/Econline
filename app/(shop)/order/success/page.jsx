"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVerifyPaymentQuery } from "@/redux/features/payment/paymentApiSlice";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SuccessPage() {
  const router = useRouter();
  const paymentId = new URLSearchParams(window.location.search).get(
    "payment_id"
  );

  const { data: payment, isLoading } = useVerifyPaymentQuery(paymentId);

  useEffect(() => {
    if (payment?.status === "C") {
      setTimeout(() => router.push("/dashboard/orders"), 3000);
    }
  }, [payment, router]);

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
