"use client";

import { useCheckout } from "@/hooks";
import { Form } from "@/components/forms";

export default function CheckoutForm() {
  const {
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    psostal_zip_code,
    country_region,
    telephone_number,
    // isLoading,
    onChange,
    // onSubmit,
  } = useCheckout();

  const config = [
    {
      labelText: "Full Name",
      labelId: "fullname",
      type: "text",
      value: full_name,
      placeholder: "Yor Name *",
      required: true,
    },
    {
      labelText: "Address Line 1",
      labelId: "address1",
      type: "text",
      value: address_line_1,
      placeholder: "Your home Addres *",
      required: true,
    },
    {
      labelText: "Address Line 2",
      labelId: "address2",
      type: "text",
      value: address_line_2,
      placeholder: "Your Office Address",
      required: false,
    },
    {
      labelText: "City",
      labelId: "city",
      type: "text",
      value: city,
      placeholder: "Your City *",
      required: true,
    },
    {
      labelText: "Departamento",
      labelId: "departamento",
      type: "text",
      value: state_province_region,
      placeholder: "Your State *",
      required: true,
    },
    {
      labelText: "Zip Code",
      labelId: "zipcode",
      type: "text",
      value: psostal_zip_code,
      placeholder: "your Zip Code *",
      required: true,
    },
    {
      labelText: "Country",
      labelId: "country",
      type: "text",
      value: country_region,
      placeholder: "your Country *",
      required: true,
    },
    {
      labelText: "Phone",
      labelId: "phone",
      type: "text",
      value: telephone_number,
      placeholder: "Your Phone Number *",
      required: true,
    },
  ];

  return (
    <Form
      config={config}
      // isLoading={isLoading}
      btnText="Place Order"
      onChange={onChange}
      // onSubmit={onSubmit}
    />
  );
}
