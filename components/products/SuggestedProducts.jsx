"use client";

import NoResults from "@/components/ui/no-results";
import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";
import ProductsExcerpt from "@/components/products/ProductsExcerpt";

const SuggestedProducts = ({ title, category }) => {
  const { products } = useGetProductsQuery("getProducts", {
    selectFromResult: ({ data }) => ({
      products: data?.ids?.filter(
        (productId) => data?.entities[productId]?.category === category
      ),
    }),
  });
  const productsIds = products;
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title}</h3>
      {productsIds?.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productsIds?.map((productId) => (
          <ProductsExcerpt key={productId} productId={productId} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
