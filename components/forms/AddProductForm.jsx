"use client";

import { useAddProduct } from "@/hooks";
import { ProductForm } from "@/components/forms";
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
  } = useAddProduct();
  const { data } = useGetCategoriesQuery();

  // Destructure data and handle empty category case concisely
  const { ids = [] } = data || {}; // Default to empty array
  const { entities = [] } = data || {}; // Default to empty array

  let categories = [];

  const items = ids?.map((item) => {
    const Item = entities[item];
    return Item;
  });

  items.map((parentCat) => {
    if (parentCat?.sub_categories?.length > 0) {
      parentCat.sub_categories.map((subCat) => {
        categories.push({ name: subCat.name });
      });
    } else {
      categories.push({ name: parentCat.name });
    }
  });

  const config = [
    {
      labelText: "Product Name",
      labelId: "product_name",
      type: "text",
      value: product_name,
      placeholder: "Ingresa el nombre del producto *",
      required: true,
    },
    {
      labelText: "Description",
      labelId: "product_description",
      type: "textarea",
      value: product_description,
      rows: rows || 5,
      cols: cols || 40,
      placeholder: "Ingresa una descripción del producto *",
      required: true,
    },
    {
      labelText: "Category Name",
      labelId: "category_name",
      type: "select",
      value: category_name,
      // default: "Colombia",
      required: true,
      options: categories.map((category) => ({
        value: category.name,
        label: category.name,
      })),
    },
    {
      labelText: "Is Active",
      labelId: "is_active",
      type: "checkbox",
      value: is_active,
      required: false,
    },
    {
      labelText: "Published Status",
      labelId: "published_status",
      type: "checkbox",
      value: published_status,
      required: false,
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
