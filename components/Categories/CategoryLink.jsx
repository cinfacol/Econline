"use client";

import Link from "next/link";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";

// categoryLink { data } recibe los ids de todas las categorías encontradas
const CategoryLink = ({ data }) => {
  // Llama al hook para obtener las categorías
  const { data: categoriesData } = useGetCategoriesQuery("getCategories");

  // Suponiendo que data contiene los ids de las categorías
  const cat = data
    .map((categoryId) => categoriesData?.entities[categoryId])
    .filter(Boolean);

  /* const cat = data?.map((categoryId) => {
    const { category } = useGetCategoriesQuery("getCategories", {
      selectFromResult: ({ data }) => ({
        category: data?.entities[categoryId],
      }),
    });
    return category;
  }); */

  const parentData = cat?.filter((item) => item.is_parent);
  const noParentData = cat?.filter((item) => !item.is_parent);

  // Filtra y asigna claves únicas en un solo paso para categorías Parent
  const parentCategoriesWithKeys = parentData?.map((item) => ({
    ...item,
    key: `parent-${item.id}`, // Unique key for parent categories
  }));

  // Filtra y asigna claves únicas en un solo paso para categorías noParent
  const noParentCategoriesWithKeys = noParentData?.map((item) => ({
    ...item,
    key: `no-parent-${item.id}`, // Unique key for no-parent categories
  }));

  // Filtrar categorías no parent según la coincidencia con las categorías parent
  const commonNonParentData = noParentData?.filter((sub) => {
    return parentCategoriesWithKeys?.some(
      (parent) => parent.id && sub.common_category_ids?.includes(parent.id)
    );
  });

  // Asignar claves únicas a las categorías no padre filtradas
  const commonNonParentCategoriesWithKeys = commonNonParentData?.map(
    (sub, index) => ({
      ...sub,
      key: `non-parent-${index}`, // Unique key for filtered non-parent categories
    })
  );

  return (
    <>
      {parentCategoriesWithKeys?.map((item) => (
        <>
          <Link
            href={`/category/${item.id}`}
            key={item.key}
            className="block px-4 py-1 font-bold text-gray-700 bg-gray-200 hover:text-gray-900"
          >
            {item.name}
          </Link>
          <div className="rounded-lg text-smflex-auto ml-6">Sub-category</div>
        </>
      ))}
      <div className="rounded-lg text-smflex-auto ml-6">
        {noParentCategoriesWithKeys?.map((sub) => (
          <Link
            href={`/category/${sub.id}`}
            className="block font-semibold text-gray-700 text-sm pl-2 hover:bg-gray-200 hover:font-bold"
            key={sub.key} // Assign unique key
          >
            {sub.name}
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryLink;
