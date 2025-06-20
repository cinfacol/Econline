import Shipping from "@/components/shipping/Shipping";

export default function ShippingPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Detalles del Envío</h1>
      <Shipping />
    </div>
  );
}
