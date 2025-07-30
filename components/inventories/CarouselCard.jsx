"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import cloudinaryImageLoader from "@/actions/imageLoader";

const ProductCard = ({ data, priority = false, imgClassName = "" }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${data?.id}`);
  };

  return (
    <div
      className="bg-gray-100 group rounded-xl border shadow-sm p-2 flex flex-col justify-between items-stretch transition-transform duration-200 hover:scale-105 hover:shadow-lg"
      style={{ minHeight: "220px", maxHeight: "220px" }}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" ? handleClick() : null)}
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-200 relative flex items-center justify-center mx-auto overflow-hidden">
        <Image
          loader={cloudinaryImageLoader}
          src={data?.image[0]?.image || "/placeholder.png"}
          alt={data?.image[0]?.alt_text}
          width={80}
          height={80}
          className={`object-cover rounded-xl w-full h-full ${imgClassName}`}
          priority={priority}
          quality={80}
        />
      </div>
      {/* Description */}
      <div className="flex flex-col flex-1 justify-between mt-2 gap-1">
        <p className="font-semibold text-base text-gray-950 text-center truncate">
          {data?.product?.name}
        </p>
        <p className="text-xs text-gray-500 line-clamp-2 text-center min-h-[2rem]">
          {data?.product?.description || <span className="opacity-0">-</span>}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
