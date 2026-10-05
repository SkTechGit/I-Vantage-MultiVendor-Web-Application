"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import ListingEnquiryModal, {
  EnquiryListingTarget,
} from "./ListingEnquiryModal";

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
    <div className="flex-1 w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-lg font-black text-[#0A1F66]">
            {areaFilter ? `${areaFilter}, ${cityName}` : `Workspaces in ${cityName}`}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {listings.length} of {effectiveTotal} verified coworking spaces
          </p>
        </div>

        {areaFilter && (
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
            <MapPin className="w-3.5 h-3.5" /> Location: {areaFilter}
          </span>
        )}
      </div>

      {/* Empty State */}
      {listings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            No spaces found matching your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your budget or clearing location filters to view more coworking options.
          </p>
          <div className="pt-3">
            <Link
              href={`/${normalizedCity}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-blue-900 transition"
            >
              Clear All Filters
            </Link>
          </div>
        </div>
      ) : (
        /* Spaces Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((item) => {
            const coverImg =
              item.media?.[0]?.mediaId?.secureUrl ||
              "/images/workspace/conf3.webp";
            const catSlug = item.categoryId?.slug || "spaces";
            const detailUrl = `/${normalizedCity}/${catSlug}/${item.slug || item._id}`;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={coverImg}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#0A1F66] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                      {item.categoryId?.name || "Workspace"}
                    </div>

                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </div>

                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-[#0A1F66] text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                      ₹{item.pricing?.basePrice?.toLocaleString("en-IN")}{" "}
                      <span className="text-[10px] font-medium text-slate-500">
                        /{item.pricing?.unit?.replace("per-", "") || "month"}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-[#1E5BFF] transition">
                      <Link href={detailUrl}>{item.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
                      <span className="truncate">
                        {item.location?.area || "Gurugram"}, {cityName}
                      </span>
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description || "Executive managed workspace equipped with state-of-the-art infrastructure."}
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
                    className="text-xs font-bold text-[#1E5BFF] hover:underline flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
                    className="px-4 py-2 bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] hover:brightness-110 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-xs"
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
      {totalPages > 1 && (
        <div className="pt-8 flex items-center justify-center gap-2">
          {/* Previous */}
          {page > 1 ? (
            <Link
              href={buildPageUrl(page - 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Link>
          ) : (
            <span className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Previous
            </span>
          )}

          {/* Numbered Pages */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={buildPageUrl(p)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                page === p
                  ? "bg-[#0A1F66] text-white shadow-md shadow-blue-900/20"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
              }`}
            >
              {p}
            </Link>
          ))}

          {/* Next */}
          {page < totalPages ? (
            <Link
              href={buildPageUrl(page + 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-not-allowed">
              Next <ChevronRight className="w-4 h-4" />
            </span>
          )}
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
