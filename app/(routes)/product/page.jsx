import Filters from "@/components/layouts/Filters";
import ProductsList from "@/components/products/ProductsList";

export default function ProductPage() {
  // return <ProductsList title="All Products" />;
  return (
    <section className="py-12">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row -mx-4">
          <Filters />

          <main className="md:w-2/3 lg:w-3/4 px-3">
            <ProductsList title="All Products" />
          </main>
        </div>
      </div>
    </section>
  );
}
