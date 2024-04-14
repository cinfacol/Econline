"use client";

import { Spinner } from "@/components/common";
import { useGetItemsQuery } from "@/redux/features/cart/cartApiSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartList({ title }) {
  const router = useRouter();
  const { data, isSuccess, isLoading, error } = useGetItemsQuery();

  // Early return for loading and error states
  if (isLoading) return <Spinner lg />;
  if (error) return <p>Error: {error?.data?.detail}</p>;

  // Destructure data and handle empty cart case concisely
  const { ids = [] } = data || {}; // Default to empty array
  const { entities = [] } = data || {}; // Default to empty array

  if (isSuccess)
    return (
      <>
        <h1 className="py-4 text-2xl">{title}</h1>

        {ids.length === 0 ? (
          <div>
            Cart is empty. <Link href="/">Go shopping</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                {ids?.map((id) => {
                  const Item = entities[id];
                  return (
                    <tbody key={Item.id}>
                      <tr>
                        <td>
                          <Link
                            href={`/product/${Item?.inventory?.id}`}
                            className="flex items-center"
                          >
                            <Image
                              src={Item?.inventory?.image[0].image}
                              alt={Item?.inventory?.image[0].alt_text}
                              width={50}
                              height={50}
                            ></Image>
                            <span className="px-2">
                              {Item?.inventory?.product?.name}
                            </span>
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn"
                            type="button"
                            onClick={() => ({})}
                            // onClick={() => decrease(Item)}
                          >
                            -
                          </button>
                          <span className="px-2">{Item?.count}</span>
                          <button
                            className="btn"
                            type="button"
                            onClick={() => ({})}
                            // onClick={() => increase(Item)}
                          >
                            +
                          </button>
                        </td>
                        <td>${Item?.inventory?.store_price}</td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
            <div>
              <div className="card bg-base-300">
                <div className="card-body">
                  <ul>
                    <li>
                      <div className="pb-3 text-xl">
                        {/* Subtotal ({data?.reduce((a, c) => a + c.qty, 0)}) : $
                      {itemsPrice} */}
                      </div>
                    </li>
                    <li>
                      <button
                        onClick={() => router.push("/shipping")}
                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                      >
                        Proceed to Checkout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
}
