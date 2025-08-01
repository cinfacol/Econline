import { Skeleton } from "./Skeleton";

export const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm animate-pulse">
      <Skeleton className="aspect-square rounded-xl mb-4" />
      <Skeleton className="h-4 w-3/4 mb-3" />
      <Skeleton className="h-4 w-1/4 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <Skeleton className="h-8 rounded-full mt-6" />
    </div>
  );
};
