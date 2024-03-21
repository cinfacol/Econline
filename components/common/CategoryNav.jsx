"use client";

import CategoryLink from "@/components/Categories/CategoryLink";
import NoResults from "@/components/ui/no-results";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApiSlice";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CategoryNav() {
  const categories = useGetCategoriesQuery("getCategories");
  const num_cats = categories?.data?.ids?.length;

  return (
    <>
      <Menu as="div" className="relative ml-3">
        <div>
          <Menu.Button className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-1 py-2 text-sm font-medium">
            Categories
          </Menu.Button>
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
            <Menu.Item>
              {() => (
                <>
                  {num_cats !== 0 ? (
                    <CategoryLink data={categories?.data?.ids} />
                  ) : (
                    <NoResults title="Categories" />
                  )}
                </>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
