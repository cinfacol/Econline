"use client";

import React from "react";

export default function NewCategoryFields({
  newCategoryName,
  newParentName,
  newMeasureUnit,
  onChange,
  measureUnits,
}) {
  return (
    <div className="space-y-4 border border-gray-300 p-4 rounded mt-4 bg-gray-50">
      <h3 className="text-md font-semibold text-gray-700">
        Crear nueva categoría
      </h3>

      <input
        type="text"
        placeholder="Nombre nueva categoría"
        value={newCategoryName}
        onChange={(e) => onChange(e, "newCategoryName")}
        className="block w-full rounded-md border px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm"
        required
      />

      <input
        type="text"
        placeholder="Categoría padre (opcional)"
        value={newParentName}
        onChange={(e) => onChange(e, "newParentName")}
        className="block w-full rounded-md border px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm"
      />

      <select
        value={newMeasureUnit}
        onChange={(e) => onChange(e, "newMeasureUnit")}
        className="block w-full rounded-md border px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm"
        required
      >
        <option value="">Unidad de medida</option>
        {measureUnits.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.description}
          </option>
        ))}
      </select>
    </div>
  );
}
