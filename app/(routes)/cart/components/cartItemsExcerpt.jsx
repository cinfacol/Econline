import { useGetItemsQuery } from "@/redux/features/cart/cartApiSlice";
import CartItemCard from "./CartItemCard";

function CartItemsExcerpt({ itemId }) {
  const { item } = useGetItemsQuery("getItems", {
    selectFromResult: ({ data }) => ({
      item: data?.entities[itemId],
    }),
  });

  return (
    <>
      {item?.length === 0 && <NoResults />}
      <CartItemCard key={item?.id} item={item} />
    </>
  );
}

export default CartItemsExcerpt;
