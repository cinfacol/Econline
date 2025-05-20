import Link from "next/link";
import { MoveRight, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Componente interno para las filas del resumen
function SummaryRow({ label, value, className, strikethrough = false }) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={cn(
          "font-medium",
          strikethrough && "line-through decoration-red-500"
        )}
      >
        {new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "USD",
        }).format(value)}
      </span>
    </div>
  );
}

export function CartSummary({
  subTotal,
  taxes,
  total,
  savings,
  onCheckout,
  isLoading,
}) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
      <h2 className="text-lg font-semibold">Resumen del pedido</h2>

      <div className="mt-6 space-y-4">
        <SummaryRow label="Subtotal" value={subTotal} />
        <SummaryRow label="Impuestos" value={taxes} />
        {savings > 0 && (
          <SummaryRow
            label="Ahorro"
            value={savings}
            className="text-green-600"
            strikethrough
          />
        )}
        <SummaryRow
          label="Total"
          value={total}
          className="text-lg font-bold border-t pt-4"
        />
      </div>

      <div className="mt-6 space-y-4">
        <Button
          variant="warning"
          className="w-full"
          onClick={onCheckout}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirigiendo...
            </span>
          ) : (
            "Proceder al pago"
          )}
        </Button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-500">o</span>
          <Link href="/product" className={buttonVariants({ variant: "link" })}>
            Seguir comprando <MoveRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
