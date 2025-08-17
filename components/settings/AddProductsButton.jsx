"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";

const AddProductsButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="warning"
      className="font-bold"
      onClick={() => router.push("/categories")}
    >
      <ListPlus />
      Add New Product
    </Button>
  );
};

export default AddProductsButton;
