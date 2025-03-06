"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPinPlus } from "lucide-react";

const AddAddressButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="warning"
      className="font-bold"
      onClick={() => router.push("/dashboard/address/new")}
    >
      <MapPinPlus />
      New address
    </Button>
  );
};

export default AddAddressButton;
