import CartDetails from "@/components/cart/CartDetails";
export const metadata = {
  title: "Carrito de Compras | Econline",
  description: "Gestiona los productos en tu carrito de compras",
  keywords: "carrito, compras, ecommerce, productos",
  openGraph: {
    title: "Carrito de Compras | Econline",
    description: "Gestiona los productos en tu carrito de compras",
  },
};

export default function CartPage() {
  return (
    <section className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Shopping Cart
        </h1>
      </header>
      <CartDetails />
    </section>
  );
}
