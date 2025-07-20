"use client";
import { useGetProfileQuery } from "@/redux/features/auth/authApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "@/components/common";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Container } from "@/components/ui";

const fieldLabels = {
  username: "Usuario",
  full_name: "Nombre completo",
  email: "Email",
  about_me: "Sobre mí",
  license: "Licencia",
  gender: "Género",
  is_buyer: "Comprador",
  is_seller: "Vendedor",
  is_agent: "Agente",
  num_reviews: "Nº de reseñas",
};

const booleanFields = ["is_buyer", "is_seller", "is_agent"];

export default function UserProfileDetails() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: profile, isLoading, error } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center my-8">
        <p className="text-red-600">No se pudo cargar el perfil.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto  flex flex-col md:flex-row items-center p-8">
        <div className="flex-shrink-0 flex items-center justify-center mb-6 md:mb-0 md:mr-8">
          <Image
            className="h-32 w-32 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
            src={profile.profile.profile_photo || "/images/profile_default.png"}
            alt={profile.profile.full_name || "Usuario"}
            width={128}
            height={128}
            priority
          />
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.profile.full_name}</h2>
              <p className="text-gray-600 mb-2">@{profile.profile.username}</p>
            </div>
            <Button
              asChild
              variant="warning"
              size="lg"
              className="font-bold px-5"
            >
              <Link
                href="/profile/edit"
                prefetch={true}
                className="flex items-center gap-2"
              >
                <Pencil className="mr-2" />
                Editar perfil
              </Link>
            </Button>
          </div>
          <ul className="space-y-3">
            {Object.entries(fieldLabels).map(([key, label]) => {
              if (key === "full_name" || key === "username") return null;
              const value = profile.profile[key];
              if (value === undefined || value === null || value === "") return null;
              if (booleanFields.includes(key)) {
                return (
                  <li key={key} className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{label}:</span>
                    <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold">
                      {value ? "Sí" : "No"}
                    </span>
                  </li>
                );
              }
              return (
                <li key={key} className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">{label}:</span>
                  <span className="text-gray-900">{value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
} 