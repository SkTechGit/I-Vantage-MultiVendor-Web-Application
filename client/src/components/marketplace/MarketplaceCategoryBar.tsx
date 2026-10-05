"use client";

import React from "react";
import Link from "next/link";

export interface MarketplaceCategoryItem {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
}

export const DEFAULT_MARKETPLACE_CATEGORIES: MarketplaceCategoryItem[] = [
  { _id: "cat-1", name: "Private Cabin", slug: "private-cabin" },
  { _id: "cat-2", name: "Meeting Room", slug: "meeting-room" },
  { _id: "cat-3", name: "Conference Room", slug: "conference-room" },
  { _id: "cat-4", name: "Coworking Seat", slug: "coworking-seat" },
  { _id: "cat-5", name: "Day Pass", slug: "day-pass" },
  { _id: "cat-6", name: "Dedicated Desk", slug: "dedicated-desk" },
];

interface Props {
  normalizedCity: string;
  categories: MarketplaceCategoryItem[];
  activeCategorySlug?: string;
}

export default function MarketplaceCategoryBar({
  normalizedCity,
  categories,
  activeCategorySlug,
}: Props) {
  const displayCategories =
    categories && categories.length > 0
      ? categories
      : DEFAULT_MARKETPLACE_CATEGORIES;

  const isAllSpacesActive =
    !activeCategorySlug ||
    activeCategorySlug === "all" ||
    activeCategorySlug === "";

  return (
    <section className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-3 sticky top-17 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-2">
            Category:
          </span>

          {/* All Spaces Pill */}
          <Link
            href={`/${normalizedCity}`}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
              isAllSpacesActive
                ? "bg-[#0A1F66] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Spaces
          </Link>

          {/* Individual Category Pills */}
          {displayCategories.map((cat) => {
            const catId = cat._id || cat.id || cat.slug;
            const isActive =
              !isAllSpacesActive &&
              cat.slug.toLowerCase() === activeCategorySlug?.toLowerCase();

            return (
              <Link
                key={catId}
                href={`/${normalizedCity}/${cat.slug}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-[#0A1F66] text-white shadow-xs"
                    : "bg-slate-100 hover:bg-[#0A1F66] hover:text-white text-slate-700"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
