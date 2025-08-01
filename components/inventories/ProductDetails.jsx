"use client";

import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { ProductSkeleton } from "@/components/skeletons";

const InventoryDetails = (params) => {
  const productId = params.params?.productId;

  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetInventoriesQuery("getInventories");
  // const entitiesIds = products?.ids;

  let content;
  if (isLoading) {
    content = <ProductSkeleton />;
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

export default InventoryDetails;
