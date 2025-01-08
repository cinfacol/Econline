import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAppDispatch } from "@/redux/hooks";
// import { useLoginMutation } from "@/redux/features/auth/authApiSlice";
// import { setAuth } from "@/redux/features/auth/authSlice";
// import { toast } from "sonner";

export default function useCheckout() {
  // const router = useRouter();
  // const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    full_name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state_province_region: "",
    postal_zip_code: "",
    country_region: "",
    telephone_number: "",
    coupon_name: "",
    shipping_id: 0,
  });

  const {
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    telephone_number,
    coupon_name,
    shipping_id,
  } = formData;

  const onChange = (event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };

  return {
    full_name,
    address_line_1,
    address_line_2,
    city,
    state_province_region,
    postal_zip_code,
    country_region,
    telephone_number,
    coupon_name,
    shipping_id,
    // isLoading,
    onChange,
    // onSubmit,
  };
}
