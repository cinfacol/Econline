import { Spinner } from "@/components/common";
import { AddAddressForm } from "@/components/forms";
import { Suspense } from "react";

export const metadata = {
  title: "Virtual E-line | Add Address",
  description: "Tienda Online add Address page",
};

export default function NewAddressPage() {
  return (
    <main
      className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      role="main"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Add a new Address
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Suspense fallback={<Spinner />}>
          <AddAddressForm />
        </Suspense>
      </div>
    </main>
  );
}
