"use client";

import { Fragment } from "react";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";
import { Spinner } from "@/components/common";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const { data, isSuccess, isLoading, error } = useGetCategoriesQuery();

  if (isLoading) return <Spinner lg />;
  if (error) return <p className="pt-4 mt-1">{error?.data?.error}</p>;

  // Destructure data and handle empty category case concisely
  const { ids = [] } = data || {}; // Default to empty array
  const { entities = [] } = data || {}; // Default to empty array

  const items = ids?.map((item) => {
    const Item = entities[item];
    return Item;
  });

  const num_cats = ids?.length;
  const navigation = {
    featured: [
      {
        name: "New Arrivals",
        href: "/",
        imageSrc:
          "https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80",
        imageAlt:
          "Models sitting back to back, wearing Basic Tee in black and bone.",
      },
      {
        name: "Basic Tees",
        href: "/",
        imageSrc:
          "https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80",
        imageAlt:
          "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
      },
    ],
  };

  return (
    <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
      <div className="flex h-full space-x-8">
        <Popover className="flex">
          {({ open }) => (
            <>
              <div className="relative flex">
                <PopoverButton
                  className={classNames(
                    open
                      ? "border-indigo-600 text-gray-800 font-extrabold"
                      : "border-transparent text-gray-700 hover:text-gray-800",
                    "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                  )}
                >
                  <span>Categories</span>
                  <ChevronDownIcon
                    className={classNames(
                      open
                        ? "text-orange-300"
                        : "text-gray-700 hover:text-gray-800",
                      "ml-1 h-5 w-5 transition duration-150 ease-in-out group-hover:text-orange-300/80"
                    )}
                    aria-hidden="true"
                  />
                </PopoverButton>
              </div>
              {/* <Popover.Overlay className="fixed inset-0 bg-black opacity-30" /> */}

              <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute inset-x-0 top-full text-sm text-gray-500 z-10 mt-3">
                  {({ close }) => (
                    <>
                      {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                      <div
                        className="absolute inset-0 top-1/2 bg-white shadow"
                        aria-hidden="true"
                      />

                      <div className="relative bg-white">
                        <div className="mx-auto max-w-7xl px-8">
                          <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                            <div className="col-start-2 grid grid-cols-2 gap-x-8">
                              {navigation.featured.map((item) => (
                                <div
                                  key={item.name}
                                  className="group relative text-base sm:text-sm"
                                >
                                  <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                    <img
                                      src={item.imageSrc}
                                      alt={item.imageAlt}
                                      className="object-cover object-center"
                                    />
                                  </div>
                                  <Link
                                    href={item.href}
                                    onClick={() => close()}
                                    className="mt-6 block font-medium text-gray-900"
                                  >
                                    <span
                                      className="absolute inset-0 z-10"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                  <p aria-hidden="true" className="mt-1">
                                    Shop now
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                              {items?.map((section) => (
                                <div key={section.id}>
                                  <p
                                    id={`${section.name}-heading`}
                                    className="font-medium text-gray-900"
                                  >
                                    <Link
                                      href={`/category/${section.id}`}
                                      onClick={() => close()}
                                    >
                                      {section.name}
                                    </Link>
                                  </p>
                                  <ul
                                    role="list"
                                    aria-labelledby={`${section.name}-heading`}
                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                  >
                                    {section?.sub_categories?.map((item) => (
                                      <li key={item.id} className="flex">
                                        <Link
                                          href={`/category/${item.id}`}
                                          onClick={() => close()}
                                          className="hover:text-gray-800"
                                        >
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </PopoverGroup>
  );
}
