"use client";

import { useGetAddressQuery } from "@/redux/features/address/addressApiSlice";
import { MapPin } from "lucide-react";

const AddressDefault = () => {
  const { data, isLoading, error } = useGetAddressQuery();
  const { ids = [], entities = {} } = data || {};
  const items = ids.map((id) => entities[id] || null).filter(Boolean);

  const defaultAddress = items.find((address) => address.default);
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!defaultAddress) {
    return (
      <div className="pb-3">
        <p className="text-red-600">No default address found.</p> Please, set a
        default address.
      </div>
    );
  }

  return (
    <div className="mb-5 gap-4">
      <h2 className="text-2xl pb-3 font-bold tracking-tight text-gray-900">
        Shipping Address
      </h2>
      <div className="w-full flex justify-between align-center bg-gray-100 p-4 rounded-md cursor-pointer">
        <div className="flex items-center">
          <div className="mr-3">
            <span>
              <MapPin />
            </span>
          </div>
          <div className="text-gray-600">
            <p>
              {defaultAddress.address_line_1} <br /> {defaultAddress.city},{" "}
              {defaultAddress.state_province_region},{" "}
              {defaultAddress.postal_zip_code}, {defaultAddress.country_region}
              <br />
              Phone number: {defaultAddress.phone_number}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDefault;
