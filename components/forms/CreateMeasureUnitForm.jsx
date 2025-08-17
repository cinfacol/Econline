"use client";

import useCreateMeasureUnit from "@/hooks/use-create-measure-unit";

export default function CreateMeasureUnitForm({
  onMeasureUnitCreated,
  onCancel,
}) {
  const { formData, errors, isLoading, onChange, onSubmit, resetForm } =
    useCreateMeasureUnit();

  const handleSubmit = async (event) => {
    try {
      const result = await onSubmit(event);
      if (result && onMeasureUnitCreated) {
        onMeasureUnitCreated(result.measure_unit);
      }
    } catch (error) {
      // Error ya manejado en el hook
      console.error("Error en CreateMeasureUnitForm:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-blue-800">
          Crear Nueva Unidad de Medida
        </h3>
        <button
          type="button"
          onClick={handleCancel}
          className="text-blue-600 hover:text-blue-800 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Descripción de la unidad de medida */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-blue-700 mb-1"
          >
            Descripción de la Unidad *
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-blue-300"
            }`}
            placeholder="Ej: Pares, Docenas, Metros, etc."
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-blue-600">
            Ingresa una descripción clara para la nueva unidad de medida
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
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
              "Crear Unidad"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
