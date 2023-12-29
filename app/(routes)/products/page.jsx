"use client";

import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";
import ProductsExcerpt from "./ProductsExcerpt";

const ProductsPage = () => {
  const {
    data: products,
    isLoading,
    isSuccess,
    isFetching,
    isError,
    error,
  } = useGetProductsQuery("getProducts");

  let content;
  if (isLoading) {
    content = <p>"Loading...</p>;
  } else if (isError) {
    content = <p>{error}</p>;
  } else if (isSuccess) {
    content = products.ids.map((productId) => (
      <ProductsExcerpt key={productId} productId={productId} />
    ));
  }
  return (
    <>
      <div className={isFetching ? "disabled" : ""}>
        <div className="mg-top text-center">
          <h1>Our Catalog of products</h1>
          <hr className="hr-text" />
        </div>
        <section>{content}</section>
      </div>
    </>
  );
};

export default ProductsPage;
