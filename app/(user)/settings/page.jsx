import CartDetails from "@/components/cart/CartDetails";
export const metadata = {
  title: "Settings | Econline",
  description: "Gestiona tus preferencias y configuraciones de cuenta",
  keywords: "carrito, compras, ecommerce, productos",
  openGraph: {
    title: "Settings | Econline",
    description: "Gestiona tus preferencias y configuraciones de cuenta",
  },
};

export default function SettingsPage() {
  return (
    <section className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Settings
        </h1>
      </header>
    </section>
  );
}
