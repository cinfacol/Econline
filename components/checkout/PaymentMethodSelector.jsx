import { useGetPaymentMethodsQuery } from "@/redux/features/payment/paymentApiSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PaymentMethodSelector({ selectedMethod, onMethodChange }) {
  const { data: paymentData, isLoading, error } = useGetPaymentMethodsQuery();

  if (isLoading) {
    return <div className="p-4">Cargando métodos de pago...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error al cargar métodos de pago</div>
    );
  }

  if (!paymentData?.methods?.length) {
    return (
      <div className="p-4">
        <p className="text-gray-600">No hay métodos de pago disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Seleccionar método de pago</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paymentData.methods.map((method) => {
          const isSelected = selectedMethod === method.key;
          return (
            <button
              type="button"
              key={method.key}
              onClick={() => onMethodChange(method.key)}
              className={`w-full text-left rounded-lg border p-4 transition
                ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50 shadow"
                    : "border-gray-300 bg-white hover:border-blue-400"
                }
                focus:outline-none`}
            >
              <div className="flex items-center space-x-3">
                <figure className="flex items-start sm:items-center">
                  <div className="relative">
                    <Avatar className="h-15 w-15">
                      <AvatarImage src={method.icon_image} alt={method.label} />
                      <AvatarFallback>{method.key}</AvatarFallback>
                    </Avatar>
                  </div>
                </figure>
                <span className="font-semibold">{method.label}</span>
                {isSelected && (
                  <span className="ml-auto text-blue-600 font-bold">✓</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
