import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/forms";
import { SocialButtons, Spinner } from "@/components/common";
import { Suspense } from "react";

export const metadata = {
  title: "Tienda Online | Login",
  description: "Tienda login page",
};

export default function LoginPage() {
  return (
    <main
      className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8"
      role="main"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto w-auto"
          src="/images/default_avatar.png"
          alt="Tienda Logo"
          width={40}
          height={40}
          priority
        />
        <h1 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Inicia sesión en tu cuenta
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <Suspense fallback={<Spinner />}>
          <LoginForm />
        </Suspense>
        <div className="my-6">
          <SocialButtons />
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/auth/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  );
}
