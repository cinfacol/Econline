"use client";

import { ShoppingCart } from "lucide-react";

import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import StarRatings from "react-star-ratings";
import { useGetRatingsQuery } from "@/redux/features/ratings/ratingsApiSlice";
// import useCart from "@/hooks/use-cart";

const Info = ({ data }) => {
  // const ratings = useGetRatingsQuery("ratings");
  const raters = data?.rating.length;
  let total = 0;
  const rate = data?.rating?.map(({ rating }) => (total += rating));
  const resultado = total / raters;
  const resultadoAdjust = resultado.toFixed(1);
  // const cart = useCart();

  /* const onAddToCart = () => {
    // cart.addItem(data);
  }; */

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data?.title}</h1>
      <div className="flex flex-wrap items-center space-x-2 mb-2">
        <div className="ratings">
          <StarRatings
            rating={resultado}
            starRatedColor="#ffb829"
            numberOfStars={5}
            starDimension="20px"
            starSpacing="2px"
            name="rating"
          />
        </div>
        <span className="text-gray-500">{resultadoAdjust}</span>

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
        <p className="text-2xl text-gray-900">
          <Currency value={data?.price} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Category:</h3>
          <div>{data?.category}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Description:</h3>
          <div>{data?.description}</div>
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={() => ({})} className="flex items-center gap-x-2">
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
