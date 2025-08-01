"use client";

import { NoResults } from "@/components/ui";
import { ProductSkeleton } from "@/components/skeletons";
import {
  useGetInventoriesQuery,
  useGetInventoriesByCategoryQuery,
} from "@/redux/features/inventories/inventoriesApiSlice";
import ProductCard from "./productCard";
import { useAppSelector } from "@/redux/hooks";

// Permite filtrar por categorías y excluir un producto específico
export default function InventoriesList({
  title,
  filterCategories,
  excludeId,
  customFilter,
}) {
  let data, isLoading, isSuccess, error;
  if (filterCategories) {
    // Si se pasan categorías, usar el query por categoría
    ({ data, isLoading, error } =
      useGetInventoriesByCategoryQuery(filterCategories));
    isSuccess = !!data;
  } else {
    const searchTerm = useAppSelector((state) => state?.inventory?.searchTerm);
    const categoryTerm = useAppSelector(
      (state) => state?.inventory?.categoryTerm
    );
    ({ data, isLoading, isSuccess, error } = useGetInventoriesQuery({
      searchTerm,
      categoryTerm,
    }));
  }

  // Destructure data and handle empty inventory case concisely
  const { ids = [] } = data || {}; // Default to empty array
  const { entities = [] } = data || {}; // Default to empty array

  if (isLoading) {
    return (
      <section>
        <div className="space-y-4">
          <h3 className="font-bold text-3xl sr-only">{title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  } else if (error) {
    return <p>Error: {error?.message}</p>;
  } else if (isSuccess) {
    return (
      <section>
        <div className="space-y-4">
          <h3 className="font-bold text-3xl sr-only">{title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.ids?.length === 0 && <NoResults title={"products"} />}
            {Array.from(
              new Map(
                ids
                  .filter((id) => id !== excludeId)
                  .map((id) => entities[id])
                  .filter((item) => item && item.id) // solo productos con id válido
                  .filter((item) =>
                    typeof customFilter === "function"
                      ? customFilter(item)
                      : true
                  )
                  .map((item) => [item.id, item])
              ).values()
            ).map((Item, index) => {
              const priority = index < 4;
              return (
                <ProductCard key={Item.id} data={Item} priority={priority} />
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}
