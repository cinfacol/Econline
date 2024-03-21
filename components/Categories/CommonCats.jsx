"use client";
import { useGetInventoriesByCategoryQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useGetEntityByCategory } from "@/hooks";

function CommonCats({ categoryId }) {
  // encontrar los productos comunes en categoría a {categoryId}
  const { data, isLoading, isSuccess, isError, error } =
    useGetInventoriesQuery("getInventories");

  const inventories = useGetEntityByCategory(categoryId);
  // console.log("inventories_common", inventories);
  // const { data } = useGetInventoriesByCategoryQuery(categories);

  return <div>Categorías comunes a: {categoryId}</div>;
}

export default CommonCats;
