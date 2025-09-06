import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "@/components/forms";
import { SocialButtons, Spinner } from "@/components/common";
import { Suspense } from "react";

export const metadata = {
  title: "Tienda Online | Register",
  description: "Tienda Online register page",
};

export default function RegisterPage() {
  return (
    <main
      className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      role="main"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto w-auto"
          src="/images/default_avatar.svg"
          alt="Tienda Logo"
          width={40}
          height={40}
          priority={false}
        />
        <h1 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Regístrate en tu cuenta
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Suspense fallback={<Spinner />}>
          <RegisterForm />
        </Suspense>
        <div className="my-6">
          <SocialButtons />
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="font-semibold ml-2 leading-6 text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
