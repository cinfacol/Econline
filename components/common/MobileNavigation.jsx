"use client";

import { Fragment } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
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
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <TabGroup as="div" className="mt-2">
      <div className="border-b border-gray-200">
        <TabList className="-mb-px flex space-x-8 px-4">
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
        </TabList>
      </div>
      <TabPanels as={Fragment}>
        <TabPanel className="space-y-10 px-4 pb-8 pt-10">
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
                  <span className="absolute inset-0 z-10" aria-hidden="true" />
                  {item.name}
                </Link>
                <p aria-hidden="true" className="mt-1">
                  Shop now
                </p>
              </div>
            ))}
          </div>
          {items?.map((section) => (
            <div key={section.id}>
              <p
                id={`${section.name}-heading-mobile`}
                className="font-medium text-gray-900"
              >
                <Link href={`/category/${section.id}`}>{section.name}</Link>
              </p>
              <ul
                role="list"
                aria-labelledby={`${section.name}-heading-mobile`}
                className="mt-1 flex flex-col"
              >
                {section?.sub_categories?.map((item) => (
                  <li key={item.id} className="flow-root">
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
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
