"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { useAppSelector } from "@/redux/hooks";
import { Spinner } from "@/components/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function RetrieveUserInfo() {
  const { isAuthenticated, isGuest } = useAppSelector((state) => state.auth);
  const {
    data: user,
    isLoading,
    error,
  } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated || isGuest,
  });
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
          <Avatar className="h-15 w-15">
            <AvatarImage
              src={profile_photo || "/images/default_avatar.svg"}
              alt={full_name || "Usuario"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
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
