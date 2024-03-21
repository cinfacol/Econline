"use client";

import NoResults from "@/components/ui/no-results";
import { useGetInventoriesByCategoryQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import InventoriesExcerpt from "@/components/inventories/InventoriesExcerpt";
import Loading from "@/components/inventories/loading";

const SuggestedProducts = ({ title, categories }) => {
  const { data, error, isLoading } =
    useGetInventoriesByCategoryQuery(categories);

  // Get unique inventory IDs
  const obj_data = data?.ids;

  // Handle loading and error states
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  // Extract inventories based on categories
  /* const inventories = data?.results?.filter((inventory) => {
    return categories.includes(inventory.category.name);
  }); */

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title}</h3>
      {obj_data?.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {obj_data?.map((inventoryId) => (
          <InventoriesExcerpt key={inventoryId} productId={inventoryId} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
