"use client";

import { NoResults, Skeleton } from "@/components/ui";
import {
  useGetInventoriesByCategoryQuery,
  useGetProductQuery,
} from "@/redux/features/inventories/inventoriesApiSlice";
import ProductCard from "./productCard";

const SuggestedProducts = ({ title, inventoryId }) => {
  const { data: product } = useGetProductQuery(inventoryId);

  const categorySlug = product?.product?.category?.map((cat) => cat?.slug);

  const {
    data: category,
    error,
    isLoading,
  } = useGetInventoriesByCategoryQuery(categorySlug);

  // Destructure data and handle empty category case concisely
  const { ids = [], entities = {} } = category || {};

  // Handle loading and error states
  if (isLoading) return <Skeleton />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title}</h3>
      {ids?.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from(
          new Map(
            ids
              .filter((id) => id !== inventoryId)
              .map((id) => entities[id])
              .filter((item) => item && item.id)
              .map((item) => [item.id, item])
          ).values()
        ).map((Item) => (
          <ProductCard key={Item.id} data={Item} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
