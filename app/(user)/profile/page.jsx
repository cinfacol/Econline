import UserProfileDetails from "@/components/auth/UserProfileDetails";
import { Container } from "@/components/ui";

export const metadata = {
  title: "User | Profile",
  description: "Gestiona tu perfil de usuario",
  keywords: "User, profile, ecommerce, productos",
  openGraph: {
    title: "User | Profile",
    description: "Gestiona tu perfil de usuario",
  },
};

const ProfilePage = () => {
  return (
    <Container className="bg-white overflow-hidden">
      <div className="relative isolate px-6 pt-2 lg:px-8">
        <header className="text-center py-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white mt-8 mb-8">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              User Profile
            </h2>
          </div>
        </header>
        <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
          <UserProfileDetails />
        </article>
        <hr className="border-b border-gray-900/10 pb-8" />
      </div>
    </Container>
  );
};

export default ProfilePage;
