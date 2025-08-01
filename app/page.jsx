import InventoriesList from "@/components/inventories/InventoriesList";
import ProductCarousel from "@/components/inventories/ProductCarousel";
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
      <div className="relative isolate px-6 pt-2 lg:px-8">
        <header className="text-center py-2 my-8">
          <ProductCarousel />
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
