import CartDetails from "@/components/cart/CartDetails";
import { getAuthCookie } from "@/lib/cookies";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = () => {
  const auth = getAuthCookie()?.cookie?.value;

  return auth ? (
    <CartDetails title="Shopping Cart" auth={auth} />
  ) : (
    console.log("Page Cart, no estás authenticado")
  );
};

export default CartPage;
