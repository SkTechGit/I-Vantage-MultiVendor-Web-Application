"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { Category } from "@/modules/category/category.types";

interface Props {
  categories: Category[];
}

export default function CategoryMarquee({ categories }: Props) {
  if (!categories.length) return null;

  // Duplicate categories for seamless infinite scrolling
  const marqueeCategories = [...categories, ...categories];

  const handleScrollToServices = () => {
    const el = document.getElementById("serviceSection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden border-y border-slate-200/80 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/70 py-4 sm:py-5">
      {/* Header Eyebrow */}
      <div className="mb-3 px-4 text-center sm:mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#0A1F66] bg-blue-50/70 border border-blue-100">
          <Sparkles className="w-3 h-3 text-[#F4A900]" />
          <span>Curated Business Infrastructure & Support Services</span>
        </div>
      </div>

      {/* Marquee Track */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent sm:w-24" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent sm:w-24" />

        <div className="category-marquee flex w-max gap-3 px-3 sm:gap-4 sm:px-4">
          {marqueeCategories.map((category, index) => (
            <button
              key={`${category._id}-${index}`}
              type="button"
              onClick={handleScrollToServices}
              className="
                group
                flex
                w-[210px]
                shrink-0
                items-center
                gap-3
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                px-3.5
                py-3
                text-left
                shadow-[0_2px_8px_rgba(10,31,102,0.03)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#1E5BFF]/40
                hover:shadow-[0_10px_24px_rgba(30,91,255,0.08)]
                sm:w-[250px]
                sm:px-4
                sm:py-3.5
              "
            >
              {/* Luxury Icon Box */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/80 text-[#1E5BFF] border border-blue-100/60 shadow-2xs transition-all duration-300 group-hover:bg-[#1E5BFF] group-hover:text-white group-hover:border-[#1E5BFF] sm:h-10 sm:w-10">
                <ArrowUpRight
                  size={16}
                  strokeWidth={2.4}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="truncate text-xs font-black text-[#0A1F66] transition-colors duration-200 group-hover:text-[#1E5BFF] sm:text-sm">
                    {category.name}
                  </h3>
                </div>

                <p className="mt-0.5 line-clamp-1 text-[11px] font-normal leading-4 text-slate-500 sm:text-xs">
                  {category.description || "Enterprise workspace & business desk"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}