"use client";

import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";

export default function useGetEntity(inventoryId) {
  const { data: inventories } = useGetInventoriesQuery("getInventories");
  const inventory = inventories?.entities[inventoryId];

  return inventory;
}
