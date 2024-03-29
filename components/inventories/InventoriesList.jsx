"use client";

import { Spinner } from "@/components/common";
import NoResults from "@/components/ui/no-results";
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useSelector } from "react-redux";
import ProductCard from "../ui/productCard";

export default function InventoriesList({ title }) {
  const searchTerm = useSelector((state) => state?.inventory?.searchTerm);
  const categorySlug = useSelector((state) => state?.inventory?.categorySlug);

  const { data, isLoading, isSuccess, error } = useGetInventoriesQuery({
    searchTerm,
    categorySlug,
  });

  // Early return for loading and error states
  if (isLoading)
    return (
      <>
        <Spinner lg /> Loading ...
      </>
    );
  if (error) return <p>Error: {error?.message}</p>;

  // Destructure data and handle empty inventory case concisely
  const { ids = [] } = data || {}; // Default to empty array
  const { entities = [] } = data || {}; // Default to empty array

  if (isSuccess)
    return (
      <section>
        <div className="space-y-4">
          <h3 className="font-bold text-3xl">{title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.ids?.length === 0 && <NoResults title={"products"} />}
            {ids?.map((id) => {
              const Item = entities[id];
              return <ProductCard key={Item.id} data={Item} />;
            })}
          </div>
        </div>
      </section>
    );
}
