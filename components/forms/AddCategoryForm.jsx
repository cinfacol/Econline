"use client";

import { useState } from "react";
import { useAddProduct } from "@/hooks";
import { ProductForm } from "@/components/forms";
import NewCategoryFields from "./NewCategoryFields";
import CreateCategoryForm from "./CreateCategoryForm";
import { useGetMeasureUnitsQuery } from "@/redux/features/categories/categoriesApiSlice";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";

export default function AddCategoryForm() {
  const [showFullCategoryForm, setShowFullCategoryForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  const { data: categoriesData, refetch: refetchCategories } =
    useGetCategoriesQuery();
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

  const handleCategorySelection = (event) => {
    const { value } = event.target;

    if (value === "__new__") {
      setShowFullCategoryForm(true);
    } else if (value === "__create_simple__") {
      // Mantener el comportamiento original para crear categoría simple
      onChange(event);
    } else {
      onChange(event);
    }
  };

  const handleCategoryCreated = async (newCategory) => {
    console.log("Nueva categoría creada desde AddCategoryForm:", newCategory);

    // Refrescar las categorías
    await refetchCategories();
    setRefreshKey((prev) => prev + 1);

    // Cerrar el formulario
    setShowFullCategoryForm(false);

    // Seleccionar automáticamente la nueva categoría
    const fakeEvent = {
      target: {
        name: "category_name",
        value: newCategory.id,
      },
    };
    onChange(fakeEvent);
  };

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
        ...categories.map((c) => ({ value: c.value, label: c.label })),
        { value: "__new__", label: "🏷️ Crear nueva categoría (Avanzado)" },
        { value: "__create_simple__", label: "➕ Crear categoría simple" },
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

  if (showFullCategoryForm) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Crear Nueva Categoría
          </h3>
          <p className="text-blue-600 text-sm">
            Una vez creada la categoría, podrás continuar con la creación del
            producto.
          </p>
        </div>

        <CreateCategoryForm
          onCategoryCreated={handleCategoryCreated}
          onCancel={() => setShowFullCategoryForm(false)}
        />
      </div>
    );
  }

  return (
    <>
      <ProductForm
        key={refreshKey} // Forzar re-render cuando se crea una nueva categoría
        config={config}
        isLoading={isLoading}
        btnText="Add New Product"
        onChange={handleCategorySelection}
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
