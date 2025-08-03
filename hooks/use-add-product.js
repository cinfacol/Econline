import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useCreateProductMutation } from "@/redux/features/inventories/inventoriesApiSlice";

export default function useAddProduct() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [addProduct, { isLoading }] = useCreateProductMutation();
  const user = data?.pk;
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    category_name: "",
    is_active: true,
    published_status: false,
  });

  const {
    product_name,
    product_description,
    category_name,
    is_active,
    published_status,
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
      const newProduct = await addProduct({
        user,
        product_name,
        product_description,
        category_name,
        is_active,
        published_status,
      }).unwrap();
      console.log("New Product:", newProduct);
      toast.success("Product added successfully");

      router.push("/");
    } catch (error) {
      toast.error("Failed to register new Product");
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
