import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddAddressMutation } from "@/redux/features/address/addressApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { toast } from "sonner";

export default function useAddAddress() {
  const router = useRouter();
  const { data } = useRetrieveUserQuery();
  const [addAddress, { isLoading }] = useAddAddressMutation();
  const user = data?.pk;
  const [formData, setFormData] = useState({
    address_line_1: "",
    address_line_2: "",
    city: "",
    state_province_region: "",
    postal_zip_code: "",
    phone_number: "",
    country_region: "",
  });

  const {
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    phone_number,
    country_region,
  } = formData;

  const onChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAddress({
        user,
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        postal_zip_code,
        phone_number,
        country_region,
      }).unwrap();
      toast.success("Address added successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to register new Address");
    }
  };

  return {
    ...formData,
    isLoading,
    onChange,
    onSubmit,
  };
}
