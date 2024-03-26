"use client";

import { useDispatch, useSelector } from "react-redux";
import { setSearchTerm } from "@/redux/features/inventories/inventorySlice";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const ProductSearchBar = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state?.inventory?.searchTerm);

  const handleInputChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };
  const handleClearInput = () => {
    dispatch(setSearchTerm(""));
  };

  return (
    <div className="relative w-full hidden lg:inline-flex lg:w-[400px] h-10 text-base text-gray-500 border-[1px] border-gray-400 items-center gap-2 justify-between px-6 rounded-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        className="flex-1 h-full outline-none bg-transparent placeholder:text-gray-400"
        placeholder="Search for products..."
      />
      {searchTerm ? (
        <XMarkIcon
          onClick={handleClearInput}
          className="w-5 h-5 hover:text-red-500 duration-200 hover:cursor-pointer"
        />
      ) : (
        <MagnifyingGlassIcon className="w-5 h-5 hover:cursor-pointer" />
      )}
    </div>
  );
};
