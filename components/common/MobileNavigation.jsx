"use client";

import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";
import { Spinner } from "@/components/common";

export default function MobileNavigation() {
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
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <>
      <Tab.Group as="div" className="mt-2">
        <div className="border-b border-gray-200">
          <Tab.List className="-mb-px flex space-x-8 px-4">
            <Tab
              className={({ selected }) =>
                classNames(
                  selected
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-900",
                  "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium"
                )
              }
            >
              Categories
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels as={Fragment}>
          <Tab.Panel className="space-y-10 px-4 pb-8 pt-10">
            <div className="grid grid-cols-2 gap-x-4">
              {navigation.featured.map((item) => (
                <div key={item.name} className="group relative text-sm">
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
            {isParent?.map((section) => (
              <div key={section.name}>
                <p
                  id={`${section.name}-heading-mobile`}
                  className="font-medium text-gray-900"
                >
                  {section.name}
                </p>
                <ul
                  role="list"
                  aria-labelledby={`${section.name}-heading-mobile`}
                  className="mt-6 flex flex-col space-y-6"
                >
                  {notParent?.map((item) => (
                    <li key={item.name} className="flow-root">
                      <Link
                        href={`/category/${item.id}`}
                        className="-m-2 block p-2 text-gray-500"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

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
    </>
  );
}
