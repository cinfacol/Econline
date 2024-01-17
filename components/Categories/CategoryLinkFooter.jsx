"use client";
import Link from "next/link";
import React from "react";

const CategoryLinkFooter = ({ data }) => {
  return (
    <div>
      <h3 className="text-sm mt-2 font-bold text-gray-500 tracking-wider uppercase">
        {data.name}
      </h3>
      <ul role="list" className="mt-2">
        {data?.sub_categories?.map((item, index) => (
          <li key={index}>
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
