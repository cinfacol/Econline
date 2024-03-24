"use client";

import { usePathname } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  HeartIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { logout as setLogout } from "@/redux/features/auth/authSlice";
// import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";
import { NavLink, NavbarActions, CategoryNav } from "@/components/common";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Team", href: "/team", current: true },
  { name: "Store", href: "/product", current: false },
];

export default function Navbar() {
  // const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [logout] = useLogoutMutation();

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: user, isLoading, isFetching } = useRetrieveUserQuery();

  const [searchQuery, setSearchQuery] = useState("");

  // const categories = useGetCategoriesQuery("getCategories");
  // const num_cats = categories?.data?.ids?.length;

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

  const isSelected = (path) => (pathname === path ? true : false);

  const authLinks = (isMobile) => (
    <>
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
        isSelected={isSelected("/product")}
        isMobile={isMobile}
        href="/product"
      >
        Store
      </NavLink>
      <CategoryNav />
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
                    {/* {navigationLinks(true)} */}
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <CategoryNav />
                  </div>
                </div>
              </div>
              <div className="relative w-full hidden lg:inline-flex lg:w-[400px] h-10 text-base text-gray-200 border-[1px] border-gray-400 items-center gap-2 justify-between px-6 rounded-full">
                <input
                  type="text"
                  placeholder="Search your products here"
                  className="flex-1 h-full outline-none bg-transparent placeholder:text-gray-400"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
                {searchQuery ? (
                  <XMarkIcon
                    onClick={() => setSearchQuery("")}
                    className="w-5 h-5 hover:text-red-500 duration-200 hover:cursor-pointer"
                  />
                ) : (
                  <MagnifyingGlassIcon className="w-5 h-5 hover:cursor-pointer" />
                )}
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <div className="text-white">
                  {isAuthenticated ? user?.first_name : "Guess"}
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
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Favorites</span>
                  <HeartIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <NavbarActions />
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
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
