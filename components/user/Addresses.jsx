import Link from "next/link";
import { useGetAddressQuery } from "@/redux/features/address/addressApiSlice";
import { MapPin } from "lucide-react";

const AddressItem = ({ address }) => (
  <Link href={`/address/${address.id}`} key={address.id}>
    <div className="mb-5 gap-4">
      <figure className="w-full flex align-center bg-gray-100 p-4 rounded-md cursor-pointer">
        <div className="mr-3">
          <span>
            <MapPin />
          </span>
        </div>
        <figcaption className="text-gray-600">
          <p>
            {address.address_line_1} <br /> {address.city},{" "}
            {address.state_province_region}, {address.postal_zip_code},{" "}
            {address.country_region}
            <br />
            Phone number: {address.phone_number}
          </p>
        </figcaption>
      </figure>
    </div>
  </Link>
);

const UserAddresses = () => {
  const { data, isSuccess, error, isLoading } = useGetAddressQuery();
  const { ids = [], entities = {} } = data || {};
  const items = ids.map((id) => entities[id] || null).filter(Boolean);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (isSuccess) {
    return (
      <>
        {items.map((address) => (
          <AddressItem key={address.id} address={address} />
        ))}
      </>
    );
  }

  return null;
};

export default UserAddresses;
