"use client";

import Image from "next/image";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import StarRatings from "react-star-ratings";
import usePreviewModal from "@/hooks/use-preview-modal";
// import CreateCart from "@/components/CreateCart";
import { useAddItemMutation } from "@/redux/features/cart/cartApiSlice";
import { toast } from "react-hot-toast";

const ProductCard = ({ data }) => {
  const raters = data?.rating?.length;
  let total = 0;
  const rate = data?.rating?.map(({ rating }) => (total += rating));
  const resultado = total / raters || 0;
  const resultadoAdjust = resultado.toFixed(1);
  const stock = data?.stock?.units - data?.stock?.units_sold;
  // const productId = data.id;
  // const newItem = JSON.stringify({ inventory_id: productId });
  const previewModal = usePreviewModal();
  const router = useRouter();
  // const cart = CreateCart();
  // const [CreateCart, { isLoading, error }] = useAddItemMutation();
  const cart_id = "";
  const inventory_id = data.id;
  const count = "";
  const coupon = "";

  // console.log("data", data);

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  /* const onAddToCart = async (event) => {
    event.preventDefault();
    cart.addItem(data);
  }; */
  const onAddToCart = async () => {
    const finalData = { cart_id, inventory_id, count, coupon };
    const res = useAddItemMutation(finalData);
    if (res?.success) {
      toast.success(res?.message);
    } else {
      toast.error(res?.message);
    }
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
        <p className="font-semibold text-lg">{data?.product?.name}</p>
        <p className="text-sm text-gray-500">
          {data?.product?.category[0]?.name}
        </p>
      </div>
      {/* Price & Reiew */}
      <div className="flex flex-wrap items-center space-x-2 mb-2">
        {!resultado ? (
          <div className="font-semibold text-amber-400 py-1 px-2 rounded-full">
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
          {stock < 0 ? (
            <span className="text-red-500">Agotado</span>
          ) : (
            <span className="text-green-500">En Existencia ({stock})</span>
          )}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <Currency value={data?.store_price} />
      </div>
    </div>
  );
};

export default ProductCard;
