"use client";

import { useAddProduct } from "@/hooks";
import { ProductForm } from "@/components/forms";
import NewCategoryFields from "./NewCategoryFields";
import {
  useGetMeasureUnitsQuery,
  useSetSelectedCategoriesMutation,
  useGetSelectedCategoriesQuery,
} from "@/redux/features/categories/categoriesApiSlice";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";

export default function AddProductForm() {
  const { data: selectedCategoryIds } = useGetSelectedCategoriesQuery();
  const {
    product_name,
    product_description,
    category_ids,
    rows,
    cols,
    is_active,
    published_status,
    isLoading,
    onChange,
    onCheckboxChange,
    onSubmit,
    showCategoryForm,
    newCategoryName,
    newParentName,
    newMeasureUnit,
  } = useAddProduct(selectedCategoryIds || []);
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: measureUnits = [] } = useGetMeasureUnitsQuery();

  // Si no hay categorías seleccionadas, no mostrar nada
  function buildSelectedCategoriesOptions(selectedIds = [], categoriesData) {
    if (!categoriesData || !selectedIds || selectedIds.length === 0) return [];
    const { ids = [], entities = {} } = categoriesData;
    const items = ids?.map((id) => entities[id]).filter(Boolean);
    const result = [];
    items?.forEach((parentCat) => {
      if (selectedIds.includes(parentCat.id)) {
        result.push({ value: parentCat.id, label: parentCat.name });
      }
      if (parentCat.sub_categories?.length > 0) {
        parentCat.sub_categories.forEach((subCat) => {
          if (selectedIds.includes(subCat.id)) {
            result.push({
              value: subCat.id,
              label: `${parentCat.name} > ${subCat.name}`,
            });
          }
        });
      }
    });
    return result;
  }

  // Opciones solo para las seleccionadas
  const categories = buildSelectedCategoriesOptions(
    selectedCategoryIds,
    categoriesData
  );

  const config = [
    {
      labelText: "Product Name",
      labelId: "product_name",
      type: "text",
      value: product_name,
      placeholder: "Nombre del producto",
      required: true,
    },
    {
      labelText: "Description",
      labelId: "product_description",
      type: "textarea",
      value: product_description,
      rows: rows || 5,
      cols: cols || 40,
      placeholder: "Descripción del producto",
      required: true,
    },
    {
      labelText: "Category",
      labelId: "category_ids",
      type: "multiselect",
      value: category_ids,
      required: true,
      options: categories,
    },
    {
      labelText: "Is Active",
      labelId: "is_active",
      type: "checkbox",
      value: is_active,
    },
    {
      labelText: "Published Status",
      labelId: "published_status",
      type: "checkbox",
      value: published_status,
    },
  ];

  return (
    <ProductForm
      config={config}
      isLoading={isLoading}
      btnText="Add New Product"
      onChange={onChange}
      onCheckboxChange={onCheckboxChange}
      onSubmit={onSubmit}
    />
  );
}
