import Gallery from "@/components/gallery";
import Info from "@/components/info";
import SuggestedProducts from "@/components/inventories/SuggestedProducts";
import Container from "@/components/ui/container";

// recibe como params el id del producto
const InventoryDetailsPage = ({ params }) => {
  const inventoryId = params.productId;

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Gallery */}
            <Gallery inventoryId={inventoryId} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info inventoryId={inventoryId} />
            </div>
          </div>
          <hr className="my-10" />
          <SuggestedProducts
            title="Suggested Products"
            inventoryId={inventoryId}
          />
        </div>
      </Container>
    </div>
  );
};

export default InventoryDetailsPage;
