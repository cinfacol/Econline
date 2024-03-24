"use client";
import { useGetInventoriesByCategoryQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useGetEntityByCategory } from "@/hooks";

function CommonCats({ categoryId }) {
  // encontrar los productos comunes en categoría a {categoryId}
  const { data, isLoading, isSuccess, isError, error } =
    useGetInventoriesQuery("getInventories");

  const inventories = useGetEntityByCategory(categoryId);

  return <div>Categorías comunes a: {categoryId}</div>;
}

export default CommonCats;
