import RetrieveUserInfo from "@/components/auth/RetrieveUser";
import { Container } from "@/components/ui";

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
    <Container className="bg-white overflow-hidden">
      <div className="relative isolate px-6 pt-2 lg:px-8">
        <header className="text-center py-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white mt-8 mb-8 rounded-xl">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Dashboard
          </h2>
        </header>
      </div>
      <main className="mx-auto max-w-7xl py-6 my-8 sm:px-6 lg:px-8">
        <RetrieveUserInfo />
      </main>
    </Container>
  );
};

export default DashboardPage;
