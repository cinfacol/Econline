import Filters from "@/components/layouts/Filters";
import InventoriesList from "@/components/inventories/InventoriesList";
import getAuthCookie from "@/lib/cookies";

export const metadata = {
  title: "Products" || process.env.NEXT_PUBLIC_APP_NAME,
  description: "Products Page in a Modern Ecommerce App",
};

export default async function ProductPage() {
  const auth = await getAuthCookie();

  return (
    <section className="py-12">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row -mx-4">
          <Filters />
          <main className="md:w-2/3 lg:w-3/4 px-3">
            <InventoriesList title="All Products" auth={auth} />
          </main>
        </div>
      </div>
    </section>
  );
}
