import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAddAddressMutation,
  useSetDefaultAddressMutation,
} from "@/redux/features/address/addressApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { toast } from "sonner";

export default function useAddAddress() {
  const router = useRouter();
  const { data } = useRetrieveUserQuery();
  const [addAddress, { isLoading }] = useAddAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const user = data?.pk;
  const [formData, setFormData] = useState({
    address_line_1: "",
    address_line_2: "",
    city: "",
    state_province_region: "",
    postal_zip_code: "",
    country_region: "Colombia",
    phone_number: "",
    is_default: false,
  });

  const {
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    phone_number,
    is_default,
  } = formData;

  const onChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const onCheckboxChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.checked });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAddress = await addAddress({
        user,
        address_line_1,
        address_line_2,
        city,
        state_province_region,
        postal_zip_code,
        country_region,
        phone_number,
        is_default,
      }).unwrap();
      toast.success("Address added successfully");

      if (is_default) {
        await setDefaultAddress({ addressId: newAddress.id }).unwrap();
        toast.success("Address is set as default");
      }

      router.push("/profile");
    } catch (error) {
      toast.error("Failed to register new Address");
    }
  };

  return {
    ...formData,
    isLoading,
    onChange,
    onCheckboxChange,
    onSubmit,
  };
}
