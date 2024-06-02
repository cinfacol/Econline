"use client";

// useGetEntitybyCategory es un hook que recibe el id de una categoría y devuelve todos los inventarios que comparten esa misma categoría
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";

export default function useGetEntityByCategory(categoryId) {
  const { data: inventories } = useGetInventoriesQuery("getInventories", {
    selectFromResult: ({ inventory }) => ({
      inventory: inventory?.entities[categoryId],
    }),
  });
}
