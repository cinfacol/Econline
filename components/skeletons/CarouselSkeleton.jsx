import { Skeleton } from "./Skeleton";

export const CarouselSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm animate-pulse">
      <Skeleton className="aspect-square rounded-xl mb-4" />
    </div>
  );
};
