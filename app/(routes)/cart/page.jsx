import CartList from "./components/CartList";
// import { cookies } from "next/headers";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = () => {
  // const cookieStore = cookies();
  // const access = cookieStore.get("access");
  return <CartList title="Shopping Cart" />;
};

export default CartPage;
