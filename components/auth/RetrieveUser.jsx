"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { Spinner } from "@/components/common";
import { Avatar } from "@heroui/react";

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
    </>
  );
}

export default RetrieveUserInfo;
