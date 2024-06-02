"use client";

import {
  useAddItemToCartMutation,
  useGetItemsQuery,
} from "@/redux/features/cart/cartApiSlice";
import IconButton from "@/components/ui/icon-button";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";

const AddItem = ({ data, access, ButtonComponent }) => {
  const { data: cartId } = useGetItemsQuery();
  const [addItem, { isLoading, error }] = useAddItemToCartMutation();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const acceso = access;

  const onAddToCart = async () => {
    const id = cartId?.ids[0];
    const cart_id = cartId?.entities[id]?.cart;
    const inventory_id = data?.id;
    const quantity = 1;
    const coupon = {};
    const newItem = { cart_id, inventory_id, quantity, coupon };
    try {
      await addItem({ newItem, acceso })
        .unwrap()
        .then((payload) => toast.success("Product added successfully"))
        .catch((error) => toast.error(`${error.error}`));
    } catch (err) {
      toast.error(`Error: ${error?.data?.error}`);
    }
  };

  const renderButton = () => {
    // Check if buttonComponent is provided
    if (ButtonComponent) {
      return <ButtonComponent onClick={onAddToCart} />;
    } else {
      // Use default IconButton if no custom button provided
      return (
        <div>
          <Button
            isIconOnly
            color="default"
            variant="faded"
            aria-label="ShoppingCart"
            onClick={onAddToCart}
          >
            {<ShoppingCart size={20} className="text-gray-600" />}
          </Button>
        </div>
      );
    }
  };

  return <div>{renderButton()}</div>;
};

export default AddItem;
