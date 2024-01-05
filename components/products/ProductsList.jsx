"use client";

import { Spinner } from "@/components/common";
import ProductsExcerpt from "./ProductsExcerpt";
import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";

const ProductsList = ({ title }) => {
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery("getProducts");

  let content;
  if (isLoading) {
    content = <Spinner lg />;
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
        <h3 className="font-bold text-3xl">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {content}
        </div>
      </div>
    </section>
  );
};
export default ProductsList;
