import CartDetails from "@/components/cart/CartDetails";
import getAuthCookie from "@/lib/cookies";
import Container from "@/components/ui/container";
import Link from "next/link";

export const metadata = {
  title: "Carrito de Compras | Econline",
  description: "Gestiona los productos en tu carrito de compras",
  keywords: "carrito, compras, ecommerce, productos",
  openGraph: {
    title: "Carrito de Compras | Econline",
    description: "Gestiona los productos en tu carrito de compras",
  },
};

const CartPage = async () => {
  const auth = await getAuthCookie();

  if (!auth) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            No estás autenticado
          </h1>
          <p className="text-gray-500">
            Por favor, inicia sesión para acceder a tu carrito.
          </p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <CartDetails title={metadata.title} />
    </Container>
  );
};

export default CartPage;
