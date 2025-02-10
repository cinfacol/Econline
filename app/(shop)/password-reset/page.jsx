import { PasswordResetForm } from "@/components/forms";
import Image from "next/image";

export const metadata = {
  title: "Econline | Password Reset",
  description: "Econline password reset page",
};

export default function Page() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-10 w-auto"
          src="/images/identification.svg"
          alt="Econline"
          width={40}
          height={40}
          priority={false}
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <PasswordResetForm />
      </div>
    </div>
  );
}
