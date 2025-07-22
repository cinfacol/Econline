"use client";

import RelatedProducts from "@/components/inventories/RelatedProducts";
import { useParams } from "next/navigation";

const RelatedPage = () => {
  const params = useParams();
  const { id } = params;

  return (
    <div className="container mx-auto py-8">
      <RelatedProducts inventoryId={id} />
    </div>
  );
};

export default RelatedPage;
