"use client";

import NoResults from "@/components/ui/no-results";
import {
  useGetInventoriesByCategoryQuery,
  useGetProductQuery,
} from "@/redux/features/inventories/inventoriesApiSlice";
import Loading from "@/components/inventories/loading";
import ProductCard from "./productCard";

const SuggestedProducts = ({ title, inventoryId, auth }) => {
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
  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title}</h3>
      {ids?.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ids?.map((id) => {
          const Item = entities[id];

          if (Item.id !== inventoryId) {
            return <ProductCard key={Item?.id} data={Item} auth={auth} />;
          }
        })}
      </div>
    </div>
  );
};

export default SuggestedProducts;
