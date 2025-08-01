import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const Skeleton = forwardRef(function Skeleton(
  { className, variant = "pulse", ...props },
  ref
) {
  const animation =
    variant === "shimmer"
      ? "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"
      : "animate-pulse";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "rounded-md bg-gray-200 dark:bg-gray-700",
        animation,
        className
      )}
      {...props}
    />
  );
});

export { Skeleton };
