import { Spinner } from "@/components/common";
import { AddProductForm } from "@/components/forms";
import { Suspense } from "react";
import React from "react";

const NewProductPage = () => {
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
          <AddProductForm />
        </Suspense>
      </div>
    </main>
  );
};

export default NewProductPage;
