"use client";

import { useState } from "react";
import { useCreateMeasureUnitMutation } from "@/redux/features/categories/categoriesApiSlice";
import { toast } from "sonner";

export default function useCreateMeasureUnit() {
  const [createMeasureUnit, { isLoading }] = useCreateMeasureUnitMutation();

  const [formData, setFormData] = useState({
    description: "",
  });

  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    if (!formData.description.trim()) {
      newErrors.description =
        "La descripción de la unidad de medida es requerida";
    } else if (formData.description.trim().length < 2) {
      newErrors.description = "La descripción debe tener al menos 2 caracteres";
    } else if (formData.description.trim().length > 100) {
      newErrors.description = "La descripción no puede exceder 100 caracteres";
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
      const measureUnitData = {
        description: formData.description.trim(),
      };

      const result = await createMeasureUnit(measureUnitData).unwrap();

      toast.success(result.message || "Unidad de medida creada exitosamente");

      // Resetear formulario
      setFormData({
        description: "",
      });

      setErrors({});

      return result;
    } catch (error) {
      console.error("Error creating measure unit:", error);

      const errorMessage =
        error?.data?.error ||
        error?.message ||
        "Error al crear la unidad de medida";

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
      description: "",
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
