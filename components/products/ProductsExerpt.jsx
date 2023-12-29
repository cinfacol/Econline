import TimeAgo from "@/components/products/TimeAgo";
import Link from "next/link";
import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";

function ProductsExerpt({ productId }) {
  const { product } = useGetProductsQuery("getProducts", {
    selectFromResult: ({ data }) => ({
      product: data?.entities[productId],
    }),
  });
  return (
    <article>
      <h2>{product?.title}</h2>
      <p className="excerpt">{product?.description?.substring(0, 75)}...</p>
      <p className="productCredit">
        <Link href={`product/${product?.id}`}>View Product</Link>
        <TimeAgo timestamp={product?.date} />
      </p>
    </article>
  );
}

export default ProductsExerpt;
