"use client";

import ProductsExcerpt from "./ProductsExcerpt";
import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";

const ProductsList = () => {
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery("getProducts");

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = products.ids.map((productId) => (
      <ProductsExcerpt key={productId} productId={productId} />
    ));
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <div className="space-y-4">
        <h3 className="font-bold text-3xl">"Featured Products"</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {content}
        </div>
      </div>
    </section>
  );
};
export default ProductsList;