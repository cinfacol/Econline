"use client";

import NextImage from "next/image";
import { TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import GalleryTab from "@/components/gallery/gallery-tab";
import { useGetProductQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import cloudinaryImageLoader from "@/actions/imageLoader";

const Gallery = ({ inventoryId }) => {
  const { data: entitie } = useGetProductQuery(inventoryId);
  const images = entitie?.image;
  return (
    <TabGroup as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <TabList className="grid grid-cols-4 gap-6">
          {images?.map((image) => (
            <GalleryTab key={image?.id} image={image} />
          ))}
        </TabList>
      </div>
      <TabPanels className="aspect-square w-full">
        {images?.map((image) => (
          <TabPanel key={image?.id}>
            <div className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden">
              <NextImage
                loader={cloudinaryImageLoader}
                fill
                sizes="(max-width: 768px) 100vw, 
               (max-width: 1200px) 50vw, 
               33vw"
                src={image?.image}
                alt={image?.alt_text}
                className="object-fill object-center"
                priority
              />
            </div>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};

export default Gallery;
