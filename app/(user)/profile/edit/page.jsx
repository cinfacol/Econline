import FormLayout from "@/components/user/FormLayout";

export const metadata = {
  title: "User | Edit Profile",
  description: "Gestiona tu perfil de usuario",
  keywords: "User, profile, ecommerce, productos",
  openGraph: {
    title: "User | Edit Profile",
    description: "Gestiona tu perfil de usuario",
  },
};

const ProfilePage = () => {
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Edit User Profile
          </h2>
        </div>
      </header>
      <hr className="border-b border-gray-900/10 pb-8" />
      <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
        <FormLayout />

        <hr className="border-b border-gray-900/10 pb-8" />
      </article>
    </>
  );
};

export default ProfilePage;
