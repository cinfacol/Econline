import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGetPaymentMethodsQuery } from "@/redux/features/payment/paymentApiSlice";

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
      <RadioGroup
        value={selectedMethod ?? ""}
        onValueChange={onMethodChange}
        className="space-y-2"
      >
        {paymentData.methods.map((method) => (
          <div
            key={method.value}
            className="flex items-center space-x-3 p-3 border rounded-lg"
          >
            <RadioGroupItem
              value={method.value}
              id={`payment-${method.value}`}
            />
            <Label
              htmlFor={`payment-${method.value}`}
              className="flex items-center space-x-3"
            >
              {method.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
