"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { MapPinPlus } from "lucide-react";
import Link from "next/link";
import { List, Spinner } from "@/components/common";
import { Avatar } from "@heroui/react";
import { Button } from "@heroui/button";

function RetrieveUser() {
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();
  const { profile_photo, full_name, email } = user || {};

  const config = [
    {
      label: "First Name",
      value: user?.first_name,
    },
    {
      label: "Last Name",
      value: user?.last_name,
    },
    {
      label: "Email",
      value: user?.email,
    },
  ];

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center my-8">
        <Spinner lg />
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
        {/* <List config={config} /> */}
        <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
          <figure className="flex items-start sm:items-center">
            <div className="relative">
              <Avatar
                src={profile_photo || "/images/profile_default.png"}
                alt={full_name || "Usuario"}
                radius="full"
              />
            </div>
            <figcaption>
              <h5 className="px-4 font-semibold text-lg">{user?.full_name}</h5>
              <p className="px-4 text-sm text-gray-600">
                <b>Email: </b> {user?.email} | <b>Joined On: </b>
                {user?.date_joined.substring(0, 10)}
              </p>
            </figcaption>
          </figure>

          <hr className="my-4" />

          {/* <UserAddresses addresses={addresses} /> */}

          <Link href="/address/new">
            <Button
              color="warning"
              variant="shadow"
              aria-label="Add new address"
              className="font-bold"
            >
              <span>{<MapPinPlus />}</span>
              Add new address
            </Button>
          </Link>

          <hr className="my-4" />
        </article>
      </main>
    </>
  );
}

export default RetrieveUser;
