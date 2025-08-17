"use client";

import { useState } from "react";
import { useGetMeasureUnitsQuery } from "@/redux/features/categories/categoriesApiSlice";
import useCreateCategory from "@/hooks/use-create-category";

export default function CreateParentCategoryForm({
  onParentCategoryCreated,
  onCancel,
}) {
  const { data: measureUnits = [] } = useGetMeasureUnitsQuery();

  const { formData, errors, isLoading, onChange, onSubmit, resetForm } =
    useCreateCategory();

  const handleSubmit = async (event) => {
    try {
      const result = await onSubmit(event);
      if (result && onParentCategoryCreated) {
        onParentCategoryCreated(result.category);
      }
    } catch (error) {
      // Error ya manejado en el hook
      console.error("Error en CreateParentCategoryForm:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-green-800">
          Crear Nueva Categoría Padre
        </h3>
        <button
          type="button"
          onClick={handleCancel}
          className="text-green-600 hover:text-green-800 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre de la categoría padre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-green-700 mb-1"
          >
            Nombre de la Categoría Padre *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.name ? "border-red-500" : "border-green-300"
            }`}
            placeholder="Ej: Calzado, Ropa, Electrónicos, etc."
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
          <p className="mt-1 text-xs text-green-600">
            Esta será una categoría principal que puede contener subcategorías
          </p>
        </div>

        {/* Unidad de medida */}
        <div>
          <label
            htmlFor="measure_unit"
            className="block text-sm font-medium text-green-700 mb-1"
          >
            Unidad de Medida *
          </label>
          <select
            id="measure_unit"
            name="measure_unit"
            value={formData.measure_unit}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.measure_unit ? "border-red-500" : "border-green-300"
            }`}
            required
          >
            <option value="">Seleccionar unidad de medida</option>
            {measureUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.description} {unit.is_custom && "(Personalizada)"}
              </option>
            ))}
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
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label
            htmlFor="is_active"
            className="ml-2 block text-sm text-green-700"
          >
            Categoría activa
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-2 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
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
              "Crear Categoría Padre"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
