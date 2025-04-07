import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12">
      {/* Skeleton para la lista de items */}
      <div className="lg:col-span-7">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton para el formulario de envío */}
      <div className="lg:col-span-5">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
