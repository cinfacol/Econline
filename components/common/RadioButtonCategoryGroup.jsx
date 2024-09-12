"use client";

import { useAppDispatch } from "@/redux/hooks";
import { setCategoryTerm } from "@/redux/features/inventories/inventorySlice";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";

export const RadioButtonCategoryGroup = () => {
  const dispatch = useAppDispatch();
  const { data } = useGetCategoriesQuery();

  const handleCategoryChange = (event) => {
    dispatch(setCategoryTerm(event.target.value));
  };
  // Destructure data and handle empty inventory case concisely
  const { ids = [] } = data || {}; // Default to empty array
  const { entities = [] } = data || {}; // Default to empty array

  const categories = ids?.map((id) => {
    const Item = entities[id];
    return Item;
  });

  return (
    <div className="flex items-center me-4 mt-3">
      {categories?.length > 0 &&
        categories?.map((category) =>
          category?.sub_categories?.map((sub) => (
            <label
              key={sub.id}
              className="inline-flex items-center mr-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              <input
                type="radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                name="sub_category"
                value={sub.slug}
                onChange={handleCategoryChange}
              />
              <span className="ml-2">{sub.name}</span>
            </label>
          ))
        )}
    </div>
  );
};
