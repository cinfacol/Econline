import { InventoryForm } from "@/components/forms";
import { Suspense } from "react";
import { Spinner } from "@/components/common";

export const metadata = {
  title: "Tienda Online | Add Inventory",
  description: "Agregar un nuevo inventario",
};

export default function AddInventoryPage() {
  return (
    <main
      className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
      role="main"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Agregar nuevo inventario
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <Suspense fallback={<Spinner />}>
          <InventoryForm />
        </Suspense>
      </div>
    </main>
  );
}
