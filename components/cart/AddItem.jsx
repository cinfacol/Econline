"use client";

import { useAddItemToCartMutation } from "@/redux/features/cart/cartApiSlice";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AddItem = ({ data, access, ButtonComponent }) => {
  const [addItem, { isLoading }] = useAddItemToCartMutation();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const token = access;

  const onAddToCart = async () => {
    const inventory_id = data?.id;
    const quantity = 1;

    try {
      const result = await addItem({ inventory_id, quantity }).unwrap();

      if (result.success) {
        toast.success("Producto agregado al carrito exitosamente");
      } else {
        toast.error(result.error || "Error al agregar el producto");
      }
    } catch (error) {
      // El error ya viene transformado desde el slice
      if (error?.error) {
        toast.error(error.error);
      } else if (error?.data?.error) {
        // Fallback para errores no transformados
        toast.error(error.data.error);
      } else if (error?.message) {
        // Fallback para errores con message
        toast.error(error.message);
      } else {
        toast.error("Error al agregar el producto al carrito");
      }
    }
  };

  const renderButton = () => {
    if (ButtonComponent) {
      return (
        <Button onClick={onAddToCart}>
          <ShoppingCart /> Add To Cart
        </Button>
      );
    } else {
      return (
        <Button variant="outline" size="icon" onClick={onAddToCart}>
          {<ShoppingCart />}
        </Button>
      );
    }
  };

  return <div>{renderButton()}</div>;
};

export default AddItem;
