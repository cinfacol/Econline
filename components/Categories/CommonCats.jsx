import { useGetInventoriesByCategoryQuery } from "@/redux/features/inventories/inventoriesApiSlice";

function CommonCats({ categoryId }) {
  return <div>CommonCats to: {categoryId}</div>;
}

export default CommonCats;
