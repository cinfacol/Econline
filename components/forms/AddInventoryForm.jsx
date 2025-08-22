"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AddInventoryForm({ productId }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    brand: "",
    type: "",
    quality: "New",
    attribute_values: [],
    is_active: false,
    is_default: false,
    published_status: true,
    retail_price: "",
    store_price: "",
    taxe: "0.19",
    is_digital: false,
    weight: "",
    product: productId || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para crear el inventario vía RTK Query o fetch
    // Por ejemplo: await createInventoryMutation(formData)
    // Redirigir a detalles o listado de inventario
    router.push("/settings/inventory/details");
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Crear Inventario</h2>
      <input type="hidden" name="product" value={formData.product} />
      <div>
        <label>Marca</label>
        <input
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Tipo</label>
        <input
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Estado</label>
        <select
          name="quality"
          value={formData.quality}
          onChange={handleChange}
          className="input"
        >
          <option value="New">Nuevo</option>
          <option value="Used">Usado</option>
          <option value="Damaged">Para repuestos</option>
        </select>
      </div>
      <div>
        <label>Precio al por menor</label>
        <input
          name="retail_price"
          type="number"
          value={formData.retail_price}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Precio de tienda</label>
        <input
          name="store_price"
          type="number"
          value={formData.store_price}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Impuesto</label>
        <input
          name="taxe"
          type="number"
          step="0.01"
          value={formData.taxe}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>Peso</label>
        <input
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          className="input"
        />
      </div>
      <div>
        <label>¿Es digital?</label>
        <input
          name="is_digital"
          type="checkbox"
          checked={formData.is_digital}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>¿Activo?</label>
        <input
          name="is_active"
          type="checkbox"
          checked={formData.is_active}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>¿Predeterminado?</label>
        <input
          name="is_default"
          type="checkbox"
          checked={formData.is_default}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>¿Publicado?</label>
        <input
          name="published_status"
          type="checkbox"
          checked={formData.published_status}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" variant="default">
        Crear Inventario
      </Button>
    </form>
  );
}
