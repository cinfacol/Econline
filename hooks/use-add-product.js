import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { useCreateCategoryMutation } from "@/redux/features/categories/categoriesApiSlice";
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
  const [createCategory] = useCreateCategoryMutation();
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

  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    newCategoryName: "",
    newParentName: "",
    newMeasureUnit: "",
  });

  const onChange = (e, field) => {
    if (
      ["newCategoryName", "newParentName", "newMeasureUnit"].includes(field)
    ) {
      setCategoryForm({ ...categoryForm, [field]: e.target.value });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
      if (field === "category_name" && e.target.value === "__new__") {
        setShowCategoryForm(true);
      }
    }
  };

  const onCheckboxChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.checked });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let finalCategoryName = formData.category_name;

    if (showCategoryForm && categoryForm.newCategoryName) {
      try {
        const created = await createCategory({
          name: categoryForm.newCategoryName,
          parent: categoryForm.newParentName || null,
          measure_unit: categoryForm.newMeasureUnit,
        }).unwrap();
        finalCategoryName = created.name;
      } catch (error) {
        toast.error("Error creando categoría");
        return;
      }
    }

    try {
      await addProduct({
        user,
        product_name: formData.product_name,
        product_description: formData.product_description,
        category_name: finalCategoryName,
        is_active: formData.is_active,
        published_status: formData.published_status,
      }).unwrap();
      toast.success("Product added successfully");
      router.push("/settings/product/details"); // siguiente etapa
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
    showCategoryForm,
    ...categoryForm,
  };
}
