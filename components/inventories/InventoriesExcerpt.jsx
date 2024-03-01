import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

function InventoriesExcerpt({ productId }) {
  const { inventory } = useGetInventoriesQuery("getInventories", {
    selectFromResult: ({ data }) => ({
      inventory: data?.entities[productId],
    }),
  });
  return (
    <>
      {inventory.length === 0 && <NoResults />}
      <div>
        <ProductCard key={inventory.id} data={inventory} />
      </div>
    </>
  );
}

export default InventoriesExcerpt;
