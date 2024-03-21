"use client";

// useGetEntity es un hook que recibe el id de un producto y devuelve toda la información relacionada con ese producto
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";

export default function useGetEntity(inventoryId) {
  const { data: inventories } = useGetInventoriesQuery("getInventories");
  const inventory = inventories?.entities[inventoryId];

  return inventory;
}
