"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";
import { Spinner } from "@/components/common";

const AddProductsButton = () => {
  const router = useRouter();
  const { isAuthenticated, isGuest } = useAppSelector((state) => state.auth);
  const {
    data: user,
    isLoading,
    error,
  } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated || isGuest,
  });
  const isAdmin = user?.is_admin || false;

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center my-8">
        <p className="text-red-600">.</p>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
        <Button
          variant="warning"
          className="font-bold"
          onClick={() => router.push("/admin/categories")}
        >
          <ListPlus />
          Add New Product
        </Button>
      </article>
    );
  }
};

export default AddProductsButton;
