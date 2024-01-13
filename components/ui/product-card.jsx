"use client";

import Image from "next/image";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import StarRatings from "react-star-ratings";
// import usePreviewModal from "@/hooks/use-preview-modal";
// import useCart from "@/hooks/use-cart";

const ProductCard = ({ data }) => {
  // const previewModal = usePreviewModal();
  // const cart = useCart();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview = (event) => {
    event.stopPropagation();

    // previewModal.onOpen(data);
  };

  const onAddToCart = (event) => {
    event.stopPropagation();

    // cart.addItem(data);
  };
  return (
    <div
      onClick={handleClick}
      className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4"
    >
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          src={data?.image[0]?.image}
          alt={data?.image[0]?.alt_text}
          fill
          className="aspect-square object-fill rounded-md"
        />
        <div className="opacity-20 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600" />}
            />
            <IconButton
              onClick={onAddToCart}
              icon={<ShoppingCart size={20} className="text-gray-600" />}
            />
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg">{data.title}</p>
        <p className="text-sm text-gray-500">{data.category}</p>
      </div>
      {/* Price & Reiew */}
      <div className="flex flex-wrap items-center space-x-2 mb-2">
        <div className="ratings">
          <StarRatings
            rating={3}
            starRatedColor="#ffb829"
            numberOfStars={5}
            starDimension="20px"
            starSpacing="2px"
            name="rating"
          />
        </div>
        <span className="text-yellow-500">3</span>

        <svg
          width="6px"
          height="6px"
          viewBox="0 0 6 6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="3" cy="3" r="3" fill="#DBDBDB" />
        </svg>

        <span className="text-green-500">Verified</span>
      </div>
      <div className="flex items-center justify-between">
        <Currency value={data?.price} />
      </div>
    </div>
  );
};

export default ProductCard;
