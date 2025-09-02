"use client";

import { Form } from "@/components/forms";
import { useAddInventory } from "@/hooks";

export default function InventoryForm() {
  const { isLoading, onChange, onSubmit } = useAddInventory();
  const Condiciones = [{ Name: "Nuevo" }, { Name: "Usado" }];

  const config = [
    {
      labelText: "Marca",
      labelId: "marca",
      type: "text",
      value: "",
      placeholder: "Marca del producto",
      required: true,
    },
    {
      labelText: "Tipo",
      labelId: "tipo",
      type: "text",
      value: "",
      placeholder: "Tipo de producto",
      required: true,
    },
    {
      labelText: "Estado",
      labelId: "estado",
      type: "select",
      value: [],
      default: "nuevo",
      required: true,
      options: Condiciones.map((status) => ({
        value: status.Name,
        label: status.Name,
      })),
    },
    {
      labelText: "Precio al por menor",
      labelId: "retail_price",
      type: "text",
      value: "",
      placeholder: "Precio al por menor",
      required: true,
    },
    {
      labelText: "Precio de tienda",
      labelId: "store_price",
      type: "text",
      value: "",
      placeholder: "Precio de tienda",
      required: true,
    },
    {
      labelText: "Impuesto",
      labelId: "tax",
      type: "number",
      value: "",
      required: true,
    },
    {
      labelText: "Peso",
      labelId: "weight",
      type: "number",
      value: "",
      required: true,
    },
    {
      labelText: "¿Es digital?",
      labelId: "is_digital",
      type: "checkbox",
      value: "",
    },
    {
      labelText: "¿Activo?",
      labelId: "is_active",
      type: "checkbox",
      value: "",
    },
    {
      labelText: "¿Predeterminado?",
      labelId: "is_default",
      type: "checkbox",
      value: "",
    },
    {
      labelText: "¿Publicado?",
      labelId: "published_status",
      type: "checkbox",
      value: "",
    },
  ];
  return (
    <Form
      config={config}
      isLoading={isLoading}
      btnText="Agregar Inventario"
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
