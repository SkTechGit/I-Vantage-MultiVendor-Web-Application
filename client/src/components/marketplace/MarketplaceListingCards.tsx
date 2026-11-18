"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Building2,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Camera,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import ListingEnquiryModal, {
  EnquiryListingTarget,
} from "./ListingEnquiryModal";

export const inferServiceUnit = (name = "", categoryName = "", fallback = "month") => {
  const lower = String(name || "").toLowerCase();
  if (lower.includes("hourly") || lower.includes("per-hour") || lower.includes("/hour") || lower.includes("/hr")) {
    return "hour";
  }
  if (
    lower.includes("full-day") ||
    lower.includes("full day") ||
    lower.includes("meeting room day") ||
    lower.includes("day pass") ||
    lower.includes("daypass") ||
    lower.includes("day paas") ||
    lower.includes("daily") ||
    lower.includes("per-day") ||
    lower.includes("/day")
  ) {
    return "day";
  }
  if (lower.includes("per-year") || lower.includes("yearly") || lower.includes("annual") || lower.includes("/year") || lower.includes("/yr")) {
    return "year";
  }
  if (lower.includes("per-month") || lower.includes("monthly") || lower.includes("/month")) {
    return "month";
  }

  // 1. Meeting Room -> per hour
  if (lower.includes("meeting")) return "hour";
  // 2. Conference Room -> per hour
  if (lower.includes("conference") || lower.includes("confference") || lower.includes("boardroom")) return "hour";
  // 3. Day Pass -> per day
  if (lower.includes("day pass") || lower.includes("daypass") || lower.includes("day paas") || lower.includes("day")) return "day";
  // 4. Event Pass -> per day
  if (lower.includes("event")) return "day";
  // 5. Coworking Price -> per month
  if (lower.includes("coworking") || lower.includes("hot desk") || lower.includes("flexi desk") || lower.includes("open desk")) return "month";
  // 6. Dedicated Seat / Desk -> per month
  if (lower.includes("dedicated") || lower.includes("fixed")) return "month";
  // 7. Virtual Office -> per month (or year if specified)
  if (lower.includes("virtual office") || lower.includes("virtual")) {
    if (lower.includes("annual") || lower.includes("year")) return "year";
    return "month";
  }
  // 8. Private Cabin -> per month
  if (lower.includes("cabin") || lower.includes("office") || lower.includes("suite")) return "month";

  const catLower = String(categoryName || "").toLowerCase();
  if (catLower.includes("meeting")) return "hour";
  if (catLower.includes("conference") || catLower.includes("confference")) return "hour";
  if (catLower.includes("day pass") || catLower.includes("daypass")) return "day";
  if (catLower.includes("event")) return "day";
  if (catLower.includes("virtual")) return "month";
  if (catLower.includes("coworking") || catLower.includes("desk") || catLower.includes("cabin")) return "month";

  return fallback;
};

export interface MarketplaceListingItem {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  categoryId?: { name?: string; slug?: string };
  location?: { area?: string; address?: string };
  pricing?: { basePrice?: number; unit?: string };
  capacity?: number;
  media?: Array<{ mediaId?: { secureUrl?: string } }>;
  vendorId?: { businessName?: string };
}

interface Props {
  listings: MarketplaceListingItem[];
  cityName: string;
  normalizedCity: string;
  effectiveTotal: number;
  areaFilter?: string;
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

export default function MarketplaceListingCards({
  listings,
  cityName,
  normalizedCity,
  effectiveTotal,
  areaFilter,
  page,
  totalPages,
  basePath,
  searchParams,
}: Props) {
  const [enquiryTarget, setEnquiryTarget] = useState<EnquiryListingTarget | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    (searchParams?.search || searchParams?.q || "").trim()
  );

  const popularKeywords = [
    { label: "Founder Quest", icon: "⚡" },
    { label: "Saket", icon: "📍" },
    { label: "Get Set Office", icon: "🏢" },
    { label: "Green Park", icon: "📍" },
    { label: "Sector 38", icon: "📍" },
    { label: "Private Cabin", icon: "💼" },
    { label: "Conference Room", icon: "👥" },
    { label: "Day Pass", icon: "🎟️" },
  ];

