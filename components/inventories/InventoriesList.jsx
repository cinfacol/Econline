"use client";

import { Spinner } from "@/components/common";
import NoResults from "@/components/ui/no-results";
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import ProductCard from "./productCard";
import { useAppSelector } from "@/redux/hooks";

export default function InventoriesList({ title, auth }) {
  const searchTerm = useAppSelector((state) => state?.inventory?.searchTerm);
  const categoryTerm = useAppSelector(
    (state) => state?.inventory?.categoryTerm
  );
  const access = auth.cookie["value"];

  const { data, isLoading, isSuccess, error } = useGetInventoriesQuery({
    searchTerm,
    categoryTerm,
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
              return <ProductCard key={Item.id} data={Item} auth={access} />;
            })}
          </div>
        </div>
      </section>
    );
}
