import { useVerifyPaymentQuery } from "@/redux/features/payment/paymentApiSlice";
import { Spinner } from "@/components/ui/spinner";

export function PaymentStatus({ paymentId }) {
  const { data: payment, isLoading } = useVerifyPaymentQuery(paymentId);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="rounded-md bg-gray-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">Estado del pago</h3>
          <div className="mt-2 text-sm text-gray-500">
            {payment?.status === "P" && "Pendiente"}
            {payment?.status === "C" && "Completado"}
            {payment?.status === "F" && "Fallido"}
          </div>
        </div>
      </div>
    </div>
  );
}
