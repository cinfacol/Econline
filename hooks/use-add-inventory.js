"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useCreateInventoryMutation } from "@/redux/features/inventories/inventoriesApiSlice";

export default function useAddInventory() {
  const router = useRouter();
  const { isAuthenticated, isGuest } = useAppSelector((state) => state.auth);
  const { data } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated || isGuest,
  });
  const [addInventory, { isLoading }] = useCreateInventoryMutation();
  const user = data?.pk;
  const [formData, setFormData] = useState({
    marca: "",
    tipo: "",
    estado: "New",
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
    units: "",
    units_sold: 0,
    images: [], // Array de objetos con {file, alt_text, is_featured, default}
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
    product_id,
    attribute_value,
    units,
    units_sold,
    images,
  } = formData;

  const onChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const onSelectChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const onCheckboxChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.checked });
  };

  const onImageChange = (files) => {
    setFormData({ ...formData, images: Array.from(files) });
  };

  const onImagesUpdate = (images) => {
    setFormData({ ...formData, images: images });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validaciones antes del envío
    if (
      !formData.product_id ||
      formData.product_id === "" ||
      formData.product_id === "0"
    ) {
      toast.error("Debe seleccionar un producto");
      return;
    }

    try {
      // Crear FormData para manejar archivos
      const formDataRequest = new FormData();

      // Datos del inventario
      const inventoryData = {
        brand: formData.marca || null,
        type: formData.tipo || null,
        quality: formData.estado,
        retail_price: formData.retail_price,
        store_price: formData.store_price,
        tax: formData.tax,
        weight: formData.weight,
        is_digital: formData.is_digital,
        is_active: formData.is_active,
        is_default: formData.is_default,
        published_status: formData.published_status,
        product: formData.product_id || null,
        attribute_values: formData.attribute_value
          ? [formData.attribute_value]
          : [],
        user,
      };

      // Agregar datos del inventario al FormData
      Object.keys(inventoryData).forEach((key) => {
        if (Array.isArray(inventoryData[key])) {
          inventoryData[key].forEach((item) => {
            formDataRequest.append(key, item);
          });
        } else {
          formDataRequest.append(key, inventoryData[key]);
        }
      });

      // Agregar datos de stock
      formDataRequest.append("units", formData.units || 0);
      formDataRequest.append("units_sold", formData.units_sold || 0);

      // Agregar imágenes
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((imageObj) => {
          formDataRequest.append("images", imageObj.file);
          formDataRequest.append("alt_texts", imageObj.alt_text);
          formDataRequest.append("is_featured_flags", imageObj.is_featured);
          formDataRequest.append("default_flags", imageObj.default);
        });
      }

      await addInventory(formDataRequest).unwrap();
      toast.success("Inventory added successfully");
      // Limpiar localStorage de categorías seleccionadas
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("selectedCategoryIds");
      }
      // Redirigir al formulario de inventario
      router.push("/admin");
    } catch (error) {
      toast.error("Failed to register new Inventory");
    }
  };

  return {
    ...formData,
    isLoading,
    onChange,
    onImageChange,
    onImagesUpdate,
    removeImage,
    onSelectChange,
    onCheckboxChange,
    onSubmit,
  };
}
