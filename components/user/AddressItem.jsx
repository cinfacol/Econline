"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { MapPin, Edit, Trash } from "lucide-react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "@/redux/features/address/addressApiSlice";
import { toast } from "sonner";

const AddressItem = ({ address, onSetDefault }) => {
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const [
    deleteAddress,
    { isLoading: isDeleting, isSuccess: isDeleted, error: deleteError },
  ] = useDeleteAddressMutation();

  const addressId = address.id;

  const handleDefaultChange = async (e) => {
    e.stopPropagation();
    const isChecked = e.target.checked;
    if (isChecked) {
      try {
        await setDefaultAddress({ addressId }).unwrap();
        onSetDefault(address.id);
        // toast.success("Address set as default");
      } catch (error) {
        toast.error("Failed to set default address");
      }
    }
  };

  const deleteHandler = useCallback(async () => {
    try {
      await deleteAddress(addressId).unwrap();
      toast.success("Address Deleted");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  }, [deleteAddress, addressId]);

  return (
    <div className="mb-5 gap-4">
      <div className="w-full flex justify-between align-center bg-gray-100 p-4 rounded-md">
        <div className="flex items-center">
          <div className="mr-3">
            <span>
              <MapPin />
            </span>
          </div>
          <div className="text-gray-600">
            <p>
              {address.address_line_1} <br /> {address.city},{" "}
              {address.state_province_region}, {address.postal_zip_code},{" "}
              {address.country_region}
              <br />
              Phone number: {address.phone_number}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={address.is_default}
              onChange={handleDefaultChange}
              className="mr-2 form-checkbox rounded-full text-blue-600 cursor-pointer"
            />
            Default
          </label>
          <Link href={`/profile/address/${address.id}`}>
            <PencilSquareIcon
              className="h-6 w-6 hover:bg-orange-300 border border-transparent rounded-md"
              aria-hidden="true"
            />
            {/* <button className="p-2 text-center inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              <Edit className="w-5 h-5" />
            </button> */}
          </Link>
          <div
            onClick={deleteHandler}
            // className="p-2 text-center inline-block text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            <TrashIcon
              className="h-6 w-6 hover:bg-red-300 border border-transparent rounded-md"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressItem;
