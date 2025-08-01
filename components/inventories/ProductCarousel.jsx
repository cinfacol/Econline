"use client";

import { NoResults } from "@/components/ui";
import { Skeleton } from "@/components/skeletons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselCard from "./CarouselCard";
import { useGetInventoryImagesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";

function Arrow(props) {
  const { style, onClick, direction } = props;
  return (
    <button
      className={`slick-arrow !z-50 absolute top-1/2 transform -translate-y-1/2 border-none p-0 flex items-center justify-center transition-colors duration-200 ${
        direction === "next" ? "right-4" : "left-4"
      }`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
      aria-label={
        direction === "next"
          ? "Ir al siguiente producto"
          : "Ir al producto anterior"
      }
      tabIndex={0}
    >
      <span
        className="flex items-center justify-center rounded-full transition-colors duration-200 group hover:bg-gray-200"
        style={{ width: 40, height: 40 }}
      >
        <ChevronRight
          size={24}
          strokeWidth={3}
          className={`transition-colors duration-200 text-[#888] group-hover:text-[#222] ${
            direction === "prev" ? "-rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

export default function ProductCarousel({ excludeId }) {
  const { data, isSuccess, isLoading, error } = useGetInventoryImagesQuery();

  if (isLoading) {
    return (
      <section>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (error) {
    return <p>Error: {error?.message}</p>;
  }
  if (isSuccess) {
    if (data.length === 0) {
      return <NoResults title={"images"} />;
    }
    return (
      <div className="relative px-2 py-4 md:px-8 md:py-6">
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={6}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={7000}
          cssEase="cubic-bezier(0.77, 0, 0.175, 1)"
          nextArrow={<Arrow direction="next" />}
          prevArrow={<Arrow direction="prev" />}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
          ]}
        >
          {data.map((Item, index) => {
            // Las primeras 6 imágenes tienen priority
            const priority = index < 6;
            const defaultImage = Array.isArray(Item.images)
              ? Item.images.find((img) => img.default === true)
              : null;
            return (
              <CarouselCard
                key={Item.id}
                image={defaultImage}
                id={Item.id}
                priority={priority}
                imgClassName="w-32 h-32 object-cover mx-auto"
              />
            );
          })}
        </Slider>
      </div>
    );
  }
}
