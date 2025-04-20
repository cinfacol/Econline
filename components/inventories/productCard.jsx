"use client";

import Image from "next/image";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import cloudinaryImageLoader from "@/actions/imageLoader";

import { Currency } from "@/components/ui";
import { Button } from "@/components/ui/button";
import StarRatings from "react-star-ratings";
import usePreviewModal from "@/hooks/use-preview-modal";
import AddItem from "@/components/cart/AddItem";
import { useAppSelector } from "@/redux/hooks";

const ProductCard = ({ data, priority = false }) => {
  // const token = auth;
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Client-side rating calculation removed - using data.average_rating and data.rating_count from API
  const stock = data?.stock?.units - data?.stock?.units_sold;
  const previewModal = usePreviewModal();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const dat = data;

  return (
    <div className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          loader={cloudinaryImageLoader}
          onClick={handleClick}
          src={data?.image[0]?.image || "/placeholder.png"}
          alt={data?.image[0]?.alt_text}
          fill
          sizes="(max-width: 500px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="object-cover rounded-xl"
          priority={priority} // Use the passed priority prop
          quality={80}
          // loading="lazy" // Remove loading="lazy" when priority is true
        />
        <div className="opacity-20 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                // event.stopPropagation();
                previewModal.onOpen(data);
              }}
            >
              {<Expand />}
            </Button>
            {isAuthenticated ? (
              <AddItem data={dat} ButtonComponent={false} />
            ) : (
              <div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    router.push("/auth/login");
                  }}
                >
                  {<ShoppingCart />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg">{data?.product?.name}</p>
        <p className="text-sm text-gray-500 line-clamp-2">
          {data?.product?.description}
        </p>
      </div>
      {/* Price & Reiew */}
      <div className="flex flex-wrap items-center space-x-2 mb-2">
        {data?.rating_count === 0 ? ( // Check rating_count from API
          <div className="font-semibold text-amber-400 py-1 rounded-full">
            <h1>No Reviews</h1>
          </div>
        ) : (
          <>
            {/* Display average_rating from API */}
            <span className="text-gray-500">
              {data?.average_rating?.toFixed(1)}
            </span>
            <div className="">
              <StarRatings
                rating={data?.average_rating || 0} // Use average_rating from API
                starRatedColor="#ffb829"
                numberOfStars={1}
                starDimension="20px"
                starSpacing="2px"
                name="rating"
              />
            </div>
            {/* Display rating_count from API */}
            <span className="text-gray-500">({data?.rating_count})</span>
          </>
        )}

        <svg
          width="6px"
          height="6px"
          viewBox="0 0 6 6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="3" cy="3" r="3" fill="#DBDBDB" />
        </svg>

        <span className="text-green-500">
          {stock <= 0 ? (
            <span className="text-red-500">Agotado</span>
          ) : (
            <span className="text-green-500">En Existencia ({stock})</span>
          )}
        </span>
      </div>
      <div className="text-lg font-bold text-red-900 dark:text-white">
        <span className="line-through">
          <Currency value={data?.retail_price} />
        </span>
      </div>
      <div className="flex items-center justify-between mt-0">
        <span className="text-lg text-gray-900">
          <Currency value={data?.store_price} />
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
