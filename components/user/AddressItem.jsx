import Link from "next/link";
import { MapPin } from "lucide-react";

const AddressItem = ({ address }) => (
  <Link href={`/dashboard/address/${address.id}`}>
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

export default AddressItem;
