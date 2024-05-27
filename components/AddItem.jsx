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

const AddItem = ({ data, access }) => {
  const { data: cartId } = useGetItemsQuery();
  const [addItem, { isLoading, error }] = useAddItemToCartMutation();
  const router = useRouter();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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

  return (
    <div>
      <IconButton
        onClick={
          isAuthenticated
            ? onAddToCart
            : () => {
                router.push("/auth/login");
              }
        }
        icon={<ShoppingCart size={20} className="text-gray-600" />}
      />
    </div>
  );
};

export default AddItem;
