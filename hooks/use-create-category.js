"use client";

import { useState } from "react";
import { useCreateCategoryMutation } from "@/redux/features/categories/categoriesApiSlice";
import { toast } from "sonner";

export default function useCreateCategory() {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    parent: "",
    measure_unit: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error específico cuando el usuario empiece a corregir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la categoría es requerido";
    }

    if (!formData.measure_unit) {
      newErrors.measure_unit = "La unidad de medida es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrige los errores en el formulario");
      return;
    }

    try {
      // Preparar datos para enviar
      const categoryData = {
        name: formData.name.trim(),
        measure_unit: formData.measure_unit,
        is_active: formData.is_active,
      };

      // Solo incluir parent si tiene valor
      if (formData.parent) {
        categoryData.parent = formData.parent;
      }

      const result = await createCategory(categoryData).unwrap();

      toast.success(result.message || "Categoría creada exitosamente");

      // Resetear formulario
      setFormData({
        name: "",
        parent: "",
        measure_unit: "",
        is_active: true,
      });

      setErrors({});

      return result;
    } catch (error) {
      console.error("Error creating category:", error);

      const errorMessage =
        error?.data?.error || error?.message || "Error al crear la categoría";

      toast.error(errorMessage);

      // Si hay errores específicos de campo del backend, mostrarlos
      if (error?.data?.errors) {
        setErrors(error.data.errors);
      }

      throw error;
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      parent: "",
      measure_unit: "",
      is_active: true,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isLoading,
    onChange,
    onSubmit,
    resetForm,
    validateForm,
  };
}
