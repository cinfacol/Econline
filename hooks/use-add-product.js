"use client";

import { useState, useEffect } from "react";
import useSelectedCategories from "./use-selected-categories";
import { useRouter } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { useCreateCategoryMutation } from "@/redux/features/categories/categoriesApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useCreateProductMutation } from "@/redux/features/inventories/inventoriesApiSlice";

export default function useAddProduct(initialCategoryIds) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addProduct, { isLoading }] = useCreateProductMutation();
  const [createCategory] = useCreateCategoryMutation();
  const user = data?.pk;
  // Usar el custom hook para leer siempre la selección más reciente
  const selectedCategoryIds = useSelectedCategories();
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    category_ids: selectedCategoryIds, // inicializa con los seleccionados
    is_active: true,
    published_status: false,
  });

  // Sincroniza el estado si cambian las categorías seleccionadas
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category_ids: selectedCategoryIds,
    }));
  }, [selectedCategoryIds]);

  const {
    product_name,
    product_description,
    category_ids,
    is_active,
    published_status,
  } = formData;

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    newCategoryName: "",
    newParentName: "",
    newMeasureUnit: "",
  });

  const onChange = (e, field) => {
    if (
      ["newCategoryName", "newParentName", "newMeasureUnit"].includes(field)
    ) {
      setCategoryForm({ ...categoryForm, [field]: e.target.value });
    } else {
      // Si el campo es category_ids, asigna el array
      if (field === "category_ids") {
        setFormData({ ...formData, [field]: e.target.value });
      } else {
        setFormData({ ...formData, [field]: e.target.value });
      }
    }
  };

  const onCheckboxChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.checked });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar los UUID directamente
      const categoryIds = Array.isArray(formData.category_ids)
        ? formData.category_ids.filter(
            (id) => id !== null && id !== undefined && id !== "" && id !== false
          )
        : [];
      if (!formData.product_name || categoryIds.length === 0) {
        toast.error(
          "Debes ingresar el nombre y seleccionar al menos una categoría válida."
        );
        return;
      }
      await addProduct({
        name: formData.product_name, // el campo que espera el backend
        description: formData.product_description,
        category: categoryIds, // envía array de UUIDs
        is_active: formData.is_active,
        published_status: formData.published_status,
        user,
      }).unwrap();
      toast.success("Product added successfully");
      // Limpiar localStorage de categorías seleccionadas
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("selectedCategoryIds");
      }
      // Redirigir al formulario de inventario
      router.push("/inventory/new");
    } catch (error) {
      toast.error("Failed to register new Product");
    }
  };

  return {
    ...formData,
    isLoading,
    onChange,
    onCheckboxChange,
    onSubmit,
    showCategoryForm,
    ...categoryForm,
  };
}
