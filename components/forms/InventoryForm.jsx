"use client";

import { Form } from "@/components/forms";
import { useAddInventory } from "@/hooks";
import { useGetProductsQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useGetBrandsQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useCreateBrandMutation } from "@/redux/features/inventories/inventoriesApiSlice";
import { useState } from "react";
import { toast } from "sonner";

export default function InventoryForm() {
  const [createBrand] = useCreateBrandMutation();
  const [newBrandName, setNewBrandName] = useState("");
  // Hook para obtener marcas
  const { data: brandsData, isLoading: brandsLoading } = useGetBrandsQuery();
  const [showBrandModal, setShowBrandModal] = useState(false);

  // Opciones para el select de marcas
  const brandOptions = Array.isArray(brandsData)
    ? brandsData.map((brand) => ({
        value: brand.name,
        label: brand.name,
      }))
    : [];
  // Importar el hook para obtener productos
  // eslint-disable-next-line
  const { data: productsData, isLoading: productsLoading } =
    typeof useGetProductsQuery !== "undefined"
      ? useGetProductsQuery()
      : { data: [], isLoading: false };

  // Procesar productos para el select
  const productOptions = Array.isArray(productsData)
    ? productsData.map((prod) => ({
        value: prod.pkid, // Usar pkid entero
        label: prod.name,
      }))
    : [];

  // Si no hay productos, mostrar link para crear uno
  const noProducts =
    !productsLoading && (!productOptions || productOptions.length === 0);

  // Agregar campos al estado y handlers
  // ...existing code...
  // Agregar attribute_value y product_id al destructuring
  const {
    isLoading,
    onChange,
    onCheckboxChange,
    onSubmit,
    marca,
    tipo,
    estado,
    retail_price,
    store_price,
    tax,
    weight,
    is_digital,
    is_active,
    is_default,
    published_status,
    attribute_value,
    product_id,
  } = useAddInventory();

  const Condiciones = [{ Name: "Nuevo" }, { Name: "Usado" }];

  // Generar config con handlers adecuados según tipo
  const config = [
    {
      labelText: "Producto",
      labelId: "product_id",
      type: "select",
      value: product_id || "",
      required: true,
      options: productOptions,
      placeholder: "Selecciona un producto",
      onChange: (e) => onChange(e, "product_id"),
    },
    {
      labelText: (
        <div className="flex items-center justify-between">
          <span>Marca</span>
          <button
            type="button"
            className="ml-2 text-indigo-600 text-lg font-bold"
            onClick={() => setShowBrandModal(true)}
            title="Agregar nueva marca"
          >
            +
          </button>
        </div>
      ),
      labelId: "marca",
      type: "select",
      value: marca || "",
      required: true,
      options: brandOptions,
      placeholder: "Selecciona una marca",
      onChange: (e) => onChange(e, "marca"),
    },
    {
      labelText: "Valor de atributo",
      labelId: "attribute_value",
      type: "text",
      value: attribute_value || "",
      placeholder: "Valor del atributo",
      required: true,
      onChange: (e) => onChange(e, "attribute_value"),
    },
    {
      labelText: "Tipo",
      labelId: "tipo",
      type: "text",
      value: tipo,
      placeholder: "Tipo de producto",
      required: true,
      onChange: (e) => onChange(e, "tipo"),
    },
    {
      labelText: "Estado",
      labelId: "estado",
      type: "select",
      value: estado,
      default: "nuevo",
      required: true,
      options: Condiciones.map((status) => ({
        value: status.Name,
        label: status.Name,
      })),
      onChange: (e) => onChange(e, "estado"),
    },
    {
      labelText: "Precio al por menor",
      labelId: "retail_price",
      type: "number",
      value: retail_price,
      placeholder: "Precio al por menor",
      required: true,
      onChange: (e) => onChange(e, "retail_price"),
    },
    {
      labelText: "Precio de tienda",
      labelId: "store_price",
      type: "number",
      value: store_price,
      placeholder: "Precio de tienda",
      required: true,
      onChange: (e) => onChange(e, "store_price"),
    },
    {
      labelText: "Impuesto",
      labelId: "tax",
      type: "number",
      value: tax,
      required: true,
      onChange: (e) => onChange(e, "tax"),
    },
    {
      labelText: "Peso",
      labelId: "weight",
      type: "number",
      value: weight,
      required: true,
      onChange: (e) => onChange(e, "weight"),
    },
    {
      labelText: "¿Es digital?",
      labelId: "is_digital",
      type: "checkbox",
      value: is_digital,
      onChange: (e) => onCheckboxChange(e, "is_digital"),
    },
    {
      labelText: "¿Activo?",
      labelId: "is_active",
      type: "checkbox",
      value: is_active,
      onChange: (e) => onCheckboxChange(e, "is_active"),
    },
    {
      labelText: "¿Predeterminado?",
      labelId: "is_default",
      type: "checkbox",
      value: is_default,
      onChange: (e) => onCheckboxChange(e, "is_default"),
    },
    {
      labelText: "¿Publicado?",
      labelId: "published_status",
      type: "checkbox",
      value: published_status,
      onChange: (e) => onCheckboxChange(e, "published_status"),
    },
  ];
  return (
    <>
      {/* Modal para agregar nueva marca */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Agregar nueva marca</h2>
            {/* Formulario simple para nueva marca */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newBrandName.trim()) return;
                try {
                  await createBrand({ name: newBrandName }).unwrap();
                  toast.success("Marca creada exitosamente");
                  setShowBrandModal(false);
                  setNewBrandName("");
                  // Seleccionar automáticamente la nueva marca en el select
                  onChange({ target: { value: newBrandName } }, "marca");
                } catch (err) {
                  toast.error(err?.data?.name || "Error al crear la marca");
                  setShowBrandModal(false);
                  setNewBrandName("");
                }
              }}
            >
              <input
                type="text"
                name="newBrand"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Nombre de la marca"
                className="w-full border rounded px-3 py-2 mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setShowBrandModal(false);
                    setNewBrandName("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {noProducts && (
        <div className="mb-4 text-red-600">
          No hay productos disponibles.{" "}
          <a href="/admin/products/new" className="text-blue-600 underline">
            Crear producto
          </a>
        </div>
      )}
      <Form
        config={config}
        isLoading={isLoading}
        btnText="Agregar Inventario"
        onChange={() => {}}
        onSubmit={onSubmit}
      />
    </>
  );
}
