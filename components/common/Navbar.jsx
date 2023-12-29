"use client";

import { usePathname } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  HeartIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { logout as setLogout } from "@/redux/features/auth/authSlice";
import { NavLink } from "@/components/common";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [logout] = useLogoutMutation();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      });
  };

  const isSelected = (path) => (pathname === path ? true : false);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const authLinks = (isMobile) => (
    <>
      <NavLink
        isSelected={isSelected("/dashboard")}
        isMobile={isMobile}
        href="/dashboard"
      >
        Dashboard
      </NavLink>
      <NavLink
        isSelected={isSelected("/profile")}
        isMobile={isMobile}
        href="/profile"
      >
        Profile
      </NavLink>
      <NavLink
        isSelected={isSelected("/settings")}
        isMobile={isMobile}
        href="/settings"
      >
        Settings
      </NavLink>
      <NavLink isMobile={isMobile} onClick={handleLogout}>
        Logout
      </NavLink>
    </>
  );

  const guestLinks = (isMobile) => (
    <>
      <NavLink
        isSelected={isSelected("/auth/login")}
        isMobile={isMobile}
        href="/auth/login"
      >
        Login
      </NavLink>
      <NavLink
        isSelected={isSelected("/auth/register")}
        isMobile={isMobile}
        href="/auth/register"
      >
        Register
      </NavLink>
    </>
  );

  const navigationLinks = (isMobile) => (
    <>
      <NavLink
        isSelected={isSelected("/team")}
        isMobile={isMobile}
        href="/team"
      >
        Team
      </NavLink>
      <NavLink
        isSelected={isSelected("/products")}
        isMobile={isMobile}
        href="/products"
      >
        Products
      </NavLink>
      <Menu as="div" className="relative ml-3">
        <NavLink
          isSelected={isSelected("/categories")}
          isMobile={isMobile}
          href=""
        >
          <Menu.Button className="text-white">Categories</Menu.Button>
        </NavLink>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    All Categories
                  </Link>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <NavLink href="/" isBanner>
                    <span className="sr-only">Tienda Online</span>
                    <Image
                      className="h-8 w-auto sm:h-10"
                      src="/workflow-mark-indigo-600.svg"
                      height={8}
                      width={8}
                      alt=""
                    />
                  </NavLink>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4 pt-2">
                    {navigationLinks(true)}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <div className="text-white">
                  {isAuthenticated ? `Wellcome: ${user?.first_name}` : ""}
                </div>
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
                          src={user?.profile_photo}
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
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Favorites</span>
                  <HeartIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Items in Cart</span>
                  <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigationLinks(true)}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
