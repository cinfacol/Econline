"use client";

import NoResults from "@/components/ui/no-results";
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import InventoriesExcerpt from "@/components/inventories/InventoriesExcerpt";

const SuggestedProducts = ({ title, category }) => {
  const { products } = useGetInventoriesQuery("getInventories", {
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
          <InventoriesExcerpt key={productId} productId={productId} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
