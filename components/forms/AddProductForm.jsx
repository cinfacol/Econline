"use client";

import { useAddProduct } from "@/hooks";
import { ProductForm } from "@/components/forms";
import NewCategoryFields from "./NewCategoryFields";
import { useGetMeasureUnitsQuery } from "@/redux/features/categories/categoriesApiSlice";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";

export default function AddProductForm() {
  const {
    product_name,
    product_description,
    category_name,
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
  } = useAddProduct();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: measureUnits = [] } = useGetMeasureUnitsQuery();

  function buildCategoriesFromData() {
    const result = [];
    const { ids = [], entities = {} } = categoriesData || {};

    const items = ids?.map((id) => entities[id]).filter(Boolean);

    items?.forEach((parentCat) => {
      if (parentCat.sub_categories?.length > 0) {
        parentCat.sub_categories.forEach((subCat) => {
          result.push({
            value: subCat.id,
            label: `${subCat.name}`,
          });
        });
      } else {
        result.push({
          value: parentCat.id,
          label: parentCat.name,
        });
      }
    });

    return result;
  }

  const categories = buildCategoriesFromData();

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
      labelId: "category_name",
      type: "select",
      value: category_name,
      required: true,
      options: [
        ...categories.map((c) => ({ label: c.label })),
        { value: "__new__", label: "➕ Crear nueva categoría" },
      ],
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
    <>
      <ProductForm
        config={config}
        isLoading={isLoading}
        btnText="Add New Product"
        onChange={onChange}
        onCheckboxChange={onCheckboxChange}
        onSubmit={onSubmit}
      />

      {showCategoryForm && (
        <NewCategoryFields
          newCategoryName={newCategoryName}
          newParentName={newParentName}
          newMeasureUnit={newMeasureUnit}
          measureUnits={measureUnits}
          onChange={onChange}
        />
      )}
    </>
  );
}
