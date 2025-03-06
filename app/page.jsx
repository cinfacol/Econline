import InventoriesList from "@/components/inventories/InventoriesList";
import { Container } from "@/components/ui";
// import { RadioButtonCategoryGroup } from "@/components/common/RadioButtonCategoryGroup";
import { Suspense } from "react";
import { Spinner } from "@/components/common";

export const metadata = {
  title: "Econline Home | Tu Tienda Online",
  description:
    "Descubre nuestra tienda online con autenticación segura JWT, desarrollada con Next.js y Django. Explora nuestro catálogo de productos.",
  keywords: "ecommerce, tienda online, next.js, django, jwt",
  openGraph: {
    title: "Econline Home | Tu Tienda Online",
    description: "Descubre nuestra tienda online con autenticación segura JWT",
    images: ["/og-image.jpg"],
  },
};

export default function Home() {
  return (
    <Container className="bg-white overflow-hidden">
      <Suspense fallback={<Spinner />}>
        {/* <RadioButtonCategoryGroup /> */}
      </Suspense>

      {/* Hero section */}
      <div className="relative isolate px-6 pt-2 lg:px-8">
        <header className="text-center py-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white mt-8 mb-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Tienda Online Tutorial Application
          </h1>
          <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto">
            This is an application meant to showcase jwt authentication with
            Next.js and Django. Credentials in this app get stored in cookies
            with the HttpOnly flag for maximum security. Styling is done using
            Tailwind.
          </p>
          <div className="mt-8">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition">
              Explorar Productos
            </button>
          </div>
        </header>
      </div>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<Spinner />}>
            <InventoriesList title={metadata.title} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
