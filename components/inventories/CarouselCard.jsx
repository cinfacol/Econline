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
      className="bg-gray-100 group rounded-xl border shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-lg mx-2 cursor-pointer overflow-hidden relative flex items-center justify-center aspect-square"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" ? handleClick() : null)}
    >
      <Image
        loader={cloudinaryImageLoader}
        src={data?.image[0]?.image || "/placeholder.png"}
        alt={data?.image[0]?.alt_text}
        fill
        className={`object-center !object-contain w-full h-full rounded-xl ${imgClassName}`}
        priority={priority}
        quality={80}
      />
      <span className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs font-semibold px-2 py-1 text-center rounded-b-xl truncate pointer-events-none">
        {data?.product?.name}
      </span>
    </div>
  );
};

export default ProductCard;
