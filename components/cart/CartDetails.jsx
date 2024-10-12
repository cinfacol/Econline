"use client";

import { Spinner } from "@/components/common";
import { useDispatch } from "react-redux";
import {
  useGetItemsQuery,
  useDecQtyMutation,
  useIncQtyMutation,
  useRemoveItemMutation,
} from "@/redux/features/cart/cartApiSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Currency from "@/components/ui/currency";
import { toast } from "sonner";
import { Button } from "@nextui-org/button";
import AddItem from "./AddItem";
import cloudinaryImageLoader from "@/actions/imageLoader";

export default function CartDetails({ title }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isSuccess, isLoading, error } = useGetItemsQuery();
  const [removeItem, { isLoading: loading, error: err }] =
    useRemoveItemMutation();
  const [decQty, { error: er }] = useDecQtyMutation();
  const [incQty, { error: e }] = useIncQtyMutation();

  // Destructure data and handle empty cart case concisely
  const { ids = [], entities = {} } = data || {};

  // Calculate cart items
  const items = ids.map((id) => entities[id] || null).filter(Boolean);

  // Calculate totals
  const subTotal = items.reduce(
    (acc, item) => acc + item.inventory.store_price * item.quantity,
    0
  );
  const taxes = items.reduce(
    (acc, item) =>
      acc + item.inventory.taxe * item.inventory.store_price * item.quantity,
    0
  );
  const save = items.reduce(
    (acc, item) =>
      acc +
      (item.inventory.retail_price - item.inventory.store_price) *
        item.quantity,
    0
  );

  const handleRemove = async (Item) => {
    const itemId = Item?.inventory?.id;
    try {
      await removeItem({ itemId }).unwrap();
      toast.success("Product removed successfully");
    } catch (error) {
      toast.error(`Error: ${error?.data?.error}`);
    }
  };

  const handleIncQty = async (inventoryId) => {
    try {
      await incQty({ inventoryId }).unwrap();
      toast.success("Product successfully increased");
    } catch (error) {
      toast.error(`Error: ${error?.data?.error}`);
    }
  };

  const handleDecQty = async (inventoryId) => {
    try {
      await decQty({ inventoryId }).unwrap();
      toast.success("Product successfully decreased");
    } catch (error) {
      toast.error(`Error: ${error?.data?.error}`);
    }
  };

  // Render loading and error states at the end
  if (isLoading || loading) return <Spinner lg />;
  if (error || err || er || e)
    return (
      <p>
        Error:{" "}
        {error?.data?.detail ||
          err?.data?.detail ||
          er?.data?.detail ||
          e?.data?.detail}
      </p>
    );

  if (isSuccess)
    return (
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            {title}
          </h2>

          {ids.length === 0 ? (
            <div>
              Cart is empty. <Link href="/">Go shopping</Link>
            </div>
          ) : (
            <>
              <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                  <div className="space-y-2">
                    {ids?.map((id) => {
                      const Item = entities[id];
                      const inventoryId = Item?.inventory?.id;
                      return (
                        <div
                          key={Item.id}
                          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                        >
                          <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                            <Link
                              href={`/product/${Item?.inventory?.id}`}
                              className="shrink-0 md:order-1"
                            >
                              <Image
                                loader={cloudinaryImageLoader}
                                src={Item?.inventory?.image[0].image}
                                alt={Item?.inventory?.image[0].alt_text}
                                width={100}
                                height={100}
                              />
                            </Link>

                            <label htmlFor="counter-input" className="sr-only">
                              Choose quantity:
                            </label>
                            <div className="flex items-center justify-between md:order-3 md:justify-end">
                              <div className="flex items-center">
                                {Item?.quantity <= 1 ? (
                                  <button
                                    type="button"
                                    id="decrement-button"
                                    onClick={() => handleDecQty(inventoryId)}
                                    data-input-counter-decrement="counter-input"
                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 cursor-not-allowed"
                                    disabled
                                  >
                                    <svg
                                      className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 18 2"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M1 1h16"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    id="decrement-button"
                                    onClick={() => handleDecQty(inventoryId)}
                                    data-input-counter-decrement="counter-input"
                                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                  >
                                    <svg
                                      className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 18 2"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M1 1h16"
                                      />
                                    </svg>
                                  </button>
                                )}

                                <input
                                  type="text"
                                  id="counter-input"
                                  data-input-counter
                                  className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                                  placeholder=""
                                  value={Item?.quantity}
                                  required
                                />
                                <button
                                  type="button"
                                  id="increment-button"
                                  onClick={() => handleIncQty(inventoryId)}
                                  data-input-counter-increment="counter-input"
                                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                                >
                                  <svg
                                    className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 18"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 1v16M1 9h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <div className="text-end md:order-4 md:w-32">
                                <div className="text-base font-bold text-gray-900 dark:text-white">
                                  <Currency
                                    value={
                                      Item?.inventory?.store_price *
                                      Item?.quantity
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                              <Link
                                href={`/product/${Item?.inventory?.id}`}
                                className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                              >
                                <span className="px-2 font-semibold text-lg">
                                  {Item?.inventory?.product?.name}
                                </span>
                                <p className="px-2 text-sm text-gray-500 line-clamp-2">
                                  {Item?.inventory?.product?.description}
                                </p>
                              </Link>

                              <div className="flex items-center gap-4">
                                <Button
                                  color="warning"
                                  variant="shadow"
                                  aria-label="Apply Code"
                                  className="font-bold"
                                  onClick={(e) => handleRemove(Item, e)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="hidden xl:mt-8 xl:block">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      People also bought
                    </h3>
                    <div className="mt-6 grid grid-cols-3 gap-4 sm:mt-8">
                      <div className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <Link href="/" className="overflow-hidden rounded">
                          <Image
                            className="mx-auto h-44 w-44 dark:hidden"
                            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg"
                            alt="imac image"
                            width={50}
                            height={50}
                          />
                          <Image
                            className="mx-auto hidden h-44 w-44 dark:block"
                            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg"
                            alt="imac image"
                            width={50}
                            height={50}
                          />
                        </Link>
                        <div>
                          <Link
                            href="/"
                            className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                          >
                            iMac 27”
                          </Link>
                          <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            This generation has some improvements, including a
                            longer continuous battery life.
                          </p>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            <span className="line-through">
                              <Currency value={399.99} />
                            </span>
                          </div>
                          <div className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                            <Currency value={299} />
                          </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2.5">
                          <Button
                            data-tooltip-target="favourites-tooltip-1"
                            type="button"
                            className="gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                            variant="destructive"
                          >
                            <svg
                              className="h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                              ></path>
                            </svg>
                          </Button>
                          <div
                            id="favourites-tooltip-1"
                            role="tooltip"
                            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                          >
                            Add to favourites
                            <div
                              className="tooltip-arrow"
                              data-popper-arrow
                            ></div>
                          </div>
                          <AddItem ButtonComponent={true} />
                        </div>
                      </div>
                      <div className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <Link href="/" className="overflow-hidden rounded">
                          <Image
                            className="mx-auto h-44 w-44 dark:hidden"
                            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-light.svg"
                            alt="imac image"
                            width={50}
                            height={50}
                          />
                          <Image
                            className="mx-auto hidden h-44 w-44 dark:block"
                            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5-dark.svg"
                            alt="imac image"
                            width={50}
                            height={50}
                          />
                        </Link>
                        <div>
                          <Link
                            href="/"
                            className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                          >
                            Playstation 5
                          </Link>
                          <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            This generation has some improvements, including a
                            longer continuous battery life.
                          </p>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            <span className="line-through">
                              {" "}
                              <Currency value={799.99} />{" "}
                            </span>
                          </div>
                          <div className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                            <Currency value={499} />
                          </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2.5">
                          <Button
                            data-tooltip-target="favourites-tooltip-2"
                            type="button"
                            className="gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                            variant="destructive"
                          >
                            <svg
                              className="h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                              ></path>
                            </svg>
                          </Button>
                          <div
                            id="favourites-tooltip-2"
                            role="tooltip"
                            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                          >
                            Add to favourites
                            <div
                              className="tooltip-arrow"
                              data-popper-arrow
                            ></div>
                          </div>
                          <AddItem ButtonComponent={true} />
                        </div>
                      </div>
                      <div className="space-y-6 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <Link href="/" className="overflow-hidden rounded">
                          <Image
                            className="mx-auto h-44 w-44 dark:hidden"
                            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg"
                            alt="imac image"
                            width={50}
                            height={50}
                          />
                          <Image
                            className="mx-auto hidden h-44 w-44 dark:block"
                            src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-dark.svg"
                            alt="imac image"
                            width={50}
                            height={50}
                          />
                        </Link>
                        <div>
                          <Link
                            href="/"
                            className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                          >
                            Apple Watch Series 8
                          </Link>
                          <p className="mt-2 text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-2">
                            This generation has some improvements, including a
                            longer continuous battery life.
                          </p>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            <span className="line-through">
                              {" "}
                              <Currency value={1799.99} />{" "}
                            </span>
                          </div>
                          <div className="text-lg font-bold leading-tight text-red-600 dark:text-red-500">
                            <Currency value={1199} />
                          </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2.5">
                          <Button
                            data-tooltip-target="favourites-tooltip-3"
                            type="button"
                            className="gap-2 rounded-lg border border-gray-200 bg-white p-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                            variant="destructive"
                          >
                            <svg
                              className="h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                              ></path>
                            </svg>
                          </Button>
                          <div
                            id="favourites-tooltip-3"
                            role="tooltip"
                            className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700"
                          >
                            Add to favourites
                            <div
                              className="tooltip-arrow"
                              data-popper-arrow
                            ></div>
                          </div>
                          <AddItem ButtonComponent={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                    <form className="space-y-4">
                      <div>
                        <label
                          htmlFor="voucher"
                          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {" "}
                          Do you have a voucher or gift card?{" "}
                        </label>
                        <input
                          type="text"
                          id="voucher"
                          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                          placeholder=""
                          required
                        />
                      </div>
                      <Button
                        color="primary"
                        variant="shadow"
                        aria-label="Apply Code"
                        className="font-bold"
                      >
                        Apply Code
                      </Button>
                    </form>
                  </div>
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Order summary
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Sub Total
                          </dt>
                          <dd className="text-base font-medium text-gray-900 dark:text-white">
                            <Currency value={subTotal} />
                          </dd>
                        </dl>

                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Savings
                          </dt>
                          <dd className="text-base font-medium text-green-600 line-through">
                            <Currency value={save} />
                          </dd>
                        </dl>

                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Coupon
                          </dt>
                          <dd className="text-base font-medium text-green-600 dark:text-white line-through">
                            <Currency value={0} />
                          </dd>
                        </dl>

                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Tax
                          </dt>
                          <dd className="text-base font-medium text-gray-900 dark:text-white">
                            <Currency value={taxes} />
                          </dd>
                        </dl>
                      </div>

                      <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                        <dt className="text-base font-bold text-gray-900 dark:text-white">
                          Total
                        </dt>
                        <dd className="text-base font-bold text-gray-900 dark:text-white">
                          <Currency value={subTotal + taxes} />
                        </dd>
                      </dl>
                    </div>
                    <Button
                      color="primary"
                      variant="shadow"
                      aria-label="Apply Code"
                      className="font-bold"
                      onClick={() => router.push("/shipping")}
                    >
                      Proceed to Checkout
                    </Button>

                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {" "}
                        or{" "}
                      </span>
                      <Link
                        href="/product"
                        title="back to explore products"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
                      >
                        Continue Shopping
                        <svg
                          className="h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 12H5m14 0-4 4m4-4-4-4"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    );
}
