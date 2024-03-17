"use client";

import Gallery from "@/components/gallery";
import Info from "@/components/info";
import SuggestedProducts from "@/components/inventories/SuggestedProducts";
import Container from "@/components/ui/container";
import { useGetEntity } from "@/hooks";

// recibe como params el id del producto
const InventoryDetailsPage = ({ params }) => {
  const inventoryId = params.productId;

  // useGetEntity es un hook que recibe el id de un producto y devuelve toda la información relacionada con ese producto
  const entitie = useGetEntity(inventoryId);

  // categories es un array que almacena el slug de todas las categorías del producto referenciado
  const categories = entitie?.product?.category?.map((cat) => {
    return cat.slug;
  });

  const images = entitie?.image;

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Gallery */}
            <Gallery images={images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={entitie} />
            </div>
          </div>
          <hr className="my-10" />
          <SuggestedProducts
            title="Suggested Products"
            categories={categories}
          />
        </div>
      </Container>
    </div>
  );
};

export default InventoryDetailsPage;
