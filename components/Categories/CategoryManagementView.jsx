"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateCategoryForm from "@/components/forms/CreateCategoryForm";
import {
  useGetCategoriesQuery,
  useSetSelectedCategoriesMutation,
} from "@/redux/features/categories/categoriesApiSlice";

export default function CategoryManagementView() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [setSelectedCategoriesMutation] = useSetSelectedCategoriesMutation();
  const { data: categoriesData, isLoading, refetch } = useGetCategoriesQuery();
  const router = useRouter();

  // Función para construir las categorías desde los datos
  const buildCategoriesFromData = () => {
    const result = [];
    const { ids = [], entities = {} } = categoriesData || {};

    const items = ids?.map((id) => entities[id]).filter(Boolean);

    items?.forEach((parentCat) => {
      // Agrega el padre SIEMPRE usando id (UUID)
      result.push({
        id: parentCat.id, // id para selección
        name: parentCat.name,
        parent: null,
        isSubCategory: false,
      });
      // Si tiene hijas, agrégalas también
      if (parentCat.sub_categories?.length > 0) {
        parentCat.sub_categories.forEach((subCat) => {
          result.push({
            id: subCat.id, // id para selección
            name: subCat.name,
            parent: parentCat.name,
            isSubCategory: true,
          });
        });
      }
    });

    return result;
  };

  const allCategories = buildCategoriesFromData();

  const handleCategoryCreated = async (newCategory) => {
    setShowCreateForm(false);
    // Refrescar las categorías para mostrar la nueva
    await refetch();
  };

  const handleContinueToProduct = () => {
    setSelectedCategoriesMutation(selectedCategories);
    // Redirigir a la página de crear producto
    router.push("/admin/products/new"); // Ajusta la ruta según tu estructura
  };

  const handleSelectCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category.id)
        ? prev.filter((id) => id !== category.id)
        : [...prev, category.id]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestión de Categorías
          </h1>
          <p className="text-gray-600">
            Crea y gestiona las categorías de tus productos
          </p>
        </div>

        {!showCreateForm ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel de categorías existentes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Categorías Existentes
                </h2>
                <span className="text-sm text-gray-500">
                  {allCategories.length} categorías
                </span>
              </div>

              {allCategories.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allCategories
                    .filter((cat) => cat.id !== undefined && cat.id !== null)
                    .map((category) => (
                      <div
                        key={String(category.id)}
                        onClick={() => handleSelectCategory(category)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedCategories.includes(category.id)
                            ? "bg-blue-50 border-blue-300"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {category.name}
                            </h3>
                            {category.parent && (
                              <p className="text-sm text-gray-500">
                                Subcategoría de: {category.parent}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                category.isSubCategory
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {category.isSubCategory
                                ? "Subcategoría"
                                : "Principal"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    No hay categorías creadas aún
                  </p>
                </div>
              )}
            </div>

            {/* Panel de acciones */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Acciones
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Crear Nueva Categoría
                </button>

                {selectedCategories.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Categorías seleccionadas:{" "}
                      <strong>
                        {selectedCategories
                          .map(
                            (id) =>
                              allCategories.find((cat) => cat.id === id)?.name
                          )
                          .join(", ")}
                      </strong>
                    </p>
                    <button
                      onClick={handleContinueToProduct}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        ></path>
                      </svg>
                      Continuar a Crear Producto
                    </button>
                  </div>
                )}

                {selectedCategories.length === 0 &&
                  allCategories.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-500 mb-3">
                        Selecciona una categoría para continuar a crear
                        productos
                      </p>
                      <button
                        onClick={handleContinueToProduct}
                        className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center"
                        disabled
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          ></path>
                        </svg>
                        Continuar a Crear Producto
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ) : (
          <CreateCategoryForm
            onCategoryCreated={handleCategoryCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </div>
    </div>
  );
}
