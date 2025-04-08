import { Skeleton } from "@/components/ui/skeleton";

export const CheckoutSkeleton = () => {
  return (
    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 animate-pulse">
      {/* Columna de items */}
      <div className="lg:col-span-7">
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 border rounded-lg p-4"
            >
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Columna de resumen */}
      <div className="lg:col-span-5 mt-8 lg:mt-0">
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />

          {/* Opciones de envío */}
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Cupón */}
          <div className="mt-6">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Resumen de totales */}
          <div className="space-y-2 mt-6">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          </div>

          {/* Botón de pago */}
          <Skeleton className="h-12 w-full mt-6" />
        </div>
      </div>
    </div>
  );
};
