import Filters from "@/components/layouts/Filters";
import InventoriesList from "@/components/inventories/InventoriesList";

export default function ProductPage() {
  return (
    <section className="py-12">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row -mx-4">
          <Filters />
          <main className="md:w-2/3 lg:w-3/4 px-3">
            <InventoriesList title="All Products" />
          </main>
        </div>
      </div>
    </section>
  );
}