  // Instant real-time search across all listing attributes
  const filteredListings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return listings;
    return listings.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const area = item.location?.area?.toLowerCase() || "";
      const address = item.location?.address?.toLowerCase() || "";
      const cat = item.categoryId?.name?.toLowerCase() || "";
      const vendor = item.vendorId?.businessName?.toLowerCase() || "";
      const desc = item.description?.toLowerCase() || "";
      return (
        title.includes(q) ||
        area.includes(q) ||
        address.includes(q) ||
        cat.includes(q) ||
        vendor.includes(q) ||
        desc.includes(q)
      );
    });
  }, [listings, searchQuery]);

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (searchParams) {
      Object.entries(searchParams).forEach(([k, v]) => {
        if (v && k !== "page") {
          params.set(k, String(v));
        }
      });
    }
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex-1 w-full space-y-5">
      {/* Ultra-Premium Interactive Search Bar (Admin-grade instant text search filter) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1E5BFF]/40 transition-all duration-300 p-4 sm:p-5 space-y-3">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#1E5BFF]">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workspaces by name, brand, location, metro, or desk type (e.g., Founder Quest, Saket, Private Cabin)..."
            className="w-full pl-11 pr-28 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 bg-slate-50/80 hover:bg-slate-50 focus:bg-white rounded-xl outline-none border border-slate-200 focus:border-[#1E5BFF] focus:ring-3 focus:ring-[#1E5BFF]/15 transition-all shadow-2xs"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-[#0A1F66] text-white shadow-xs whitespace-nowrap">
              {filteredListings.length} {filteredListings.length === 1 ? "Space" : "Spaces"}
            </span>
          </div>
        </div>

        {/* Quick Filter Recommendation Badges */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D99000]" /> Popular:
          </span>
          {popularKeywords.map((item) => {
            const isActive = searchQuery.toLowerCase().trim() === item.label.toLowerCase();
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setSearchQuery(isActive ? "" : item.label)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  isActive
                    ? "bg-[#1E5BFF] text-white shadow-2xs font-bold"
                    : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1E5BFF] border border-transparent hover:border-blue-200"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-lg font-black text-[#0A1F66]">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : areaFilter
              ? `${areaFilter}, ${cityName}`
              : `Workspaces in ${cityName}`}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredListings.length} of {effectiveTotal} verified coworking spaces
            {searchQuery && (
              <span className="ml-1.5 font-medium text-slate-600">
                (filtered from total {listings.length})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition"
            >
              <X className="w-3.5 h-3.5" /> Clear Search
            </button>
          )}
          {areaFilter && (
            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
              <MapPin className="w-3.5 h-3.5" /> Location: {areaFilter}
            </span>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            {searchQuery ? `No workspaces found matching "${searchQuery}"` : "No spaces found matching your criteria"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? "Try searching by another area (e.g. Saket, Green Park, Cyber City), desk type, or brand name."
              : "Try adjusting your budget or clearing location filters to view more coworking options."}
          </p>
          <div className="pt-2">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-blue-900 transition shadow-sm"
              >
                <X className="w-4 h-4" /> Clear Search Query
              </button>
            ) : (
              <Link
                href={`/${normalizedCity}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-blue-900 transition"
              >
                Clear All Filters
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Spaces Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((item, idx) => {
            const rawMedia = (item.media || [])
              .map((m: any) => m?.mediaId?.secureUrl || m?.secureUrl || m?.url || "")
              .filter(Boolean);
            const photoCount = rawMedia.length;
            const coverImg =
              rawMedia[0] ||
              item.media?.[0]?.mediaId?.secureUrl ||
              "/images/workspace/conf3.webp";
            const catSlug = item.categoryId?.slug || "spaces";
            const detailUrl = `/${normalizedCity}/${catSlug}/${item.slug || item._id}`;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-[0_20px_40px_rgba(10,31,102,0.12)] hover:border-[#1E5BFF]/50 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Thumbnail with clean slate background */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={coverImg}
                      alt={item.title}
                      fill
                      priority={idx < 2}
                      loading={idx < 2 ? "eager" : "lazy"}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out z-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 transition-opacity duration-300 group-hover:opacity-90 z-1 pointer-events-none" />

                    {/* Category Floating Pill Badge */}
                    <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs text-[#0A1F66] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slate-200/60 shrink-0 whitespace-nowrap">
                      {item.categoryId?.name || "Workspace"}
                    </div>

                    {/* Verified Partner Badge */}
                    <div className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm shrink-0 whitespace-nowrap">
                      <ShieldCheck className="w-3 h-3 shrink-0" /> Verified
                    </div>

                    {/* Dynamic Base Price Badge */}
                    <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs text-[#0A1F66] text-xs font-black px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/60">
                      ₹{item.pricing?.basePrice?.toLocaleString("en-IN")}{" "}
                      <span className="text-[10px] font-medium text-slate-500">
                        /{item.pricing?.unit?.replace("per-", "") || inferServiceUnit(item.title, item.categoryId?.name, "month")}
                      </span>
                    </div>

                    {/* Dynamic Photo Count Badge */}
                    {photoCount > 0 && (
                      <div className="absolute bottom-3 right-3 z-10 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <Camera className="w-3 h-3 text-white" />
                        <span>
                          {photoCount} {photoCount === 1 ? "Photo" : "Photos"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2">
                    {/* Category Badge In Details Body */}
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A1F66] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 shrink-0 whitespace-nowrap">
                        <Building2 className="w-3 h-3 text-[#1E5BFF] shrink-0" />
                        <span className="whitespace-nowrap">{item.categoryId?.name || "Coworking Space"}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-[#1E5BFF] transition-colors duration-300">
                      <Link href={detailUrl}>{item.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
                      <span className="truncate">
                        {item.location?.area || "Gurugram"}, {cityName}
                      </span>
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description?.replace(/[*#_~`]/g, "").trim() || "Executive managed workspace equipped with state-of-the-art infrastructure."}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-semibold">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {item.capacity || 1} {item.capacity === 1 ? "Seat" : "Seats"}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Zero Brokerage
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer: View Details & Instant Enquiry Modal Trigger */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    href={detailUrl}
                    className="group/link text-xs font-bold text-[#1E5BFF] hover:text-[#0A1F66] flex items-center gap-1 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setEnquiryTarget({
                        id: item._id,
                        title: item.title,
                        category: item.categoryId?.name,
                        area: item.location?.area,
                        city: cityName,
                        price: item.pricing?.basePrice,
                        unit: item.pricing?.unit,
                        vendorName: item.vendorId?.businessName,
                      })
                    }
                    className="luxury-btn px-4 py-2 bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] hover:brightness-110 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Numbered Pagination Bar */}
      {totalPages > 1 && !searchQuery && (
        <div className="pt-8 flex flex-col items-center gap-4">
          {/* Page Info */}
          <p className="text-xs text-slate-500 font-medium">
            Page <span className="font-bold text-slate-800">{page}</span> of{" "}
            <span className="font-bold text-slate-800">{totalPages}</span>
            {" · "}showing <span className="font-bold text-slate-800">{listings.length}</span> of{" "}
            <span className="font-bold text-slate-800">{effectiveTotal}</span> spaces
          </p>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Previous */}
            {page > 1 ? (
              <Link
                href={buildPageUrl(page - 1)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-[#0A1F66] hover:text-white hover:border-[#0A1F66] text-xs font-bold flex items-center gap-1 shadow-2xs transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Link>
            ) : (
              <span className="px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-not-allowed select-none">
                <ChevronLeft className="w-4 h-4" /> Previous
              </span>
            )}

            {/* Smart Page Numbers with Ellipsis */}
            {(() => {
              const delta = 2; // pages to show around current
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
                  <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-xs text-slate-400 select-none">
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={buildPageUrl(p)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      page === p
                        ? "bg-[#0A1F66] text-white shadow-md shadow-blue-900/20 scale-105"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-[#0A1F66] hover:text-white hover:border-[#0A1F66] shadow-2xs"
                    }`}
                  >
                    {p}
                  </Link>
                )
              );
            })()}

            {/* Next */}
            {page < totalPages ? (
              <Link
                href={buildPageUrl(page + 1)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-[#0A1F66] hover:text-white hover:border-[#0A1F66] text-xs font-bold flex items-center gap-1 shadow-2xs transition-all duration-200"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-not-allowed select-none">
                Next <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Instant Enquiry Modal without leaving page */}
      <ListingEnquiryModal
        isOpen={!!enquiryTarget}
        onClose={() => setEnquiryTarget(null)}
        listing={enquiryTarget}
      />
    </div>
  );
}
