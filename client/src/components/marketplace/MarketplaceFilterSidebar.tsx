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
  Check,
} from "lucide-react";

interface FilterSidebarProps {
  city: string;
  totalResults: number;
  availableAreas?: string[];
  categories?: Array<{ _id: string; name: string; slug: string }>;
  currentCategorySlug?: string;
  topOffset?: number;
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

const POPULAR_HUBS = ["Sohna Road", "Cyber City", "Golf Course Road"];

const CAPACITIES = [
  { label: "Any Size", value: "" },
  { label: "1 - 2 Desks", value: "1" },
  { label: "3 - 10 Seats", value: "3" },
  { label: "11+ Enterprise", value: "11" },
];

const PRIMARY_AMENITIES = [
  "High-Speed WiFi",
  "24/7 Access",
  "Metro Connectivity",
  "Power Backup",
];

const EXTRA_AMENITIES = [
  "Cafeteria",
  "Meeting Credits",
  "Dedicated Parking",
];

export default function MarketplaceFilterSidebar({
  city,
  totalResults,
  availableAreas = DEFAULT_AREAS,
  categories = [],
  currentCategorySlug,
  topOffset = 136,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

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

  // Active budget bracket helper
  const getSelectedBudget = () => {
    if (activeMaxPrice === "8000") return "8000";
    if (activeMinPrice === "8000" && activeMaxPrice === "15000") return "15000";
    if (activeMinPrice === "15000" && activeMaxPrice === "30000") return "30000";
    if (activeMinPrice === "30000") return "30000+";
    return "";
  };

  const handleBudgetChange = (val: string) => {
    if (!val) {
      updateFilters({ minPrice: null, maxPrice: null });
    } else if (val === "8000") {
      updateFilters({ minPrice: null, maxPrice: "8000" });
    } else if (val === "15000") {
      updateFilters({ minPrice: "8000", maxPrice: "15000" });
    } else if (val === "30000") {
      updateFilters({ minPrice: "15000", maxPrice: "30000" });
    } else if (val === "30000+") {
      updateFilters({ minPrice: "30000", maxPrice: null });
    }
  };

  const FilterContent = (
    <div className="space-y-4">
      {/* 1. Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
            <SlidersHorizontal size={14} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0A1F66]">
              Refine Spaces
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold">
              {totalResults} Verified Hubs
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 transition px-2 py-1 rounded-md hover:bg-red-50"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 2. Micro-Locations Dropdown + Quick Pills */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <MapPin size={13} className="text-[#1E5BFF]" />
          <span>Prime Location</span>
        </label>

        <div className="relative">
          <select
            value={activeArea}
            onChange={(e) => updateFilters({ area: e.target.value || null })}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-bold text-slate-800 outline-none transition focus:border-[#1E5BFF] focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Locations in {city}</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Quick Hub Pills */}
        <div className="flex flex-wrap gap-1 pt-1">
          {POPULAR_HUBS.map((hub) => {
            const isSelected = activeArea.toLowerCase() === hub.toLowerCase();
            return (
              <button
                key={hub}
                type="button"
                onClick={() => updateFilters({ area: isSelected ? null : hub })}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition ${
                  isSelected
                    ? "bg-[#0A1F66] text-white border-[#0A1F66]"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {hub.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Budget Bracket Dropdown */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#F4A900]" />
          <span>Max Budget</span>
        </label>

        <div className="relative">
          <select
            value={getSelectedBudget()}
            onChange={(e) => handleBudgetChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-bold text-slate-800 outline-none transition focus:border-[#1E5BFF] focus:bg-white focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Any Budget</option>
            <option value="8000">Under ₹8,000 / mo</option>
            <option value="15000">₹8,000 - ₹15,000 / mo</option>
            <option value="30000">₹15,000 - ₹30,000 / mo</option>
            <option value="30000+">Enterprise Suites (₹30k+)</option>
          </select>
          <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 4. Team Size / Capacity (2x2 Grid) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Building2 size={13} className="text-[#1E5BFF]" />
          <span>Team Size</span>
        </label>

        <div className="grid grid-cols-2 gap-1.5">
          {CAPACITIES.map((cap) => {
            const isSelected = activeCapacity === cap.value;
            return (
              <button
                key={cap.label}
                type="button"
                onClick={() => updateFilters({ capacity: cap.value || null })}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition text-center border ${
                  isSelected
                    ? "bg-[#0A1F66] text-white border-[#0A1F66] shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cap.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Key Amenities (Compact 2-Column Grid) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
            Amenities
          </label>
          <button
            type="button"
            onClick={() => setShowAllAmenities(!showAllAmenities)}
            className="text-[10px] font-semibold text-[#1E5BFF] hover:underline"
          >
            {showAllAmenities ? "Less" : "+3 More"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {(showAllAmenities
            ? [...PRIMARY_AMENITIES, ...EXTRA_AMENITIES]
            : PRIMARY_AMENITIES
          ).map((amenity) => {
            const isChecked = activeAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer select-none transition ${
                  isChecked
                    ? "bg-blue-50/80 border-blue-200 text-[#0A1F66]"
                    : "bg-white border-slate-200/90 text-slate-600 hover:border-slate-300"
                }`}
              >
                <div
                  className={`h-3.5 w-3.5 rounded flex items-center justify-center border transition ${
                    isChecked
                      ? "bg-[#1E5BFF] border-[#1E5BFF] text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isChecked && <Check size={10} strokeWidth={3} />}
                </div>
                <span className="truncate">{amenity}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 6. Sort Selector */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Sort Spaces
        </label>
        <div className="relative">
          <select
            value={activeSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none transition focus:border-[#1E5BFF] focus:bg-white"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="capacity_desc">Capacity: High to Low</option>
            <option value="newest">Newest Listed</option>
          </select>
          <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar: Compact, rock-solid, never scrolls internally */}
      <aside
        className="hidden lg:block w-72 shrink-0 self-start sticky z-20"
        style={{ top: `${topOffset}px` }}
      >
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_4px_24px_rgba(10,31,102,0.05)]">
          {FilterContent}
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
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
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <span className="text-sm font-black text-[#0A1F66]">
                  Filters & Preferences
                </span>
                <button
                  type="button"
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
                type="button"
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
