"use client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { MapPinPlus } from "lucide-react";

const AddAddressButton = () => {
  const router = useRouter();
  return (
    <Button
      color="warning"
      variant="shadow"
      aria-label="Add new address"
      className="font-bold flex items-center"
      onPress={() => router.push("/dashboard/address/new")}
    >
      <MapPinPlus className="mr-2" />
      New address
    </Button>
  );
};

export default AddAddressButton;
