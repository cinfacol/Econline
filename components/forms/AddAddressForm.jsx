"use client";

import { useAddAddress } from "@/hooks";
import { AddressForm } from "@/components/forms";
import { countries } from "@/utils/countries";

export default function AddAddressForm() {
  const {
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    phone_number,
    is_default,
    isLoading,
    onChange,
    onCheckboxChange,
    onSubmit,
  } = useAddAddress();

  const config = [
    {
      labelText: "Address 1",
      labelId: "address_line_1",
      type: "text",
      value: address_line_1,
      placeholder: "Enter your Address *",
      required: true,
    },
    {
      labelText: "Address 2",
      labelId: "address_line_2",
      type: "text",
      value: address_line_2,
      placeholder: "Enter your second Address",
      required: false,
    },
    {
      labelText: "City",
      labelId: "city",
      type: "text",
      value: city,
      placeholder: "Enter your City *",
      required: true,
    },
    {
      labelText: "State",
      labelId: "state_province_region",
      type: "text",
      value: state_province_region,
      placeholder: "Enter your State *",
      required: true,
    },
    {
      labelText: "Postal Zip Code",
      labelId: "postal_zip_code",
      type: "text",
      value: postal_zip_code,
      placeholder: "Enter a valid zip code *",
      required: true,
    },
    {
      labelText: "Country",
      labelId: "country_region",
      type: "select",
      value: country_region,
      default: "Colombia",
      required: true,
      options: countries.map((country) => ({
        value: country.Name,
        label: country.Name,
      })),
    },
    {
      labelText: "Phone Number",
      labelId: "phone_number",
      type: "text",
      value: phone_number,
      placeholder: "Enter a valid phone number *",
      required: true,
    },
    {
      labelText: "Set as Default ",
      labelId: "is_default",
      type: "checkbox",
      value: is_default,
      required: false,
    },
  ];

  return (
    <AddressForm
      config={config}
      isLoading={isLoading}
      btnText="Add New Address"
      onChange={onChange}
      onCheckboxChange={onCheckboxChange}
      onSubmit={onSubmit}
    />
  );
}
