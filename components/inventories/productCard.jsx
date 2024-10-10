"use client";

import Image from "next/image";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import cloudinaryImageLoader from "@/actions/imageLoader";

import Currency from "@/components/ui/currency";
import { Button } from "@nextui-org/button";
import StarRatings from "react-star-ratings";
import usePreviewModal from "@/hooks/use-preview-modal";
import AddItem from "@/components/cart/AddItem";
import { useAppSelector } from "@/redux/hooks";

export default function ProductCard({ data, auth }) {
  const token = auth;
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const raters = data?.rating?.length;
  let total = 0;
  const rate = data?.rating?.map(({ rating }) => (total += rating));
  const resultado = total / raters || 0;
  const resultadoAdjust = resultado.toFixed(1);
  const stock = data?.stock?.units - data?.stock?.units_sold;
  const previewModal = usePreviewModal();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreviewModal = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data, auth);
  };

  const dat = data;

  return (
    <div className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          loader={cloudinaryImageLoader}
          onClick={handleClick}
          src={data?.image[0]?.image}
          alt={data?.image[0]?.alt_text}
          // fill
          width="500"
          height="500"
          className="aspect-square object-fill rounded-md"
        />
        <div className="opacity-20 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <Button
              isIconOnly
              color="default"
              variant="faded"
              aria-label="ShoppingCart"
              onClick={onPreviewModal}
            >
              {<Expand size={20} className="text-gray-600" />}
            </Button>
            {isAuthenticated ? (
              <AddItem data={dat} access={token} />
            ) : (
              <div>
                <Button
                  isIconOnly
                  color="default"
                  variant="faded"
                  aria-label="ShoppingCart"
                  onClick={() => {
                    router.push("/auth/login");
                  }}
                >
                  {<ShoppingCart size={20} className="text-gray-600" />}
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
        {!resultado ? (
          <div className="font-semibold text-amber-400 py-1 rounded-full">
            <h1>Not Reviews</h1>
          </div>
        ) : (
          <>
            <span className="text-gray-500">{resultadoAdjust}</span>
            <div className="">
              <StarRatings
                rating={resultado}
                starRatedColor="#ffb829"
                numberOfStars={1}
                starDimension="20px"
                starSpacing="2px"
                name="rating"
              />
            </div>

            <span className="text-gray-500">({raters})</span>
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
}
