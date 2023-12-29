import Link from "next/link";
import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";

const ProductsExcerpt = ({ productId }) => {
  const { product } = useGetProductsQuery("getProducts", {
    selectFromResult: ({ data }) => ({
      product: data?.entities[productId],
    }),
  });

  return (
    <div>
      <h2>{product?.title}</h2>
      <p className="excerpt">{product?.description.substring(0, 75)}...</p>
      <p className="productCredit">
        <Link href={`product/${product?.id}`}>View Product</Link>
      </p>
    </div>
  );
};

export default ProductsExcerpt;
