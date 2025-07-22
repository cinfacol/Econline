"use client";

import { useRouter } from "next/navigation";
import { useGetProductQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import InventoriesList from "./InventoriesList";

const RelatedProducts = ({ inventoryId }) => {
  const { data: product } = useGetProductQuery(inventoryId);
  const router = useRouter();

  // Lógica mejorada: categoría, marca y similitud en descripción
  const categorySlugs = product?.product?.category?.map((cat) => cat?.slug);
  const brandName = product?.brand?.name;
  const description = product?.product?.description?.toLowerCase() || "";

  // Usar InventoriesList para filtrar por categoría y luego filtrar por marca y similitud en descripción
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-4">Productos relacionados</h2>
      <InventoriesList
        filterCategories={categorySlugs}
        excludeId={inventoryId}
        customFilter={(item) => {
          // Coincidencia por marca
          const sameBrand = brandName && item?.brand?.name === brandName;
          // Coincidencia por similitud en descripción (palabra clave compartida)
          const desc = item?.product?.description?.toLowerCase() || "";
          const sharedWord =
            description &&
            desc &&
            description
              .split(" ")
              .some((word) => word.length > 3 && desc.includes(word));
          // Mostrar si coincide marca o hay palabra clave compartida
          return sameBrand || sharedWord;
        }}
      />
    </div>
  );
};

export default RelatedProducts;
