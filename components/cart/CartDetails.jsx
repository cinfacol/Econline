"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetItemsQuery,
  useDecQtyMutation,
  useIncQtyMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} from "@/redux/features/cart/cartApiSlice";
import { CartItemSkeleton } from "@/components/skeletons";
import { EmptyCart } from "./EmptyCart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export default function CartDetails() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { data, isSuccess, isLoading } = useGetItemsQuery();
  const [removeItem] = useRemoveItemMutation();
  const [clearCart] = useClearCartMutation();
  const [decQty] = useDecQtyMutation();
  const [incQty] = useIncQtyMutation();

  const { ids = [], entities = {} } = data || {};
  const items = ids.map((id) => entities[id]).filter(Boolean);
  const subtotal = data?.subtotal ?? 0;
  const cart_total = data?.cart_total ?? 0;
  const discount_amount = data?.discount_amount ?? 0;

  // Remove local calculation useMemo
  // const { taxes, subTotal, total, save } = useMemo(() => {
  //   if (!items?.length) {
  //     return {
  //       taxes: 0,
  //       subTotal: 0,
  //       total: 0,
  //       save: 0,
  //     };
  //   }

  //   return items.reduce(
  //     (acc, item) => {
  //       const itemTax =
  //         item.inventory.taxe * item.inventory.store_price * item.quantity;
  //       const itemSubtotal = item.inventory.store_price * item.quantity;
  //       const itemSavings =
  //         (item.inventory.retail_price - item.inventory.store_price) *
  //         item.quantity;

  //       return {
  //         taxes: acc.taxes + itemTax,
  //         subTotal: acc.subTotal + itemSubtotal - itemTax / items.length,
  //         save: acc.save + itemSavings,
  //         total: acc.total + itemSubtotal,
  //       };
  //     },
  //     { taxes: 0, subTotal: 0, save: 0, total: 0 }
  //   );
  // }, [items]);

  // Handlers optimizados
  const handleCheckoutRedirect = useCallback(async () => {
    setIsRedirecting(true);
    try {
      await Promise.resolve(router.push("/checkout"));
    } catch (error) {
      console.error("Error al redirigir:", error);
    } finally {
      setIsRedirecting(false);
    }
  }, [router]);

  const handleQuantityChange = useCallback(
    async (inventoryId, action) => {
      try {
        if (action === "inc") {
          await incQty({ inventoryId }).unwrap();
          toast.success("Cantidad incrementada");
        } else {
          await decQty({ inventoryId }).unwrap();
          toast.success("Cantidad reducida");
        }
      } catch (error) {
        toast.error(error?.data?.error || "Error al actualizar cantidad");
      }
    },
    [incQty, decQty]
  );

  // Agregar el handler para limpiar el carrito
  const handleCleanCart = useCallback(async () => {
    try {
      await clearCart().unwrap();
      toast.success("Carrito limpiado exitosamente");
    } catch (error) {
      console.error("Error al limpiar el carrito:", error);
      toast.error(error?.data?.error || "Error al limpiar el carrito");
    }
  }, [clearCart]);

  const handleRemove = useCallback(
    async (item) => {
      // Validación inicial mejorada
      if (!item?.id || !item?.inventory?.id) {
        toast.error("Producto no válido");
        return;
      }

      const itemId = item?.inventory?.id;
      const toastId = toast.loading("Eliminando producto...");

      try {
        // Enviar el ID del inventario como espera el backend
        const response = await removeItem({ itemId }).unwrap();

        if (response.success) {
          toast.dismiss(toastId);
          toast.success(
            `${item.inventory.name || "Producto"} eliminado del carrito`
          );
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        toast.dismiss(toastId);

        // Manejar errores específicos según la estructura del backend
        if (error?.data?.error === "Item is not in cart") {
          toast.error("El producto ya no está en el carrito");
          return;
        }

        if (error?.data?.error === "Item ID is required") {
          toast.error("Error al identificar el producto");
          return;
        }

        // Manejar otros errores
        const errorMessage =
          error?.data?.error ||
          error.message ||
          "No se pudo eliminar el producto";

        toast.error(errorMessage);

        // Log detallado con la estructura esperada
        console.error("Error al eliminar producto:", {
          itemId: item.id,
          inventoryId: item.inventory?.id,
          cartId: item.cart,
          error: error?.data || error,
          status: error?.status,
        });
      }
    },
    [removeItem]
  );

  // Estados de carga y error
  if (isLoading) return <CartItemSkeleton count={3} />;
  if (!items?.length) return <EmptyCart />;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Lista de productos */}
      <div className="lg:col-span-8">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={() => handleRemove(item)}
            />
          ))}

          {items.length > 1 && (
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={handleCleanCart}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar carrito
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Resumen del carrito */}
      <div className="lg:col-span-4">
        <CartSummary
          subTotal={subtotal || 0} // Use subtotal from backend
          total={cart_total || 0} // Use cart_total from backend as total
          discountAmount={discount_amount || 0} // Pass discount_amount
          onCheckout={handleCheckoutRedirect}
          isLoading={isRedirecting}
        />
      </div>
    </div>
  );
}
