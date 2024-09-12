"use client";

import {
  useAddItemToCartMutation,
  useGetItemsQuery,
} from "@/redux/features/cart/cartApiSlice";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
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
      return (
        <div>
          <Button
            color="primary"
            variant="shadow"
            aria-label="Add To Cart"
            onClick={onAddToCart}
            className="font-bold"
          >
            Add To Cart
            <span className="px-2">
              {<ShoppingCart size={20} className="text-white-600" />}
            </span>
          </Button>
        </div>
      );
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
