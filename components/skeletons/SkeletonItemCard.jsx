import { Skeleton } from "./Skeleton";

export const SkeletonItemCard = () => (
  <div className="flex items-center gap-4 border rounded-lg p-4">
    <Skeleton className="h-24 w-24 rounded-md" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);
