"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import ProfessionalCard from "../listing/ProfessionalCard";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professionals: ProfessionalProfileItem[];
  categoryName?: string;
  categorySlug?: string;
}

export default function RelatedProfessionalsSection({
  professionals,
  categoryName = "Experts",
  categorySlug,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScrollability, { passive: true });
    window.addEventListener("resize", checkScrollability);

    return () => {
      el.removeEventListener("scroll", checkScrollability);
      window.removeEventListener("resize", checkScrollability);
    };
  }, [professionals]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!professionals || professionals.length === 0) return null;

  return (
    <section className="space-y-6 pt-10 border-t border-slate-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
            <Sparkles className="w-3.5 h-3.5 text-[#D99000]" />
            <span>Recommended Consultants</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
            Recommended Verified {categoryName}
          </h2>
          <p className="text-xs text-slate-500">
            Swipe or scroll horizontally to explore verified practitioners in similar practice areas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {categorySlug && (
            <Link
              href={`/professionals/category/${categorySlug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5BFF] hover:text-[#0A1F66] transition-colors whitespace-nowrap"
            >
              <span>View All {categoryName}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {/* Left / Right Carousel Navigation Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-[#1E5BFF] hover:text-[#1E5BFF] hover:bg-blue-50/50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-[#1E5BFF] hover:text-[#1E5BFF] hover:bg-blue-50/50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar scrollbar-none"
          tabIndex={0}
          aria-label="Recommended consultants carousel"
        >
          {professionals.map((pro) => (
            <div
              key={pro._id}
              className="w-[280px] sm:w-[320px] shrink-0 snap-start flex"
            >
              <div className="w-full flex flex-col">
                <ProfessionalCard professional={pro} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
