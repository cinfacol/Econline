import Link from "next/link";
import { MoveRight, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Componente interno para las filas del resumen
function SummaryRow({
  label,
  value,
  className,
  strikethrough = false,
  smallValue = false,
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <span className="text-sm text-gray-500">{label}</span>
      <span
        className={cn(
          "font-medium",
          smallValue && "text-sm",
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
  total,
  totalProducts, // Accept totalProducts prop
  discountAmount, // Accept discountAmount prop
  onCheckout,
  isLoading,
}) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
      <h2 className="text-lg font-semibold">Resumen de la Compra</h2>

      <div className="mt-6 space-y-4">
        <SummaryRow
          label={
            <span>
              Productos
              <span className="ml-1 text-xs text-gray-400">
                ({totalProducts})
              </span>
            </span>
          }
          value={subTotal}
          smallValue={true}
        />
        {/* Remove Impuestos row as it's not provided by backend in this context */}
        {discountAmount > 0 && ( // Show discount if greater than 0
          <SummaryRow
            label="Descuento"
            value={discountAmount}
            className="text-green-600"
            smallValue={true}
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
            "Proceed to Checkout"
          )}
        </Button>

        <div className="flex items-center justify-center gap-2">
          <Link
            href="/products"
            className={buttonVariants({ variant: "link" })}
          >
            Seguir comprando <MoveRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
