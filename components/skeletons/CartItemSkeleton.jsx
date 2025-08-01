import { SkeletonItemCard } from "./SkeletonItemCard";

export function CartItemSkeleton({ count = 1 }) {
  return Array.from({ length: count }, (_, index) => (
    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <SkeletonItemCard />
    </div>
  ));
}
