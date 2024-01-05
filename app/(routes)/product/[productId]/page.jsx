"use client";

import Gallery from "@/components/gallery";
import Info from "@/components/info";
import SuggestedProducts from "@/components/products/SuggestedProducts";
import Container from "@/components/ui/container";
import { useGetProductsQuery } from "@/redux/features/products/productsApiSlice";

const ProductsPage = ({ params }) => {
  const productId = params.productId;

  const { data: products } = useGetProductsQuery("getProducts");
  const product = products?.entities[productId];
  const category = product?.category;
  const cover_photo = product?.cover_photo;
  const photo1 = product?.photo1;
  const photo2 = product?.photo2;
  const photo3 = product?.photo3;
  const photo4 = product?.photo4;

  const images = [cover_photo, photo1, photo2, photo3, photo4];

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Gallery */}
            <Gallery images={images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={product} />
            </div>
          </div>
          <hr className="my-10" />
          <SuggestedProducts title="Related products" category={category} />
        </div>
      </Container>
    </div>
  );
};

export default ProductsPage;
