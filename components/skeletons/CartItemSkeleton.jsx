import { Skeleton } from "@/components/skeletons/skeleton";

export function CartItemSkeleton({ count = 1 }) {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <div
        key={index}
        className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800"
      >
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-md" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </div>
    ));
}
