"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { logOut as setLogOut } from "@/redux/features/auth/authSlice";
import { NavLink } from "@/components/common";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  LogOutIcon,
  KeySquareIcon,
  LayoutDashboardIcon,
  UserPenIcon,
  SettingsIcon,
} from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileButton() {
  const dispatch = useAppDispatch();

  const [logout] = useLogoutMutation();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

  const router = useRouter();

  const handleLogOut = async () => {
    await logout({})
      .unwrap()
      .then(() => {
        dispatch(setLogOut());
        toast.success("Logout Successful!");

        // Redirect to home page.
        // router.push("/");
      })
      .catch((rawError) => {
        const error = rawError;
        console.error("Error during signup:", error);
        // Handle the error.
        const serverErrorMessage = error?.data?.error;
        const message = serverErrorMessage || "An unknown error occurred";

        // Update the local state with the error message.
        console.log("Server-side error during Logout", message);
        toast.error("Error during Logout. Please try again.");
      });
  };
  const authLinks = (isMobile) => (
    <>
      <MenuItem disabled>
        <span className="bg-gray-100 block px-4 py-2 text-center text-gray-700 border-b-2">
          {user.full_name}
        </span>
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/dashboard"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <LayoutDashboardIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Dashboard
              <kbd className="ml-auto hidd font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘D
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/profile"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <UserPenIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Profile
              <kbd className="ml-auto hidd font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘P
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/settings"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <SettingsIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Settings
              <kbd className="ml-auto hidd font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘S
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
            onClick={handleLogOut}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <LogOutIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              LogOut
              <kbd className="ml-auto hidd font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘L
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
    </>
  );

  const guestLinks = (isMobile) => (
    <>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/auth/login"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <KeySquareIcon className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Login
              <kbd className="ml-auto font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘L
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <NavLink
            href="/auth/register"
            className={classNames(
              focus ? "bg-gray-100" : "",
              "flex px-4 py-2 text-sm text-gray-700"
            )}
          >
            <span className="group flex w-full items-center gap-2 data-[focus]:bg-white/10">
              <UserPlus className="size-4 mr-2 text-xs text-gray/50 group-data-[focus]:inline" />
              Register
              <kbd className="ml-auto font-sans text-xs text-gray/50 group-data-[focus]:inline">
                ⌘R
              </kbd>
            </span>
          </NavLink>
        )}
      </MenuItem>
    </>
  );
  return (
    <Menu as="div" className="relative ml-3">
      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Open user menu</span>
        {isAuthenticated ? (
          <Image
            className="h-8 w-8 rounded-full"
            width={44}
            height={44}
            src={
              user?.profile_photo
                ? user?.profile_photo
                : "/images/profile_default.png"
            }
            alt=""
          />
        ) : (
          <Image
            className="h-8 w-8 rounded-full"
            width={44}
            height={44}
            src="/images/profile_default.png"
            alt=""
          />
        )}
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {isAuthenticated ? authLinks : guestLinks}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
