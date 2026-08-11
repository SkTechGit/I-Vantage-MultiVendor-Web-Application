"use client";

import { ArrowRight } from "lucide-react";
import { Category } from "@/modules/category/category.types";

interface Props {
  categories: Category[];
}

export default function CategoryMarquee({
  categories,
}: Props) {
  if (!categories.length) return null;

  // Duplicate categories for seamless infinite scrolling
  const marqueeCategories = [...categories, ...categories];

  return (
    <section className="w-full overflow-hidden border-y border-slate-100 bg-slate-50 py-4 sm:py-5">
      {/* Heading */}
      <div className="mb-3 px-4 text-center sm:mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-700 sm:text-xs">
          Explore Our Services
        </p>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-slate-50 to-transparent sm:w-16" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-slate-50 to-transparent sm:w-16" />

        <div className="category-marquee flex w-max gap-3 px-3 sm:gap-4 sm:px-4">
          {marqueeCategories.map((category, index) => (
            <div
              key={`${category._id}-${index}`}
              className="
                flex
                w-[190px]
                shrink-0
                items-center
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                py-3
                shadow-sm
                transition
                hover:border-blue-200
                hover:shadow-md

                sm:w-[230px]
                sm:px-4
                sm:py-3.5
              "
            >
              {/* Icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF] sm:h-9 sm:w-9">
                <ArrowRight
                  size={15}
                  strokeWidth={2.5}
                  className="sm:h-4 sm:w-4"
                />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <h3 className="truncate text-xs font-bold text-[#0A1F66] sm:text-sm">
                  {category.name}
                </h3>

                <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-500 sm:text-xs">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}