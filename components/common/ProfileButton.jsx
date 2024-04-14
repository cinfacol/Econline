"use client";

import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { logout as setLogout } from "@/redux/features/auth/authSlice";
import { NavLink } from "@/components/common";
import Link from "next/link";
import Image from "next/image";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileButton() {
  const dispatch = useAppDispatch();

  const [logout] = useLogoutMutation();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        localStorage.setItem(
          "cart-storage",
          '{"state:{"items":[]},"version":0}'
        );
        // router.push("/");
        dispatch(setLogout());
      });
  };
  const authLinks = (isMobile) => (
    <>
      <Menu.Item disabled>
        <span className="bg-gray-100 block px-4 py-2 text-center text-gray-700 border-b-2">
          {user.full_name}
        </span>
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <Link
            href="/dashboard"
            className={classNames(
              active ? "bg-gray-100" : "",
              "block px-4 py-2 text-sm text-gray-700"
            )}
          >
            Dashboard
          </Link>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <Link
            href="/profile"
            className={classNames(
              active ? "bg-gray-100" : "",
              "block px-4 py-2 text-sm text-gray-700"
            )}
          >
            Profile
          </Link>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <Link
            href="/settings"
            className={classNames(
              active ? "bg-gray-100" : "",
              "block px-4 py-2 text-sm text-gray-700"
            )}
          >
            Settings
          </Link>
        )}
      </Menu.Item>
      <NavLink isMobile={isMobile} onClick={handleLogout}>
        Logout
      </NavLink>
    </>
  );

  const guestLinks = (isMobile) => (
    <>
      <Menu.Item>
        {({ active }) => (
          <Link
            href="/auth/login"
            className={classNames(
              active ? "bg-gray-100" : "",
              "block px-4 py-2 text-sm text-gray-700"
            )}
          >
            Login
          </Link>
        )}
      </Menu.Item>
      <Menu.Item>
        {({ active }) => (
          <Link
            href="/auth/register"
            className={classNames(
              active ? "bg-gray-100" : "",
              "block px-4 py-2 text-sm text-gray-700"
            )}
          >
            Register
          </Link>
        )}
      </Menu.Item>
    </>
  );
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        {isAuthenticated ? (
          <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
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
          </Menu.Button>
        ) : (
          <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            <Image
              className="h-8 w-8 rounded-full"
              width={44}
              height={44}
              src="/images/profile_default.png"
              alt=""
            />
          </Menu.Button>
        )}
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {isAuthenticated ? authLinks : guestLinks}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
