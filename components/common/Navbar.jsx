"use client";

import { Fragment, useCallback, useState } from "react";
import {
  Transition,
  TransitionChild,
  Dialog,
  DialogPanel,
} from "@headlessui/react";
import { X, Heart, ShoppingCart, Bell, Search, Menu } from "lucide-react";
import {
  CartActions,
  Navigation,
  MobileNavigation,
  ProfileButton,
  GuestButton,
  ProductSearchBar,
} from "@/components/common";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const navigation = {
  pages: [
    {
      name: "Compras",
      protectedRoute: true, // agregamos esta propiedad
      authHref: "/purchases", // ruta cuando está autenticado
      guestHref: "/auth/login", // ruta cuando no está autenticado
    },
    { name: "Products", href: "/products" },
  ],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isGuest, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();

  // Función helper para obtener la URL correcta
  const getPageHref = useCallback(
    (page) => {
      if (!page.protectedRoute) return page.href;
      return isAuthenticated ? page.authHref : page.guestHref;
    },
    [isAuthenticated]
  );

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
                    variant="outline"
                    size="default"
                    onClick={() => setOpen(false)}
                  >
                    <X />
                  </Button>
                </div>

                {/* Links */}
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <Link
                        href={getPageHref(page)}
                        className="-m-2 block p-2 font-medium text-gray-900"
                        onClick={(e) => {
                          if (page.protectedRoute && !isAuthenticated) {
                            toast.warning("Debes iniciar sesión primero");
                          }
                        }}
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
          Get free delivery on orders over $15
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-2 md:flex-row h-20">
                <Button
                  variant="outline"
                  className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                  size="default"
                  onClick={() => setOpen(true)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  <Menu />
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
                          href={getPageHref(page)}
                          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                          onClick={(e) => {
                            if (page.protectedRoute && !isAuthenticated) {
                              toast.warning("Debes iniciar sesión primero");
                            }
                          }}
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
                  <Button variant="outline" size="lg">
                    <Link
                      href="/"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Favorites</span>
                      <Heart />
                    </Link>
                  </Button>
                  {/* Search */}
                  <div className="flex lg:hidden">
                    <Link
                      href="/"
                      className="pl-1 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Search</span>
                      <Search />
                    </Link>
                  </div>
                  {/* Cart */}
                  {!isLoading && isAuthenticated && !isGuest ? (
                    <CartActions />
                  ) : (
                    <div className="relative flex">
                      <Button
                        variant="outline"
                        className="text-gray-400 hover:text-gray-500 cursor-pointer"
                        size="lg"
                        onClick={() => {
                          if (!isLoading) {
                            toast.warning("You must logged in first");
                            router.push("/auth/login");
                          }
                        }}
                      >
                        <span className="sr-only">items in cart, view bag</span>
                        <ShoppingCart />
                        <span className="absolute top-2 right-0 inline-flex items-center justify-center px-2 py-1 mr-3 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full">
                          0
                        </span>
                      </Button>
                    </div>
                  )}

                  {/* Notifications */}
                  <Button variant="outline" size="lg">
                    <Link
                      href="/"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">View notifications</span>
                      <Bell />
                    </Link>
                  </Button>
                  {/* profileButton */}
                  {isAuthenticated ? <ProfileButton /> : <GuestButton />}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
