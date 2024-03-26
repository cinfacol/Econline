"use client";

import { usePathname } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/auth/authApiSlice";
import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition, Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useLogoutMutation } from "@/redux/features/auth/authApiSlice";
import { logout as setLogout } from "@/redux/features/auth/authSlice";
import {
  NavLink,
  CartActions,
  CategoryNav,
  Navigation,
  MobileNavigation,
  ProfileButton,
} from "@/components/common";
import Image from "next/image";
import Link from "next/link";
import { ProductSearchBar } from "./Searchbar";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  // const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [logout] = useLogoutMutation();

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
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <MobileNavigation />
                <div className="border-t border-gray-200 px-4 py-6">
                  <Link href="/" className="-m-2 flex items-center p-2">
                    <img
                      src="https://tailwindui.com/img/flags/flag-canada.svg"
                      alt=""
                      className="block h-auto w-5 flex-shrink-0"
                    />
                    <span className="ml-3 block text-base font-medium text-gray-900">
                      CAD
                    </span>
                    <span className="sr-only">, change currency</span>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <span className="sr-only">Your Company</span>
                  <Image
                    className="h-8 w-auto"
                    src="/workflow-mark-indigo-600.svg"
                    height={8}
                    width={8}
                    alt=""
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <Navigation />
              <div className="mx-auto hidden md:block">
                {/* Search Bar */}
                <ProductSearchBar />
              </div>
              <div className="ml-auto flex items-center">
                {/* Favorites */}
                <div className="flex ml-2">
                  <Link
                    href="/"
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Favorites</span>
                    <HeartIcon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                </div>
                {/* Search */}
                <div className="flex">
                  <Link
                    href="/"
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
                {/* Cart */}
                <CartActions />
                {/* Notifications */}
                <div className="flex">
                  <Link
                    href="/"
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                </div>
                {/* profileButton */}
                <ProfileButton />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
