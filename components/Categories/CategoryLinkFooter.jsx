"use client";
import Link from "next/link";
import React from "react";

const navigation = {
  solutions: [
    { name: "Marketing", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Commerce", href: "#" },
    { name: "Insights", href: "#" },
  ],
};

const CategoryLinkFooter = ({ data }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
        {data.name}
      </h3>
      <ul role="list" className="mt-4 space-y-4">
        {data?.sub_categories?.map((item) => (
          <li key={item.id}>
            <Link
              href={`/categories/${item.id}`}
              className="text-base text-gray-500 hover:text-gray-900"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryLinkFooter;
