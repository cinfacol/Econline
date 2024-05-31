import CartDetails from "@/components/cart/CartDetails";
import { getAuthCookie } from "@/lib/cookies";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = () => {
  const auth = getAuthCookie()?.cookie?.value;

  return <CartDetails title="Shopping Cart" auth={auth} />;
};

export default CartPage;
