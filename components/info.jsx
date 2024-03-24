"use client";

import { HeartIcon, ShoppingCart } from "lucide-react";

import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import StarRatings from "react-star-ratings";
import { useGetReviewsByProductIdQuery } from "@/redux/features/reviews/ratingsApiSlice";
import CreateCart from "@/components/CreateCart";
import { useGetEntity } from "@/hooks";

const Info = ({ inventoryId }) => {
  // useGetEntity es un hook que recibe el id de un producto y devuelve toda la información relacionada con ese producto
  const data = useGetEntity(inventoryId);
  const raters = data?.rating?.length;
  let total = 0;
  const rate = data?.rating?.map(({ rating }) => (total += rating));
  const resultado = total / raters;
  const resultadoAdjust = resultado.toFixed(1);
  const cart = CreateCart();

  const onAddToCart = (event) => {
    event.stopPropagation();

    cart.addItem(data);
  };

  return (
    <div>
      <div className="flex space-x-4">
        <h1 className="text-3xl font-bold text-gray-900">{data?.title}</h1>
        <button
          type="button"
          className="relative rounded-full p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Favorites</span>
          <HeartIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap items-center space-x-2 mb-2">
        {raters == 0 ? (
          <div className="mr-2 text-blue-600 bg-gray-200 py-1 px-2 rounded-full">
            <h1>No Reviews yet</h1>
          </div>
        ) : (
          <>
            <span className="text-gray-500">{resultadoAdjust}</span>
            <div className="">
              <StarRatings
                rating={resultado}
                starRatedColor="#ffb829"
                numberOfStars={5}
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

        <span className="text-green-500">Verified</span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl text-gray-900">
          <Currency value={data?.retail_price} />
        </span>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Category:</h3>
          <div>{data?.product?.category[0]?.name}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Description:</h3>
          <div>{data?.product?.description}</div>
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
