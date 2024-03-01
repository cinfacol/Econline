"use client";

import { Spinner } from "@/components/common";
import NoResults from "@/components/ui/no-results";
import InventoriesExcerpt from "./InventoriesExcerpt";
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";

const InventoriesList = ({ title }) => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetInventoriesQuery("getInventories");

  // console.log("data", data);

  let content;
  if (isLoading) {
    content = <Spinner lg />;
  } else if (isSuccess) {
    if (data?.ids?.length !== 0) {
      content = data?.ids?.map((productId) => (
        <InventoriesExcerpt key={productId} productId={productId} />
      ));
    } else {
      content = <NoResults title="Products" />;
    }
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <section>
      <div className="space-y-4">
        <h3 className="font-bold text-3xl">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* {console.log("content", content)} */}
          {content}
        </div>
      </div>
    </section>
  );
};
export default InventoriesList;
