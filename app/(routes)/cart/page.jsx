import CartDetails from "@/components/cart/CartDetails";
import getAuthCookie from "@/lib/cookies";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = async () => {
  const auth = await getAuthCookie();

  if (!auth) {
    return (
      <div>
        <h1>No estás autenticado</h1>
        <p>Por favor, inicia sesión para acceder a tu carrito.</p>
      </div>
    );
  }

  return <CartDetails title={metadata.title} auth={auth} />;
};

export default CartPage;
