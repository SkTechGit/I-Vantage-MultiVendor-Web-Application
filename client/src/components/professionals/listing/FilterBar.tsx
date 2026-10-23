"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import type { ProfessionalCategoryItem } from "@/lib/professionals.api";

export interface FilterState {
  q: string;
  category: string;
  city: string;
  mode: string;
  sort: string;
}

interface Props {
  categories: ProfessionalCategoryItem[];
  filters: FilterState;
  onChange: (next: FilterState) => void;
  availableCities?: string[];
  totalResults?: number;
}

export default function FilterBar({
  categories,
  filters,
  onChange,
  availableCities = ["Gurugram", "Delhi", "Noida", "Bengaluru", "Mumbai"],
  totalResults,
}: Props) {
  const [searchInput, setSearchInput] = useState(filters.q || "");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync internal search input if parent filters change
  useEffect(() => {
    setSearchInput(filters.q || "");
  }, [filters.q]);

  // Debounced search trigger (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filters.q) {
        onChange({ ...filters, q: searchInput });
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.mode ? 1 : 0) +
    (filters.sort !== "recommended" && filters.sort ? 1 : 0) +
    (filters.q ? 1 : 0);

  const handleReset = () => {
    setSearchInput("");
    onChange({
      q: "",
      category: "",
      city: "",
      mode: "",
      sort: "recommended",
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Search + Quick Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, expertise, CA, legal, taxation..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 shadow-2xs"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onChange({ ...filters, q: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Desktop Filter Dropdowns */}
        <div className="hidden md:flex items-center gap-2">
          {/* City Selector */}
          <div className="relative">
            <select
              value={filters.city}
              onChange={(e) => onChange({ ...filters, city: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 shadow-2xs cursor-pointer"
            >
              <option value="">All Locations</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Consultation Mode Selector */}
          <div className="relative">
            <select
              value={filters.mode}
              onChange={(e) => onChange({ ...filters, mode: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 shadow-2xs cursor-pointer"
            >
              <option value="">All Consultation Modes</option>
              <option value="ONLINE">Online (Video/Audio)</option>
              <option value="IN_PERSON">In-Person (Office)</option>
              <option value="BOTH">Hybrid (Both)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => onChange({ ...filters, sort: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 shadow-2xs cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="experience">Sort: Highest Experience</option>
              <option value="name_asc">Sort: Name (A-Z)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset button if filters active */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#1E5BFF]" />
            <span>Filters & Sort</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#1E5BFF] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        <button
          type="button"
          onClick={() => onChange({ ...filters, category: "" })}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            !filters.category
              ? "bg-[#0A1F66] text-white shadow-2xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
          }`}
        >
          All Professionals
        </button>
        {categories.map((cat) => {
          const isSelected = filters.category === cat.slug;
          return (
            <button
              key={cat._id || cat.slug}
              type="button"
              onClick={() => onChange({ ...filters, category: cat.slug })}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-[#0A1F66] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
              }`}
            >
              {cat.label || cat.name}
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer/Modal for Filters */}
      {isMobileFiltersOpen && (
        <div className="md:hidden p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0A1F66]">
              Filter & Sort Options
            </h4>
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* City */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Location</label>
              <select
                value={filters.city}
                onChange={(e) => onChange({ ...filters, city: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
              >
                <option value="">All Locations</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Consultation Mode</label>
              <select
                value={filters.mode}
                onChange={(e) => onChange({ ...filters, mode: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
              >
                <option value="">All Consultation Modes</option>
                <option value="ONLINE">Online (Video/Audio)</option>
                <option value="IN_PERSON">In-Person (Office)</option>
                <option value="BOTH">Hybrid (Both)</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sort Results</label>
              <select
                value={filters.sort}
                onChange={(e) => onChange({ ...filters, sort: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
              >
                <option value="recommended">Recommended</option>
                <option value="experience">Highest Experience</option>
                <option value="name_asc">Name (A-Z)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#0A1F66] text-white font-bold text-center mt-2 shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
