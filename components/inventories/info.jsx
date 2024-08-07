"use client";

import { HeartIcon, ShoppingCart } from "lucide-react";

import Currency from "@/components/ui/currency";
import { Button } from "@nextui-org/button";
import StarRatings from "react-star-ratings";
import { useGetProductQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import Link from "next/link";
import AddItem from "@/components/cart/AddItem";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import usePreviewModal from "@/hooks/use-preview-modal";

const Info = ({ inventoryId, auth }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const acceso = auth;
  const { data } = useGetProductQuery(inventoryId);
  const raters = data?.rating?.length;
  let total = 0;
  const rate = data?.rating?.map(({ rating }) => (total += rating));
  const resultado = total / raters || 0;
  const resultadoAdjust = resultado.toFixed(1);
  const stock = data?.stock?.units - data?.stock.units_sold;
  const productId = data?.id;
  const previewModal = usePreviewModal();

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
        {!resultado ? (
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

        {stock < 0 ? (
          <span className="text-red-500">Agotado</span>
        ) : (
          <span className="text-green-500">En Existencia ({stock})</span>
        )}
      </div>
      <div className="mt-3 text-lg font-bold text-red-900 dark:text-white">
        <span className="line-through">
          <Currency value={data?.retail_price} />
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl text-gray-900">
          <Currency value={data?.store_price} />
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
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Vendedor:</h3>
          <div>{data?.user?.full_name}</div>
          <Link
            href={`/products/${data?.user?.id}`}
            className="mr-2 text-blue-600 text-center bg-gray-200 py-1 px-2 rounded-full"
          >
            Otros productos del vendedor
          </Link>
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        {isAuthenticated ? (
          <AddItem data={data} access={acceso} ButtonComponent={true} />
        ) : (
          <div>
            <Button
              color="primary"
              variant="shadow"
              aria-label="Add To Cart"
              onClick={() => {
                router.push("/auth/login");
                previewModal.onClose();
              }}
              className="font-bold"
            >
              Add To Cart
              <span className="px-2">
                {<ShoppingCart size={20} className="text-white-600" />}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
