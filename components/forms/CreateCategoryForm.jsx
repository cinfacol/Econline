"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useGetMeasureUnitsQuery,
} from "@/redux/features/categories/categoriesApiSlice";
import useCreateCategory from "@/hooks/use-create-category";
import CreateParentCategoryForm from "./CreateParentCategoryForm";
import CreateMeasureUnitForm from "./CreateMeasureUnitForm";

export default function CreateCategoryForm({ onCategoryCreated, onCancel }) {
  const [showCreateParentForm, setShowCreateParentForm] = useState(false);
  const [showCreateMeasureUnitForm, setShowCreateMeasureUnitForm] =
    useState(false);

  const { data: categoriesData, refetch: refetchCategories } =
    useGetCategoriesQuery();
  const { data: measureUnits = [], refetch: refetchMeasureUnits } =
    useGetMeasureUnitsQuery();

  console.log("Measure Units:", measureUnits);

  const { formData, errors, isLoading, onChange, onSubmit, resetForm } =
    useCreateCategory();

  // Función para construir las opciones de categorías padre
  const buildParentCategoriesOptions = () => {
    const result = [];
    const { ids = [], entities = {} } = categoriesData || {};

    const items = ids?.map((id) => entities[id]).filter(Boolean);

    items?.forEach((category) => {
      // Solo categorías principales pueden ser padres
      if (!category.parent) {
        result.push({
          value: category.id,
          label: category.name,
        });
      }
    });

    return result;
  };

  const parentCategories = buildParentCategoriesOptions();

  const handleSubmit = async (event) => {
    try {
      const result = await onSubmit(event);
      if (result && onCategoryCreated) {
        onCategoryCreated(result.category);
      }
    } catch (error) {
      // Error ya manejado en el hook
      console.error("Error en CreateCategoryForm:", error);
    }
  };

  const handleParentSelection = (event) => {
    const { value } = event.target;

    if (value === "__create_new__") {
      setShowCreateParentForm(true);
    } else {
      onChange(event);
    }
  };

  const handleMeasureUnitSelection = (event) => {
    const { value } = event.target;

    if (value === "__create_new__") {
      setShowCreateMeasureUnitForm(true);
    } else {
      onChange(event);
    }
  };

  const handleParentCategoryCreated = async (newParentCategory) => {
    console.log("Nueva categoría padre creada:", newParentCategory);

    // Refrescar las categorías
    await refetchCategories();

    // Cerrar el formulario
    setShowCreateParentForm(false);

    // Seleccionar automáticamente la nueva categoría padre
    const fakeEvent = {
      target: {
        name: "parent",
        value: newParentCategory.id,
      },
    };
    onChange(fakeEvent);
  };

  const handleMeasureUnitCreated = async (newMeasureUnit) => {
    console.log("Nueva unidad de medida creada:", newMeasureUnit);

    // Refrescar las unidades de medida
    await refetchMeasureUnits();

    // Cerrar el formulario
    setShowCreateMeasureUnitForm(false);

    // Seleccionar automáticamente la nueva unidad de medida
    const fakeEvent = {
      target: {
        name: "measure_unit",
        value: newMeasureUnit.id,
      },
    };
    onChange(fakeEvent);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Crear Nueva Categoría
        </h2>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre de la categoría */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de la Categoría *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ingresa el nombre de la categoría"
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Categoría padre (opcional) */}
        <div>
          <label
            htmlFor="parent"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Categoría Padre (Opcional)
          </label>
          <select
            id="parent"
            name="parent"
            value={formData.parent}
            onChange={handleParentSelection}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.parent ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seleccionar categoría padre (opcional)</option>
            {parentCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
            <option
              value="__create_new__"
              className="text-green-600 font-medium"
            >
              🆕 Crear nueva categoría padre
            </option>
          </select>
          {errors.parent && (
            <p className="mt-1 text-sm text-red-600">{errors.parent}</p>
          )}
        </div>

        {/* Unidad de medida */}
        <div>
          <label
            htmlFor="measure_unit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Unidad de Medida *
          </label>
          <select
            id="measure_unit"
            name="measure_unit"
            value={formData.measure_unit}
            onChange={handleMeasureUnitSelection}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.measure_unit ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Seleccionar unidad de medida</option>
            {measureUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.description} {unit.is_custom && "(Personalizada)"}
              </option>
            ))}
            <option
              value="__create_new__"
              className="text-blue-600 font-medium"
            >
              🆕 Crear nueva unidad de medida
            </option>
          </select>
          {errors.measure_unit && (
            <p className="mt-1 text-sm text-red-600">{errors.measure_unit}</p>
          )}
        </div>

        {/* Estado activo */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_active"
            className="ml-2 block text-sm text-gray-700"
          >
            Categoría activa
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando...
              </span>
            ) : (
              "Crear Categoría"
            )}
          </button>
        </div>
      </form>

      {/* Formularios dinámicos */}
      {showCreateParentForm && (
        <CreateParentCategoryForm
          onParentCategoryCreated={handleParentCategoryCreated}
          onCancel={() => setShowCreateParentForm(false)}
        />
      )}

      {showCreateMeasureUnitForm && (
        <CreateMeasureUnitForm
          onMeasureUnitCreated={handleMeasureUnitCreated}
          onCancel={() => setShowCreateMeasureUnitForm(false)}
        />
      )}
    </div>
  );
}
