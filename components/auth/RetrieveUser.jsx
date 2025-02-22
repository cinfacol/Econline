"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { MapPinPlus } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/common";
import { Avatar } from "@heroui/react";
import { Button } from "@heroui/button";
import UserAddresses from "@/components/user/Addresses";

function RetrieveUserInfo() {
  const { data: user, isLoading, error } = useRetrieveUserQuery();
  const { profile_photo, full_name, email, date_joined } = user || {};

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
        <p className="text-red-600">Failed to load user information.</p>
      </div>
    );
  }

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
        <figure className="flex items-start sm:items-center">
          <div className="relative">
            <Avatar
              src={profile_photo || "/images/profile_default.png"}
              alt={full_name || "Usuario"}
              radius="full"
            />
          </div>
          <figcaption className="ml-4">
            <h5 className="font-semibold text-lg">{full_name}</h5>
            <p className="text-sm text-gray-600">
              <b>Email: </b> {email} | <b>Joined On: </b>
              {date_joined?.substring(0, 10)}
            </p>
          </figcaption>
        </figure>

        <hr className="my-4" />
        <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
          <UserAddresses />

          <hr className="my-4" />

          <Link href="/dashboard/address/new">
            <Button
              color="warning"
              variant="shadow"
              aria-label="Add new address"
              className="font-bold flex items-center"
            >
              <MapPinPlus className="mr-2" />
              Add new address
            </Button>
          </Link>
        </article>
      </main>
    </>
  );
}

export default RetrieveUserInfo;
