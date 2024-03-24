"use client";

import NoResults from "@/components/ui/no-results";
import {
  useGetInventoriesByCategoryQuery,
  useGetInventoriesQuery,
} from "@/redux/features/inventories/inventoriesApiSlice";
import Loading from "@/components/inventories/loading";
import { useGetEntity } from "@/hooks";
import ProductCard from "../ui/productCard";

// const SuggestedProducts = ({ title, categories, inventoryId }) => {
const SuggestedProducts = ({ title, inventoryId }) => {
  const { data } = useGetInventoriesQuery("getInventories");
  // Destructure data and handle empty inventory case concisely
  const { ids = [] } = data || {}; // Default to empty array
  const { entities = [] } = data || {}; // Default to empty array

  // useGetEntity es un hook que recibe el id de un inventory y devuelve toda la información relacionada con ese inventory
  const entitie = useGetEntity(inventoryId);

  // categories es un array que almacena el slug de todas las categorías del inventory -> product referenciado
  const categories = entitie?.product?.category?.map((cat) => {
    return cat.slug;
  });
  const {
    data: category,
    error,
    isLoading,
  } = useGetInventoriesByCategoryQuery(categories);

  // Object inventory IDs with common categories
  const objIds = category?.ids;

  // Handle loading and error states
  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">{title}</h3>
      {objIds?.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {objIds?.map((id) => {
          const Item = entities[id];
          return <ProductCard key={Item.id} data={Item} />;
        })}
      </div>
    </div>
  );
};

export default SuggestedProducts;
