"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  MapPin,
  Building2,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface FilterSidebarProps {
  city: string;
  totalResults: number;
  availableAreas?: string[];
  categories?: Array<{ _id: string; name: string; slug: string }>;
  currentCategorySlug?: string;
}

const DEFAULT_AREAS = [
  "Cyber City",
  "Golf Course Road",
  "Sohna Road",
  "MG Road",
  "Udyog Vihar",
  "Golf Course Ext.",
  "Sector 48",
];

const PRICE_RANGES = [
  { label: "All Budgets", min: "", max: "" },
  { label: "Under ₹8,000", min: "0", max: "8000" },
  { label: "₹8,000 - ₹15,000", min: "8000", max: "15000" },
  { label: "₹15,000 - ₹30,000", min: "15000", max: "30000" },
  { label: "Above ₹30,000", min: "30000", max: "" },
];

const CAPACITIES = [
  { label: "Any Capacity", value: "" },
  { label: "1 - 2 Desks", value: "1" },
  { label: "3 - 10 Seats", value: "3" },
  { label: "11 - 25 Seats", value: "11" },
  { label: "25+ Enterprise", value: "25" },
];

const POPULAR_AMENITIES = [
  "High-Speed WiFi",
  "24/7 Access",
  "Metro Connectivity",
  "Cafeteria",
  "Meeting Credits",
  "Dedicated Parking",
  "Power Backup",
];

export default function MarketplaceFilterSidebar({
  city,
  totalResults,
  availableAreas = DEFAULT_AREAS,
  categories = [],
  currentCategorySlug,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Active query parameters
  const activeArea = searchParams.get("area") || "";
  const activeMinPrice = searchParams.get("minPrice") || "";
  const activeMaxPrice = searchParams.get("maxPrice") || "";
  const activeCapacity = searchParams.get("capacity") || "";
  const activeAmenities = searchParams.get("amenities")
    ? searchParams.get("amenities")!.split(",")
    : [];
  const activeSort = searchParams.get("sort") || "price_asc";

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reset to page 1 on filter change

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleAmenity = (amenity: string) => {
    let next: string[];
    if (activeAmenities.includes(amenity)) {
      next = activeAmenities.filter((a) => a !== amenity);
    } else {
      next = [...activeAmenities, amenity];
    }
    updateFilters({ amenities: next.length > 0 ? next.join(",") : null });
  };

  const handleClearAll = () => {
    router.push(pathname);
    setMobileOpen(false);
  };

  const hasActiveFilters =
    Boolean(activeArea) ||
    Boolean(activeMinPrice) ||
    Boolean(activeMaxPrice) ||
    Boolean(activeCapacity) ||
    activeAmenities.length > 0;

  const FilterContent = (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1E5BFF]" />
          <h3 className="text-sm font-extrabold text-[#0A1F66] uppercase tracking-wider">
            Refine Spaces
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 transition"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* 1. Micro-Locations / Areas */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" /> Prime Locations
        </label>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
          <button
            onClick={() => updateFilters({ area: null })}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              !activeArea
                ? "bg-[#0A1F66] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Locations in {city}
          </button>
          {availableAreas.map((area) => (
            <button
              key={area}
              onClick={() =>
                updateFilters({ area: activeArea === area ? null : area })
              }
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                activeArea.toLowerCase() === area.toLowerCase()
                  ? "bg-[#0A1F66] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{area}</span>
              {activeArea.toLowerCase() === area.toLowerCase() && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D99000]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Budget Ranges */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#D99000]" /> Budget Bracket
        </label>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((pr, idx) => {
            const isSelected =
              activeMinPrice === pr.min && activeMaxPrice === pr.max;
            return (
              <button
                key={idx}
                onClick={() =>
                  updateFilters({
                    minPrice: pr.min || null,
                    maxPrice: pr.max || null,
                  })
                }
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                  isSelected
                    ? "bg-[#1E5BFF] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{pr.label}</span>
                {isSelected && (
                  <span className="text-[10px] uppercase font-bold text-blue-100">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Team Size / Capacity */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#1E5BFF]" /> Team Size / Capacity
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {CAPACITIES.map((cap) => (
            <button
              key={cap.value}
              onClick={() => updateFilters({ capacity: cap.value || null })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition ${
                activeCapacity === cap.value
                  ? "bg-[#0A1F66] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cap.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Amenities Checklist */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 block">
          Key Amenities
        </label>
        <div className="space-y-2">
          {POPULAR_AMENITIES.map((amenity) => {
            const isChecked = activeAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer select-none hover:text-[#1E5BFF] transition"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="rounded border-slate-300 text-[#1E5BFF] focus:ring-[#1E5BFF]"
                />
                <span>{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Sort Selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
          Sort Results
        </label>
        <div className="relative">
          <select
            value={activeSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#1E5BFF]"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="capacity_desc">Capacity: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-6">
          {FilterContent}
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-[#0A1F66] text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 active:scale-98"
        >
          <Filter className="w-3.5 h-3.5 text-[#1E5BFF]" />
          <span>Filters & Sort {hasActiveFilters && "(Active)"}</span>
        </button>

        <span className="text-xs font-bold text-slate-500 shrink-0">
          {totalResults} Spaces
        </span>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-sm font-black text-[#0A1F66]">
                  Filters & Preferences
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {FilterContent}
            </div>

            <div className="pt-4 border-t mt-6">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 bg-[#0A1F66] text-white rounded-xl text-xs font-extrabold shadow-md"
              >
                Apply Filters & Show Spaces
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
