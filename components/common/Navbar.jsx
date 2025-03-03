"use client";

import { Fragment, useState } from "react";
import {
  Transition,
  TransitionChild,
  Dialog,
  DialogPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  HeartIcon,
  XMarkIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import {
  CartActions,
  Navigation,
  MobileNavigation,
  ProfileButton,
  ProductSearchBar,
} from "@/components/common";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const navigation = {
  pages: [
    { name: "Team", href: "/" },
    { name: "Products", href: "/product" },
  ],
};

/* function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
} */

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 z-40 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-6 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <Button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    variant="destructive"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </div>

                {/* Links */}
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <Link
                        href={page.href}
                        className="-m-2 block p-2 font-medium text-gray-900"
                      >
                        {page.name}
                      </Link>
                    </div>
                  ))}
                </div>
                <MobileNavigation />
                <div className="border-t border-gray-200 px-4 py-6">
                  <Link href="/" className="-m-2 flex items-center p-2">
                    <Image
                      src="/images/flag.svg"
                      alt=""
                      height={8}
                      width={8}
                      className="block h-auto w-5 flex-shrink-0"
                    />
                    <span className="ml-3 block text-base font-medium text-gray-900">
                      COL
                    </span>
                    <span className="sr-only">, change currency</span>
                  </Link>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

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
              <Button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                variant="destructive"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </Button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <span className="sr-only">Ecommerce EcOnline</span>
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
              <div className="flex h-full space-x-8 ">
                <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                  <div className="flex h-full space-x-8 ">
                    {navigation.pages.map((page) => (
                      <Link
                        key={page.name}
                        href={page.href}
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {page.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Navigation />
              </div>
              <div className="mx-auto hidden md:block">
                {/* Search Bar */}
                <ProductSearchBar />
              </div>
              <div className="ml-auto flex items-center">
                {/* Favorites */}
                <Button
                  type="button"
                  className="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  variant="destructive"
                >
                  <Link href="/" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Favorites</span>
                    <HeartIcon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                </Button>
                {/* Search */}
                <div className="flex lg:hidden">
                  <Link
                    href="/"
                    className="pl-1 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
                {/* Cart */}
                {isAuthenticated ? (
                  <CartActions />
                ) : (
                  <div className="flex">
                    <Button
                      onClick={() => {
                        toast.warning("You must logged in first");
                        router.push("/auth/login");
                      }}
                      className="text-gray-400 hover:text-gray-500"
                      variant="destructive"
                    >
                      <span className="sr-only">items in cart, view bag</span>
                      <ShoppingCartIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                      <span className="ml-1 text-sm font-medium text-gray-400">
                        0
                      </span>
                    </Button>
                  </div>
                )}

                {/* Notifications */}
                <Button
                  type="button"
                  className="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  variant="destructive"
                >
                  <Link href="/" className="text-gray-400 hover:text-gray-500">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                </Button>
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
