"use client";
import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";

const ProductsPage = (params) => {
  const productId = params.params.productId;

  const { product } = useGetProductsQuery("getProducts", {
    selectFromResult: ({ data }) => ({
      product: data?.entities[productId],
    }),
  });

  return (
    <>
      <div>
        <div className="mg-top text-center">
          <h1>{product.title}</h1>
          <hr className="hr-text" />
        </div>
        <p>Product: {product.title} </p>
      </div>
    </>
  );
};

export default ProductsPage;
