// import Banner from "@/components/common/Banner";
import InventoriesList from "@/components/inventories/InventoriesList";
import Container from "@/components/ui/container";

export default function Home() {
  return (
    <Container className="bg-white overflow-hidden">
      {/* <Billboard data="" /> */}
      {/* <Banner /> */}
      <div className="relative isolate px-6 pt-2 lg:px-8">
        <div className="mx-auto max-w-2xl py-5 sm:py-6 lg:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Tienda Online Tutorial Application
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              This is an application meant to showcase jwt authentication with
              Next.js and Django. Credentials in this app get stored in cookies
              with the HttpOnly flag for maximum security. Styling is done using
              Tailwind.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6"></div>
          </div>
        </div>
      </div>
      <div className="space-y-10 pb-10">
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          {<InventoriesList title="Featured Products" />}
        </div>
      </div>
    </Container>
  );
}
