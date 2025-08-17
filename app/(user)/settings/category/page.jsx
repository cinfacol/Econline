import { Spinner } from "@/components/common";
import { AddCategoryForm } from "@/components/forms";
import { Suspense } from "react";
import ManageProducts from "@/components/settings/ManageProducts";
import React from "react";

const NewCategoryPage = () => {
  return (
    <main
      className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      role="main"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Add a new Product
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Suspense fallback={<Spinner />}>
          <AddCategoryForm />
        </Suspense>
      </div>
      {/* <div>
        <h2 className="text-2xl font-semibold mb-4">Ingresar Productos</h2>
        <ManageProducts />
      </div> */}
    </main>
  );
};

export default NewCategoryPage;
