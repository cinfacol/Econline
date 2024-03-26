"use client";

import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";
import { Spinner } from "@/components/common";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const { data, isSuccess, isLoading, error } =
    useGetCategoriesQuery("getCategories");

  if (isLoading) return <Spinner lg />;
  if (error) return <p>Error: {error?.data?.detail}</p>;

  // Destructure data and handle empty cart case concisely
  const { ids = [] } = data || {}; // Default to empty array
  const { entities = [] } = data || {}; // Default to empty array

  const items = ids?.map((item) => {
    const Item = entities[item];
    return Item;
  });

  const isParent = items?.filter((item) => {
    const Item = item.is_parent === true;
    return Item;
  });
  const notParent = items?.filter((item) => {
    const Item = item.is_parent === false;
    return Item;
  });
  // console.log("items", items);
  // console.log("isParent", isParent);

  const num_cats = ids?.length;
  const navigation = {
    featured: [
      {
        name: "New Arrivals",
        href: "/",
        imageSrc:
          "https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg",
        imageAlt:
          "Models sitting back to back, wearing Basic Tee in black and bone.",
      },
      {
        name: "Basic Tees",
        href: "/",
        imageSrc:
          "https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg",
        imageAlt:
          "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
      },
    ],
    pages: [
      { name: "Team", href: "/" },
      { name: "Products", href: "/product" },
    ],
  };

  return (
    <>
      <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
        <div className="flex h-full space-x-8">
          <Popover className="flex">
            {({ open }) => (
              <>
                <div className="relative flex">
                  <Popover.Button
                    className={classNames(
                      open
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-700 hover:text-gray-800",
                      "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                    )}
                  >
                    Categories
                  </Popover.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
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
                            {isParent?.map((section) => (
                              <div key={section.name}>
                                <p
                                  id={`${section.name}-heading`}
                                  className="font-medium text-gray-900"
                                >
                                  {section.name}
                                </p>
                                <ul
                                  role="list"
                                  aria-labelledby={`${section.name}-heading`}
                                  className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                >
                                  {notParent?.map((item) => (
                                    <li key={item.name} className="flex">
                                      <Link
                                        href={`/category/${item.id}`}
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
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>

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
      </Popover.Group>
    </>
  );
}
