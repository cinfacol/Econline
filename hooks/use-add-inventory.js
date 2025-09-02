"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useCreateInventoryMutation } from "@/redux/features/inventories/inventoriesApiSlice";

export default function useAddInventory() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addInventory, { isLoading }] = useCreateInventoryMutation();
  const user = data?.pk;
  const [formData, setFormData] = useState({
    marca: "",
    tipo: "",
    estado: "Nuevo",
    retail_price: "",
    store_price: "",
    tax: "",
    weight: "",
    is_digital: false,
    is_active: true,
    is_default: false,
    published_status: false,
    product_id: "",
    attribute_value: "",
  });

  const {
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
  } = formData;

  const onChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const onCheckboxChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.checked });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addInventory({
        marca: formData.marca,
        tipo: formData.tipo,
        estado: formData.estado,
        retail_price: formData.retail_price,
        store_price: formData.store_price,
        tax: formData.tax,
        weight: formData.weight,
        is_digital: formData.is_digital,
        is_active: formData.is_active,
        is_default: formData.is_default,
        published_status: formData.published_status,
        product: formData.product_id,
        attribute_values: [formData.attribute_value],
        user,
      }).unwrap();
      toast.success("Inventory added successfully");
      // Limpiar localStorage de categorías seleccionadas
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("selectedCategoryIds");
      }
      // Redirigir al formulario de inventario
      router.push("/inventory/new");
    } catch (error) {
      toast.error("Failed to register new Inventory");
    }
  };

  return {
    ...formData,
    isLoading,
    onChange,
    onCheckboxChange,
    onSubmit,
  };
}
