"use client";

import {
  useAddItemToCartMutation,
  useGetItemsQuery,
} from "@/redux/features/cart/cartApiSlice";
import IconButton from "@/components/ui/icon-button";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

const AddItem = ({ data, access }) => {
  const { data: cartId } = useGetItemsQuery();
  const [addItem, { isLoading, error }] = useAddItemToCartMutation();

  // console.log("access", access);

  if (error) {
    return <h1>ERRROR</h1>;
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const acceso = access;

  const onAddToCart = async () => {
    // console.log("agregar al carrito");
    const id = cartId?.ids[0];
    const cart_id = cartId?.entities[id]?.cart;
    const inventory_id = data?.id;
    const quantity = 1;
    const coupon = {};
    const newItem = { cart_id, inventory_id, quantity, coupon };
    try {
      await addItem({ newItem, acceso });
      toast.success("Todo bien");
    } catch (err) {
      console.log("error", err);
      toast.error(`Error: ${error?.data?.error}`);
    }
  };

  return (
    <div>
      <IconButton
        onClick={onAddToCart}
        icon={<ShoppingCart size={20} className="text-gray-600" />}
      />
    </div>
  );
};

export default AddItem;
