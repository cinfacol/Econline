import Link from "next/link";
import React from "react";

const CategoryLink = ({ data }) => {
  const parentData = data.filter((item) => item.is_parent);
  const noParentData = data.filter((item) => item.is_parent == false);
  return (
    <>
      <div className="group relative flex items-start gap-x-6 rounded-lg p-2 leading-6 bg-gray-200">
        <div className="flex-auto">
          <div className="block font-bold text-gray-900">
            {parentData.map((item) => (
              <div key={item.id}>{item.name}</div>
            ))}
            <span className="absolute inset-0" />
          </div>
        </div>
      </div>
      <div className="rounded-lg text-smflex-auto ml-6">
        {noParentData.map((sub) => (
          <Link
            href={`/category/${sub.id}`}
            className="block font-semibold text-gray-900"
          >
            <div className="rounded-lg p-1 text-sm hover:bg-gray-50 hover:text-blue-400">
              <div key={sub.id}>{sub.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryLink;
