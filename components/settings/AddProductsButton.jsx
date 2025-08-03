"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPinPlus } from "lucide-react";

const AddProductsButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="warning"
      className="font-bold"
      onClick={() => router.push("/settings/product/new")}
    >
      <MapPinPlus />
      Add New Product
    </Button>
  );
};

export default AddProductsButton;
