"use client";

// import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";
import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";
import { Spinner } from "@/components/common";

const ProductDetails = (params) => {
  const productId = params.params?.productId;

  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProductsQuery("getProducts");
  // const entitiesIds = products?.ids;

  let content;
  if (isLoading) {
    content = <Spinner lg />;
  } else if (isError) {
    content = <p>{error}</p>;
  } else if (isSuccess) {
    content = products?.entities[productId];
  }

  return (
    <>
      <div>
        <div className="mg-top text-center">
          {isLoading && content}
          {/* <h1>{content?.title}</h1> */}
          <hr className="hr-text" />
        </div>
        <p>Product: {content?.title} </p>
        <p>Category: {content?.category} </p>
      </div>
    </>
  );
};

export default ProductDetails;
