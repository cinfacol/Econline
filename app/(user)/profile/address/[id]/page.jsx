"use client";

import { useParams } from "next/navigation";
import { useGetAddressDetailsQuery } from "@/redux/features/address/addressApiSlice";
import UpdateAddress from "@/components/user/UpdateAddress";

const AddressPage = () => {
  const { id: addressId } = useParams();
  const {
    data: address,
    error,
    isLoading,
  } = useGetAddressDetailsQuery(addressId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return <UpdateAddress address={address} />;
};

export default AddressPage;
