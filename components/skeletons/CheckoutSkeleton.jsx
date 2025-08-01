import { Skeleton } from "./Skeleton";
import { SkeletonItemCard } from "./SkeletonItemCard";

export const CheckoutSkeleton = () => {
  return (
    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 animate-pulse">
      <div className="lg:col-span-7 space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <SkeletonItemCard key={item} />
        ))}
      </div>
      <div className="lg:col-span-5 mt-8 lg:mt-0">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="mt-6">
            <Skeleton className="h-10 w-full" />
          </div>
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
          <Skeleton className="h-12 w-full mt-6" />
        </div>
      </div>
    </div>
  );
};
