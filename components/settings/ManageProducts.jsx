"use client";

import { useState } from "react";
// import {
//   useCreateProductMutation,
//   useUpdateProductMutation,
//   useGetProductQuery,
// } from "@/redux/api/apiSlice";
import { useCreateProductMutation } from "@/redux/features/inventories/inventoriesApiSlice";

export default function ManageProducts() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [
    createProduct,
    { isLoading: createLoading, isSuccess: createSuccess, error: createError },
  ] = useCreateProductMutation();
  // const [updateProduct, { isLoading: updateLoading, isSuccess: updateSuccess, error: updateError }] =
  //   useUpdateProductMutation();
  // const { data: product, isLoading: productLoading, error: productError } = useGetProductQuery(1); // Replace 1 with the product ID

  const validateForm = () => {
    let newErrors = {};
    if (!productName)
      newErrors.productName = "El nombre del producto es requerido.";
    if (!productDescription)
      newErrors.productDescription =
        "La descripción del producto es requerida.";
    if (!productPrice)
      newErrors.productPrice = "El precio del producto es requerido.";
    if (isNaN(Number(productPrice)))
      newErrors.productPrice = "El precio debe ser un número.";
    if (!productImage)
      newErrors.productImage = "La imagen del producto es requerida.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("price", productPrice);
    if (productImage) {
      formData.append("image", productImage);
    }

    try {
      await createProduct(formData).unwrap();
      console.log("Product created successfully!");
      // Optionally, reset the form
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductImage(null);
      setErrors({});
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <p className="text-gray-600 mb-6">
        Completa el formulario para cargar un nuevo producto.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nombre del Producto
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              setErrors({ ...errors, productName: "" });
            }}
            required
          />
          {errors.productName && (
            <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="productDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Descripción
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={productDescription}
            onChange={(e) => {
              setProductDescription(e.target.value);
              setErrors({ ...errors, productDescription: "" });
            }}
            required
          />
          {errors.productDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.productDescription}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Categoría del Producto
          </label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={productName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              setErrors({ ...errors, categoryName: "" });
            }}
            required
          />
          {errors.categoryName && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryName}</p>
          )}
        </div>
        {/* <div>
          <label
            htmlFor="productPrice"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Precio
          </label>
          <input
            type="number"
            id="productPrice"
            name="productPrice"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={productPrice}
            onChange={(e) => {
              setProductPrice(e.target.value);
              setErrors({ ...errors, productPrice: "" });
            }}
            required
          />
          {errors.productPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="productImage"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Imagen
          </label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => {
              setProductImage(e.target.files?.[0]);
              setErrors({ ...errors, productImage: "" });
            }}
          />
          {errors.productImage && (
            <p className="text-red-500 text-sm mt-1">{errors.productImage}</p>
          )}
        </div> */}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={createLoading}
        >
          {createLoading ? "Cargando..." : "Cargar Producto"}
        </button>
        {createSuccess && (
          <p className="text-green-500 mt-2">Producto cargado con éxito!</p>
        )}
        {createError && (
          <p className="text-red-500 mt-2">
            {createError?.data?.detail || "Error al cargar el producto."}
          </p>
        )}
      </form>
    </div>
  );
}
