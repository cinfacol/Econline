"use client";

import NoResults from "@/components/ui/no-results";
import {
  useGetInventoriesByCategoryQuery,
  useGetProductQuery,
} from "@/redux/features/inventories/inventoriesApiSlice";
import Loading from "@/components/inventories/loading";
import ProductCard from "./productCard";

// const SuggestedProducts = ({ title, categories, inventoryId }) => {
const SuggestedProducts = ({ title, inventoryId }) => {
  const { data: product } = useGetProductQuery(inventoryId);

  // categories es un array que almacena todas las categorías del product referenciado
  const categorySlug = product?.product?.category?.map((cat) => {
    // key: cat.id,
    return cat?.slug;
  });

  const {
    data: category,
    error,
    isLoading,
  } = useGetInventoriesByCategoryQuery(categorySlug);
  const { ids = [] } = category || {};
  const { entities = [] } = category || {};

  // Handle loading and error states
  if (isLoading) return <Loading />;
  // if (error) return <Error message={error.message} />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title}</h3>
      {ids?.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ids?.map((id) => {
          const Item = entities[id];

          if (Item.id !== inventoryId) {
            return <ProductCard key={Item?.index} data={Item} />;
          }
        })}
      </div>
    </div>
  );
};

export default SuggestedProducts;
