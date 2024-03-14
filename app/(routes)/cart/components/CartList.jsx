"use client";

import { Spinner } from "@/components/common";
import { useGetItemsQuery } from "@/redux/features/cart/cartApiSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartItemsExcerpt from "./cartItemsExcerpt";

export default function CartList({ title }) {
  const router = useRouter();
  const { data, isSuccess, isLoading, error } = useGetItemsQuery("getItems");

  // Early return for loading and error states
  if (isLoading) return <Spinner lg />;
  if (error) return <p>Error: {error.message}</p>;

  // Destructure data and handle empty cart case concisely
  const { ids = [] } = data || {}; // Default to empty array
  const { entities = [] } = data || {}; // Default to empty array

  const isItems = ids.length;

  let content;
  if (isSuccess) {
    if (isItems === 0) {
      content = <Link href="/">Go shopping</Link>;
    } else {
      content = ids?.map((itemId) => (
        <CartItemsExcerpt key={itemId} itemId={itemId} />
      ));
    }
  }

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
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                {content}
              </table>
            </div>
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
                      className="btn btn-primary w-full"
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
