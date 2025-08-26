"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/features/inventories/inventorySlice";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Search } from "lucide-react";

const ProductSearchBar = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state?.inventory?.searchTerm);

  const handleInputChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };
  const handleClearInput = () => {
    dispatch(setSearchTerm(""));
  };

  return (
    <div className="relative w-full hidden lg:inline-flex lg:w-[400px] h-10 text-base text-gray-500 border-[1px] border-gray-400 items-center gap-2 justify-between px-6 rounded-full">
      <input
        id="main-search"
        name="main-search"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        className="flex-1 h-full outline-none bg-transparent placeholder:text-gray-400"
        placeholder="Search for products..."
      />
      {searchTerm ? (
        <Search
          onClick={handleClearInput}
          className="w-5 h-5 hover:text-red-500 duration-200 hover:cursor-pointer"
        />
      ) : (
        <Search className="w-5 h-5 hover:cursor-pointer" />
      )}
    </div>
  );
};
export default ProductSearchBar;
