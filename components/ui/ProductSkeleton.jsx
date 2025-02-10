const Skeleton = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
      {/* Imagen */}
      <div className="aspect-square rounded-xl bg-gray-200 mb-4" />

      {/* Título */}
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />

      {/* Precio */}
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />

      {/* Descripción */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>

      {/* Botón */}
      <div className="h-8 bg-gray-200 rounded-full mt-4" />
    </div>
  );
};

export default Skeleton;
