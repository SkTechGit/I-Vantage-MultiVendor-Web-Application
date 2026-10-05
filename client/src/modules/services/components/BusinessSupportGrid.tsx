"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Layers,
  ArrowUpRight,
  Check,
  Search,
  Scale,
  Calculator,
  UserCheck,
  TrendingUp,
  Megaphone,
  Cpu,
  Building,
  Headphones,
  Rocket,
  Crown,
  Laptop,
} from "lucide-react";
import Container from "@/components/common/Container";
import { Service } from "@/modules/service/service.types";
import { CategoryWithServices } from "./CategoryServicesModal";

interface Props {
  categories: CategoryWithServices[];
  selectedServices: Service[];
  onSelectCategory: (category: CategoryWithServices) => void;
  isLoading?: boolean;
}

const getCategoryIcon = (slugOrName: string) => {
  const str = (slugOrName || "").toLowerCase();
  if (str.includes("ai") || str.includes("artificial")) return Cpu;
  if (str.includes("legal") || str.includes("law")) return Scale;
  if (str.includes("finance") || str.includes("tax") || str.includes("accounting")) return Calculator;
  if (str.includes("growth") || str.includes("sales")) return TrendingUp;
  if (str.includes("marketing") || str.includes("brand")) return Megaphone;
  if (str.includes("tech") || str.includes("software")) return Laptop;
  if (str.includes("human") || str.includes("hr") || str.includes("recruit")) return UserCheck;
  if (str.includes("setup") || str.includes("startup") || str.includes("incorporat")) return Rocket;
  if (str.includes("premium")) return Crown;
  if (str.includes("customer") || str.includes("support")) return Headphones;
  if (str.includes("workspace") || str.includes("office")) return Building;
  return Layers;
};

export default function BusinessSupportGrid({
  categories,
  selectedServices,
  onSelectCategory,
  isLoading = false,
}: Props) {
  const [search, setSearch] = useState("");

  const isSelected = (serviceId: string) => {
    return selectedServices.some((s) => s._id === serviceId);
  };

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const query = search.toLowerCase().trim();

    return categories
      .map((cat) => {
        const matchesCategory =
          cat.name.toLowerCase().includes(query) ||
          cat.description?.toLowerCase().includes(query);

        const matchingServices = cat.services.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.shortDescription?.toLowerCase().includes(query)
        );

        if (matchesCategory) {
          return cat;
        }

        if (matchingServices.length > 0) {
          return {
            ...cat,
            services: matchingServices,
          };
        }

        return null;
      })
      .filter((cat): cat is CategoryWithServices => cat !== null);
  }, [categories, search]);

  return (
    <section id="business-support" className="border-t border-slate-100 bg-white py-8 sm:py-16 lg:py-20">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] bg-blue-50 border border-blue-100 text-[#1E5BFF] shadow-2xs">
            <Sparkles size={13} className="text-[#F4A900]" />
            <span>Beyond Workspace • Specialized Desks</span>
          </div>

          <h2 className="text-xl font-black leading-tight tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
            Business Support Desks &amp; Services
          </h2>

          <p className="mt-2 text-xs sm:text-base leading-relaxed text-slate-600 max-w-2xl mx-auto line-clamp-2 sm:line-clamp-none">
            Click any desk below to view individual services, select the solutions you need with checkboxes, and receive a consolidated consultation package.
          </p>

          {/* Search Bar */}
          <div className="pt-2 sm:pt-4 max-w-md mx-auto">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E5BFF] transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services (e.g. GST, Legal, Marketing)..."
                className="w-full text-xs sm:text-sm pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/80 border border-slate-200/90 rounded-xl sm:rounded-2xl text-slate-900 placeholder:text-slate-400 outline-none transition-all hover:border-slate-300 focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100 shadow-2xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 px-2 py-0.5 rounded-md transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Grid: 2 columns on mobile, 2 on tablet, 3 on desktop */}
        <div className="mt-6 sm:mt-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {isLoading && categories.length === 0 ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-36 sm:h-56 rounded-2xl sm:rounded-3xl border border-slate-100 bg-slate-50/60 p-3.5 sm:p-6 animate-pulse"
              />
            ))
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((category) => {
              const selectedInCat = category.services.filter((s) => isSelected(s._id)).length;
              const Icon = getCategoryIcon(category.slug || category.name);

              return (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => onSelectCategory(category)}
                  className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border p-3.5 sm:p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(30,91,255,0.08)] cursor-pointer ${
                    selectedInCat > 0
                      ? "border-[#1E5BFF]/70 bg-gradient-to-b from-blue-50/40 to-white shadow-sm ring-1 ring-[#1E5BFF]/20"
                      : "border-slate-200/85 bg-white shadow-xs hover:border-[#1E5BFF]/50"
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Arrow */}
                    <div className="flex items-start justify-between gap-2 mb-2 sm:mb-4">
                      <div className="flex h-8.5 w-8.5 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-50 text-[#1E5BFF] border border-blue-100/70 transition-all duration-300 group-hover:bg-[#0A1F66] group-hover:text-white group-hover:border-[#0A1F66] shadow-2xs shrink-0">
                        <Icon size={16} strokeWidth={2.2} className="sm:w-5 sm:h-5" />
                      </div>

                      <span className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-100/70 text-slate-400 transition-all duration-300 group-hover:bg-[#1E5BFF] group-hover:text-white group-hover:scale-105 shrink-0">
                        <ArrowUpRight size={13} className="sm:w-4 sm:h-4" />
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-lg font-bold text-[#0A1F66] transition-colors group-hover:text-[#1E5BFF] line-clamp-1 sm:line-clamp-none">
                      {category.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-[11px] sm:text-sm text-slate-500 leading-tight sm:leading-relaxed">
                      {category.description || "Comprehensive enterprise business services and consulting support."}
                    </p>
                  </div>

                  {/* Bottom Row: Solution Count & Selected Badge */}
                  <div className="mt-2.5 sm:mt-6 pt-2 sm:pt-4 border-t border-slate-100 flex items-center justify-between gap-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50/80 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-[#1E5BFF]">
                      {category.services.length} Solutions
                    </span>

                    {selectedInCat > 0 ? (
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                        <Check size={11} strokeWidth={2.5} className="sm:w-3 sm:h-3" />
                        <span>{selectedInCat}</span>
                        <span className="hidden sm:inline">Selected</span>
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-400 group-hover:text-[#1E5BFF] transition-colors">
                        Select &rarr;
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center max-w-md mx-auto">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Search size={26} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No matching services found
              </h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Try searching for another term like &quot;GST&quot;, &quot;Legal&quot;, &quot;Marketing&quot;, or &quot;AI&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
