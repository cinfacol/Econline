"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function MediaModal({ isOpen, onClose, images, onSave }) {
  const [currentImages, setCurrentImages] = useState(images || []);
  const [newImage, setNewImage] = useState({
    file: null,
    alt_text: "",
    is_featured: false,
    default: false,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage({
        ...newImage,
        file,
        alt_text: newImage.alt_text || `Imagen de ${file.name}`,
      });
    }
  };

  const handleAddImage = () => {
    if (!newImage.file || !newImage.alt_text.trim()) {
      alert(
        "Por favor selecciona una imagen y proporciona un texto alternativo"
      );
      return;
    }

    // Si esta imagen será la por defecto, quitar default de las demás
    let updatedImages = currentImages;
    if (newImage.default) {
      updatedImages = currentImages.map((img) => ({ ...img, default: false }));
    }

    // Si esta imagen será destacada, quitar featured de las demás
    if (newImage.is_featured) {
      updatedImages = updatedImages.map((img) => ({
        ...img,
        is_featured: false,
      }));
    }

    const imageWithId = {
      ...newImage,
      id: Date.now(), // ID temporal para el frontend
    };

    setCurrentImages([...updatedImages, imageWithId]);
    setNewImage({
      file: null,
      alt_text: "",
      is_featured: false,
      default: false,
    });
  };

  const handleRemoveImage = (imageId) => {
    setCurrentImages(currentImages.filter((img) => img.id !== imageId));
  };

  const handleImageUpdate = (imageId, field, value) => {
    setCurrentImages(
      currentImages.map((img) => {
        if (img.id === imageId) {
          // Si se está marcando como default o featured, desmarcar las demás
          if ((field === "default" || field === "is_featured") && value) {
            const updatedImages = currentImages.map((otherImg) =>
              otherImg.id !== imageId
                ? { ...otherImg, [field]: false }
                : otherImg
            );
            return { ...img, [field]: value };
          }
          return { ...img, [field]: value };
        }
        return img;
      })
    );
  };

  const handleSave = () => {
    onSave(currentImages);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Gestión de Imágenes del Inventario
        </h2>

        {/* Sección para agregar nueva imagen */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold mb-3">Agregar Nueva Imagen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Seleccionar Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {newImage.file && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(newImage.file)}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Texto Alternativo *
              </label>
              <input
                type="text"
                value={newImage.alt_text}
                onChange={(e) =>
                  setNewImage({ ...newImage, alt_text: e.target.value })
                }
                placeholder="Describe la imagen..."
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newImage.is_featured}
                    onChange={(e) =>
                      setNewImage({
                        ...newImage,
                        is_featured: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Imagen destacada</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newImage.default}
                    onChange={(e) =>
                      setNewImage({ ...newImage, default: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Imagen por defecto</span>
                </label>
              </div>
            </div>
          </div>
          <Button
            onClick={handleAddImage}
            className="mt-3"
            disabled={!newImage.file || !newImage.alt_text.trim()}
          >
            Agregar Imagen
          </Button>
        </div>

        {/* Lista de imágenes agregadas */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Imágenes Agregadas ({currentImages.length})
          </h3>
          {currentImages.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay imágenes agregadas
            </p>
          ) : (
            <div className="space-y-4">
              {currentImages.map((image, index) => (
                <div key={image.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div>
                      <img
                        src={URL.createObjectURL(image.file)}
                        alt={image.alt_text}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {image.file.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Texto Alternativo
                      </label>
                      <input
                        type="text"
                        value={image.alt_text}
                        onChange={(e) =>
                          handleImageUpdate(
                            image.id,
                            "alt_text",
                            e.target.value
                          )
                        }
                        className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={image.is_featured}
                          onChange={(e) =>
                            handleImageUpdate(
                              image.id,
                              "is_featured",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">Destacada</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={image.default}
                          onChange={(e) =>
                            handleImageUpdate(
                              image.id,
                              "default",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">Por defecto</span>
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones del modal */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Imágenes ({currentImages.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
