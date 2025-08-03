import AddressDefault from "@/components/user/Addressdefault";
import { Container } from "@/components/ui";
import Link from "next/link";
import AddProductsButton from "@/components/settings/AddProductsButton";

export const metadata = {
  title: "Settings | Econline",
  description: "Gestiona tus preferencias y configuraciones de cuenta",
  keywords: "carrito, compras, ecommerce, productos",
  openGraph: {
    title: "Settings | Econline",
    description: "Gestiona tus preferencias y configuraciones de cuenta",
  },
};

const SettingsPage = async () => {
  return (
    <Container className="bg-white overflow-hidden">
      <div className="relative isolate px-6 pt-2 lg:px-8">
        <header className="text-center py-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white mt-8 mb-8 rounded-xl">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Settings
          </h2>
        </header>
      </div>
      <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
        <AddProductsButton />
      </article>
      <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
        <h2 className="text-2xl font-semibold mb-4">Direcciones</h2>
        <AddressDefault />
      </article>
    </Container>
  );
};

export default SettingsPage;
