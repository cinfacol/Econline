import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 1,
  maxQuantity = 99,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onDecrease}
        disabled={disabled || quantity <= minQuantity}
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Reducir cantidad</span>
      </Button>

      <span className="min-w-[2rem] text-center font-medium">{quantity}</span>

      <Button
        variant="outline"
        size="icon"
        onClick={onIncrease}
        disabled={disabled || quantity >= maxQuantity}
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Aumentar cantidad</span>
      </Button>
    </div>
  );
}
