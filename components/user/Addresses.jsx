"use client";

import AddressItem from "@/components/user/AddressItem";
import {
  useGetAddressQuery,
  useSetDefaultAddressMutation,
} from "@/redux/features/address/addressApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

const UserAddresses = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data, isSuccess, error, isLoading } = useGetAddressQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const { ids = [], entities = {} } = data || {};
  const items = ids.map((id) => entities[id] || null).filter(Boolean);

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress({ addressId }).unwrap();
      toast.success("Address set as default");
    } catch (error) {
      toast.error("Failed to set default address");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (isSuccess) {
    if (!items.length) {
      return (
        <div className="pb-3">
          <p className="text-red-600">No addresses found.</p> Please, Add new
          Address.
        </div>
      );
    }
    return (
      <>
        <h2 className="text-2xl pb-3 font-bold tracking-tight text-gray-900">
          Addresses ({items.length})
        </h2>
        {items.map((address) => (
          <AddressItem
            key={address.id}
            address={address}
            onSetDefault={handleSetDefault}
          />
        ))}
      </>
    );
  }

  return <p>No addresses found.</p>;
};

export default UserAddresses;
