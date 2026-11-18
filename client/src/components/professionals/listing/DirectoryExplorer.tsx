"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfessionalCard from "./ProfessionalCard";
import CardSkeleton from "./CardSkeleton";
import EmptyState from "./EmptyState";
import FilterBar, { FilterState } from "./FilterBar";
import { professionalsApi, ProfessionalProfileItem, ProfessionalCategoryItem } from "@/lib/professionals.api";
import { Users, Sparkles, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  initialProfessionals: ProfessionalProfileItem[];
  initialTotal: number;
  categories: ProfessionalCategoryItem[];
  facets?: any;
  defaultCategorySlug?: string;
  defaultCity?: string;
  initialPage?: number;
}

export default function DirectoryExplorer({
  initialProfessionals,
  initialTotal,
  categories,
  facets,
  defaultCategorySlug = "",
  defaultCity = "",
  initialPage = 1,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    q: searchParams.get("q") || "",
    category: defaultCategorySlug || searchParams.get("category") || "",
    city: searchParams.get("city") || defaultCity || "",
    mode: searchParams.get("mode") || "",
    sort: searchParams.get("sort") || "recommended",
  });

  const [professionals, setProfessionals] = useState<ProfessionalProfileItem[]>(initialProfessionals);
  const [total, setTotal] = useState<number>(initialTotal);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(() => {
    const urlPage = searchParams.get("page");
    return urlPage ? Math.max(1, parseInt(urlPage, 10)) : initialPage;
  });
  const limit = 12;

  // Available cities from facets or fallback
  const availableCities = facets?.cities?.length
    ? facets.cities
    : ["Gurugram", "Delhi", "Noida", "Bengaluru", "Mumbai"];

  const fetchResults = useCallback(async (currentFilters: FilterState, targetPage = 1) => {
    setIsLoading(true);
    try {
      const res = await professionalsApi.list({
        q: currentFilters.q || undefined,
        category: currentFilters.category || undefined,
        city: currentFilters.city || undefined,
        mode: currentFilters.mode || undefined,
        sort: currentFilters.sort || undefined,
        page: targetPage,
        limit,
      });

      if (res && res.data) {
        setProfessionals(res.data);
        const resolvedTotal = res.meta?.total ?? res.total ?? res.data.length;
        setTotal(resolvedTotal);
        setPage(targetPage);
      }
    } catch (err) {
      console.error("Failed to load professionals:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle filter changes (resets to page 1)
  const handleFilterChange = (nextFilters: FilterState) => {
    setFilters(nextFilters);
    setPage(1);
    fetchResults(nextFilters, 1);

    // Update query params in URL without full reload
    const params = new URLSearchParams();
    if (nextFilters.q) params.set("q", nextFilters.q);
    if (nextFilters.category) params.set("category", nextFilters.category);
    if (nextFilters.city) params.set("city", nextFilters.city);
    if (nextFilters.mode) params.set("mode", nextFilters.mode);
    if (nextFilters.sort && nextFilters.sort !== "recommended") params.set("sort", nextFilters.sort);

    const queryStr = params.toString();
    const newPath = queryStr ? `?${queryStr}` : window.location.pathname;
    window.history.replaceState(null, "", newPath);
  };

  const handlePageChange = (targetPage: number) => {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    if (targetPage < 1 || targetPage > totalPages || targetPage === page) return;

    fetchResults(filters, targetPage);

    // Update query params in URL without full reload
    const params = new URLSearchParams(window.location.search);
    if (targetPage > 1) {
      params.set("page", String(targetPage));
    } else {
      params.delete("page");
    }

    const queryStr = params.toString();
    const newPath = queryStr ? `?${queryStr}` : window.location.pathname;
    window.history.replaceState(null, "", newPath);

    // Scroll smoothly to results container
    const el = document.getElementById("directory-results-container");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleReset = () => {
    handleFilterChange({
      q: "",
      category: "",
      city: "",
      mode: "",
      sort: "recommended",
    });
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="space-y-8">
      {/* Interactive Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-sm">
        <FilterBar
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
          availableCities={availableCities}
          totalResults={total}
        />
      </div>

      {/* Results Header */}
      <div
        id="directory-results-container"
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 scroll-mt-24"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-slate-500">Showing</span>
          <span className="text-sm font-black text-[#0A1F66]">
            {total} Verified {total === 1 ? "Professional" : "Professionals"}
          </span>
          {totalPages > 1 && (
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
              Page {page} of {totalPages}
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center text-xs font-semibold text-[#1E5BFF] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              {categories.find((c) => c.slug === filters.category)?.label || filters.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ICAI / Bar Council / Statutory &amp; HR Verified Profiles</span>
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : professionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((pro) => (
            <ProfessionalCard key={pro._id} professional={pro} />
          ))}
        </div>
      ) : (
        <EmptyState onReset={handleReset} />
      )}

      {/* Numbered Pagination Bar */}
      {!isLoading && totalPages > 1 && (
        <div className="pt-6 flex flex-col items-center gap-4">
          {/* Page Info */}
          <p className="text-xs text-slate-500 font-medium">
            Page <span className="font-bold text-slate-800">{page}</span> of{" "}
            <span className="font-bold text-slate-800">{totalPages}</span>
            {" · "}showing <span className="font-bold text-slate-800">{startItem}–{endItem}</span> of{" "}
            <span className="font-bold text-slate-800">{total}</span> verified professionals
          </p>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Previous */}
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all duration-200 ${
                page > 1 && !isLoading
                  ? "border-slate-200 bg-white text-slate-700 hover:bg-[#0A1F66] hover:text-white hover:border-[#0A1F66] shadow-2xs cursor-pointer active:scale-95"
                  : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed select-none"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {/* Smart Numbered Pages with Ellipsis */}
            {(() => {
              const delta = 2;
              const pages: (number | "...")[] = [];
              const addPage = (n: number) => {
                if (!pages.includes(n)) pages.push(n);
              };

              addPage(1);
              for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
                addPage(i);
              }
              if (totalPages > 1) addPage(totalPages);

              const result: (number | "...")[] = [];
              let prev: number | "..." | null = null;
              for (const p of pages) {
                if (prev !== null && typeof p === "number" && typeof prev === "number" && p - prev > 1) {
                  result.push("...");
                }
                result.push(p);
                prev = p;
              }

              return result.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-9 h-9 flex items-center justify-center text-xs text-slate-400 select-none"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    disabled={isLoading}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 cursor-pointer ${
                      page === p
                        ? "bg-[#0A1F66] text-white shadow-md shadow-blue-900/20 scale-105"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-[#0A1F66] hover:text-white hover:border-[#0A1F66] shadow-2xs active:scale-95"
                    }`}
                  >
                    {p}
                  </button>
                )
              );
            })()}

            {/* Next */}
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all duration-200 ${
                page < totalPages && !isLoading
                  ? "border-slate-200 bg-white text-slate-700 hover:bg-[#0A1F66] hover:text-white hover:border-[#0A1F66] shadow-2xs cursor-pointer active:scale-95"
                  : "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed select-none"
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Join the Network Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A1F66] via-[#0E2A8C] to-[#1E5BFF] p-6 sm:p-10 text-white shadow-xl mt-16">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C8942C] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              For CAs, Lawyers, Tax &amp; HR Professionals
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Are you an authorized business or corporate advisor?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Expand your advisory practice, receive direct qualified client enquiries, and host your consultations in premium I-Vantage boardrooms across India.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/contact?intent=join_professionals_network"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-black text-[#0A1F66] shadow-md hover:bg-slate-50 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>Apply for Verified Listing</span>
              <ArrowRight className="w-4 h-4 text-[#1E5BFF]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
