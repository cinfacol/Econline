import RetrieveUserInfo from "@/components/auth/RetrieveUser";
import UserAddresses from "@/components/user/Addresses";
import AddAddressButton from "@/components/user/AddAddressButton";

export const metadata = {
  title: "Dashboard | Address",
  description: "Gestiona las direcciones en tu Dashboard",
  keywords: "dashboard, address, ecommerce, productos",
  openGraph: {
    title: "Dashboard | Address",
    description: "Gestiona las direcciones en tu Dashboard",
  },
};

const DashboardPage = async () => {
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl py-6 my-8 sm:px-6 lg:px-8">
        <RetrieveUserInfo />
      </main>
      <hr className="my-4" />
      <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
        <UserAddresses />

        <hr className="my-4" />

        <AddAddressButton />
      </article>
    </>
  );
};

export default DashboardPage;
