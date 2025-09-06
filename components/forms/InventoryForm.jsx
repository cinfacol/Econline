"use client";

import { Form } from "@/components/forms";
import { useAddInventory } from "@/hooks";
import { useGetProductsQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useGetBrandsQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useCreateBrandMutation } from "@/redux/features/inventories/inventoriesApiSlice";
import { useGetAttributeValuesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useCreateAttributeValueMutation } from "@/redux/features/inventories/inventoriesApiSlice";
import { useGetTypesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useCreateTypeMutation } from "@/redux/features/inventories/inventoriesApiSlice";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function InventoryForm() {
  const router = useRouter();
  const [createBrand] = useCreateBrandMutation();
  const [createAttributeValue] = useCreateAttributeValueMutation();
  const [createType] = useCreateTypeMutation();
  const [newBrandName, setNewBrandName] = useState("");
  const [newAttributeValue, setNewAttributeValue] = useState("");
  const [newAttributeValueAttribute, setNewAttributeValueAttribute] =
    useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDescription, setNewTypeDescription] = useState("");

  // Hook para obtener marcas
  const { data: brandsData, isLoading: brandsLoading } = useGetBrandsQuery();
  const [showBrandModal, setShowBrandModal] = useState(false);

  // Hook para obtener valores de atributo
  const { data: attributeValuesData, isLoading: attributeValuesLoading } =
    useGetAttributeValuesQuery();
  const [showAttributeValueModal, setShowAttributeValueModal] = useState(false);

  // Hook para obtener tipos
  const { data: typesData, isLoading: typesLoading } = useGetTypesQuery();
  const [showTypeModal, setShowTypeModal] = useState(false);

  // Opciones para el select de marcas
  const brandOptions = Array.isArray(brandsData)
    ? brandsData.map((brand) => ({
        value: brand.pkid,
        label: brand.name,
      }))
    : [];

  // Opciones para el select de valores de atributo
  const attributeValueOptions = Array.isArray(attributeValuesData)
    ? attributeValuesData.map((attrValue) => ({
        value: attrValue.pkid,
        label: attrValue.value,
      }))
    : [];

  // Opciones para el select de tipos
  const typeOptions = Array.isArray(typesData)
    ? typesData.map((type) => ({
        value: type.pkid,
        label: type.name,
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

  const Condiciones = [
    { Name: "New", Label: "Nuevo" },
    { Name: "Used", Label: "Usado" },
    { Name: "Damaged", Label: "Para repuestos" },
  ];

  // Generar config con handlers adecuados según tipo
  const config = [
    {
      labelText: (
        <div className="flex items-center justify-between">
          <span>Producto</span>
          <button
            type="button"
            className="ml-2 text-indigo-600 text-lg font-bold"
            onClick={() => router.push('/admin/products/new')}
            title="Agregar nuevo producto"
          >
            +
          </button>
        </div>
      ),
      labelId: "product_id",
      type: "select",
      value: product_id || "",
      required: true,
      options: productOptions,
      placeholder: "Selecciona un producto",
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
    },
    {
      labelText: (
        <div className="flex items-center justify-between">
          <span>Valor de atributo</span>
          <button
            type="button"
            className="ml-2 text-indigo-600 text-lg font-bold"
            onClick={() => setShowAttributeValueModal(true)}
            title="Agregar nuevo valor de atributo"
          >
            +
          </button>
        </div>
      ),
      labelId: "attribute_value",
      type: "select",
      value: attribute_value || "",
      required: true,
      options: attributeValueOptions,
      placeholder: "Selecciona un valor de atributo",
    },
    {
      labelText: (
        <div className="flex items-center justify-between">
          <span>Tipo</span>
          <button
            type="button"
            className="ml-2 text-indigo-600 text-lg font-bold"
            onClick={() => setShowTypeModal(true)}
            title="Agregar nuevo tipo"
          >
            +
          </button>
        </div>
      ),
      labelId: "tipo",
      type: "select",
      value: tipo || "",
      required: true,
      options: typeOptions,
      placeholder: "Selecciona un tipo",
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
        label: status.Label,
      })),
    },
    {
      labelText: "Precio al por menor",
      labelId: "retail_price",
      type: "number",
      value: retail_price,
      placeholder: "Precio al por menor",
      required: true,
    },
    {
      labelText: "Precio de tienda",
      labelId: "store_price",
      type: "number",
      value: store_price,
      placeholder: "Precio de tienda",
      required: true,
    },
    {
      labelText: "Impuesto",
      labelId: "tax",
      type: "number",
      value: tax,
      placeholder: "Impuesto",
      required: true,
    },
    {
      labelText: "Peso",
      labelId: "weight",
      type: "number",
      value: weight,
      required: true,
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
                  const newBrand = await createBrand({
                    name: newBrandName,
                  }).unwrap();
                  toast.success("Marca creada exitosamente");
                  setShowBrandModal(false);
                  setNewBrandName("");
                  // Seleccionar automáticamente la nueva marca en el select usando su pkid
                  onChange({ target: { value: newBrand.pkid } }, "marca");
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

      {/* Modal para agregar nuevo valor de atributo */}
      {showAttributeValueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Agregar nuevo valor de atributo
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (
                  !newAttributeValue.trim() ||
                  !newAttributeValueAttribute.trim()
                )
                  return;
                try {
                  // Necesitamos crear el atributo y luego el valor
                  // Por simplicidad, crearemos directamente el valor con attribute=1 (ajustar según tu BD)
                  const newAttrValue = await createAttributeValue({
                    attribute: 1, // ID del atributo por defecto
                    value: newAttributeValue,
                  }).unwrap();
                  toast.success("Valor de atributo creado exitosamente");
                  setShowAttributeValueModal(false);
                  setNewAttributeValue("");
                  setNewAttributeValueAttribute("");
                  // Seleccionar automáticamente el nuevo valor en el select usando su pkid
                  onChange(
                    { target: { value: newAttrValue.pkid } },
                    "attribute_value"
                  );
                } catch (err) {
                  toast.error("Error al crear el valor de atributo");
                  setShowAttributeValueModal(false);
                  setNewAttributeValue("");
                  setNewAttributeValueAttribute("");
                }
              }}
            >
              <input
                type="text"
                name="newAttributeName"
                value={newAttributeValueAttribute}
                onChange={(e) => setNewAttributeValueAttribute(e.target.value)}
                placeholder="Nombre del atributo (ej: Color, Tamaño)"
                className="w-full border rounded px-3 py-2 mb-4"
                required
              />
              <input
                type="text"
                name="newAttributeValue"
                value={newAttributeValue}
                onChange={(e) => setNewAttributeValue(e.target.value)}
                placeholder="Valor del atributo (ej: Rojo, Grande)"
                className="w-full border rounded px-3 py-2 mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setShowAttributeValueModal(false);
                    setNewAttributeValue("");
                    setNewAttributeValueAttribute("");
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

      {/* Modal para agregar nuevo tipo */}
      {showTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Agregar nuevo tipo</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newTypeName.trim()) return;
                try {
                  const newType = await createType({
                    name: newTypeName,
                    description: newTypeDescription || "",
                  }).unwrap();
                  toast.success("Tipo creado exitosamente");
                  setShowTypeModal(false);
                  setNewTypeName("");
                  setNewTypeDescription("");
                  // Seleccionar automáticamente el nuevo tipo en el select usando su pkid
                  onChange({ target: { value: newType.pkid } }, "tipo");
                } catch (err) {
                  toast.error(err?.data?.name || "Error al crear el tipo");
                  setShowTypeModal(false);
                  setNewTypeName("");
                  setNewTypeDescription("");
                }
              }}
            >
              <input
                type="text"
                name="newTypeName"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="Nombre del tipo"
                className="w-full border rounded px-3 py-2 mb-4"
                required
              />
              <textarea
                name="newTypeDescription"
                value={newTypeDescription}
                onChange={(e) => setNewTypeDescription(e.target.value)}
                placeholder="Descripción del tipo (opcional)"
                className="w-full border rounded px-3 py-2 mb-4"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setShowTypeModal(false);
                    setNewTypeName("");
                    setNewTypeDescription("");
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
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </>
  );
}
