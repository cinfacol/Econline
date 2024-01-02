import TimeAgo from "@/components/products/TimeAgo";
import Link from "next/link";
import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

function ProductsExcerpt({ productId }) {
  const { product } = useGetProductsQuery("getProducts", {
    selectFromResult: ({ data }) => ({
      product: data?.entities[productId],
    }),
  });
  return (
    <>
      {product.length === 0 && <NoResults />}
      <div>
        <ProductCard key={product.id} data={product} />
      </div>
    </>
  );
}

export default ProductsExcerpt;
