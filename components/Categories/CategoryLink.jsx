"use client";

import Link from "next/link";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";

// categoryLink { data } recibe los ids de todas las categorías encontradas
const CategoryLink = ({ data }) => {
  const cat = data?.map((categoryId) => {
    const { category } = useGetCategoriesQuery("getCategories", {
      selectFromResult: ({ data }) => ({
        category: data?.entities[categoryId],
      }),
    });
    return category;
  });

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
      <div className="group relative flex items-start gap-x-6 rounded-lg p-2 leading-6 bg-gray-200">
        <div className="flex-auto">
          <div className="block font-bold text-gray-900">
            {parentCategoriesWithKeys?.map((item) => (
              <Link href={`/category/${item.id}`} key={item.key}>
                <div>{item.name}</div>
              </Link>
            ))}
            <span className="absolute inset-0" />
          </div>
        </div>
      </div>
      <div className="rounded-lg text-smflex-auto ml-6">
        {noParentCategoriesWithKeys?.map((sub) => (
          <Link
            href={`/category/${sub.id}`}
            className="block font-semibold text-gray-900"
            key={sub.key} // Assign unique key
          >
            <div className="rounded-lg p-1 text-sm hover:bg-gray-50 hover:text-blue-400">
              <div>{sub.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryLink;
