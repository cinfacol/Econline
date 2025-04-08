"use client";

import { useRouter } from "next/navigation";
import { XCircleIcon } from "@heroicons/react/24/outline";

export default function CancelledPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Pago cancelado
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          El proceso de pago ha sido cancelado.
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
