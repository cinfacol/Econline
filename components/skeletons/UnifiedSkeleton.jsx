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

// export const ProductSkeleton = () => {
//   return (
//     <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
//       {/* Imagen */}
//       <Skeleton className="aspect-square rounded-xl mb-3" />

//       {/* Título */}
//       <Skeleton className="h-4 rounded w-3/4 mb-3" />

//       {/* Precio */}
//       <Skeleton className="h-4 rounded w-1/4 mb-3" />

//       {/* Descripción */}
//       <div className="space-y-2">
//         <Skeleton className="h-3 rounded w-full" />
//         <Skeleton className="h-3 rounded w-5/6" />
//       </div>

//       {/* Botón */}
//       <Skeleton className="h-8 rounded-full mt-6" />
//     </div>
//   );
// };

// export const CarouselSkeleton = () => {
//   return (
//     <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
//       {/* Imagen */}
//       <Skeleton className="aspect-square rounded-xl mb-3" />
//     </div>
//   );
// };

// const SkeletonItemCard = () => (
//   <div className="flex items-center gap-4 border rounded-lg p-4">
//     <Skeleton className="h-24 w-24 rounded-md" />
//     <div className="flex-1 space-y-2">
//       <Skeleton className="h-4 w-3/4" />
//       <Skeleton className="h-4 w-1/2" />
//       <Skeleton className="h-4 w-1/4" />
//     </div>
//   </div>
// );

/* export function CartItemSkeleton({ count = 1 }) {
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
} */

// export const CheckoutSkeleton = () => {
//   return (
//     <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 animate-pulse">
//       {/* Columna de items */}
//       <div className="lg:col-span-7">
//         <div className="space-y-4">
//           {[1, 2, 3, 4].map((item) => (
//             <div
//               key={item}
//               className="flex items-center gap-4 border rounded-lg p-4"
//             >
//               <Skeleton className="h-24 w-24 rounded-md" />
//               <div className="flex-1 space-y-2">
//                 <Skeleton className="h-4 w-3/4" />
//                 <Skeleton className="h-4 w-1/2" />
//                 <Skeleton className="h-4 w-1/4" />
//                 <Skeleton className="h-4 w-1/4" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Columna de resumen */}
//       <div className="lg:col-span-5 mt-8 lg:mt-0">
//         <div className="bg-gray-50 rounded-lg p-6 space-y-4">
//           <Skeleton className="h-6 w-1/3" />

//           {/* Opciones de envío */}
//           <div className="space-y-2 mt-4">
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-full" />
//             <Skeleton className="h-4 w-3/4" />
//           </div>

//           {/* Cupón */}
//           <div className="mt-6">
//             <Skeleton className="h-10 w-full" />
//           </div>

//           {/* Resumen de totales */}
//           <div className="space-y-2 mt-6">
//             <div className="flex justify-between">
//               <Skeleton className="h-4 w-1/4" />
//               <Skeleton className="h-4 w-1/4" />
//             </div>
//             <div className="flex justify-between">
//               <Skeleton className="h-4 w-1/3" />
//               <Skeleton className="h-4 w-1/4" />
//             </div>
//             <div className="flex justify-between">
//               <Skeleton className="h-5 w-1/3" />
//               <Skeleton className="h-5 w-1/4" />
//             </div>
//           </div>

//           {/* Botón de pago */}
//           <Skeleton className="h-12 w-full mt-6" />
//         </div>
//       </div>
//     </div>
//   );
// };
