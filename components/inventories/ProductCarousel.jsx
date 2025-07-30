"use client";

import { NoResults, Skeleton } from "@/components/ui";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CarouselCard from "./CarouselCard";
import { useGetInventoriesQuery } from "@/redux/features/inventories/inventoriesApiSlice";
import { useAppSelector } from "@/redux/hooks";
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
  const searchTerm = useAppSelector((state) => state?.inventory?.searchTerm);
  const categoryTerm = useAppSelector(
    (state) => state?.inventory?.categoryTerm
  );
  const { data, isSuccess, isLoading, error } = useGetInventoriesQuery({
    searchTerm,
    categoryTerm,
  });
  const { ids = [], entities = {} } = data || {};

  const productList = useMemo(
    () =>
      Array.from(
        new Map(
          ids
            .filter((id) => id !== excludeId)
            .map((id) => entities[id])
            .filter((item) => item && item.id)
            .map((item) => [item.id, item])
        ).values()
      ),
    [ids, entities, excludeId]
  );

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
    if (productList.length === 0) {
      return <NoResults title={"products"} />;
    }
    return (
      <div className="relative px-2 py-4 md:px-8 md:py-6">
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={4}
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
          {productList.map((Item, index) => {
            const priority = index < 4;
            return (
              <CarouselCard
                key={Item.id}
                data={Item}
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
