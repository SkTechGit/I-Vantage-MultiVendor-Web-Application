"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { marketplaceApi } from "@/lib/marketplace.api";
import { useRealtimeEvent } from "@/context/RealtimeContext";
import {
  Building2,
  PlusCircle,
  Search,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Radio,
  MapPin,
  Sparkles,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface ListingItem {
  _id: string;
  title: string;
  slug: string;
  categoryId?: { name: string; slug: string };
  location: { city: string; area: string; address: string };
  pricing: { basePrice: number; currency: string; unit: string };
  capacity?: number;
  media: Array<{ mediaId: { secureUrl: string }; order: number }>;
  status: "draft" | "pending_review" | "approved" | "rejected";
  isLive: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export default function VendorListingsPage() {
  const searchParams = useSearchParams();
  const justCreated = searchParams.get("created") === "true";

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchListings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await marketplaceApi.getVendorListings();
      setListings(data || []);
    } catch (err: any) {
      console.warn("Vendor listings note:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Debounced silent refetch for real-time events
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  useRealtimeEvent("listings", () => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      fetchListings(true);
    }, 300);
  });

  const filtered = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.area.toLowerCase().includes(search.toLowerCase()) ||
      item.location.city.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "live") return matchesSearch && item.isLive;
    if (statusFilter === "pending") return matchesSearch && item.status === "pending_review";
    if (statusFilter === "approved") return matchesSearch && item.status === "approved" && !item.isLive;
    if (statusFilter === "rejected") return matchesSearch && item.status === "rejected";
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Alert if just created */}
      {justCreated && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-sm shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold">Property submitted successfully!</p>
              <p className="text-xs text-emerald-700">
                Your listing is now in the SuperAdmin verification queue as <strong>Pending Review</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0A1F66]">
            My Workspace Listings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your coworking inventory, view live statuses, and edit center specifications.
          </p>
        </div>

        <Link
          href="/vendor/listings/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E5BFF] text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add New Property
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings by title, city, area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: "all", label: "All Properties" },
            { id: "live", label: "Live Online" },
            { id: "pending", label: "Pending Review" },
            { id: "approved", label: "Approved (Offline)" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? "bg-[#0A1F66] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Table / Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading your workspaces...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1E5BFF] flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No properties found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filters."
              : "You haven't listed any coworking spaces yet. Create your first property to start receiving enquiries."}
          </p>
          <Link
            href="/vendor/listings/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A1F66] text-white text-xs font-bold"
          >
            <PlusCircle className="w-4 h-4" /> Create First Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const coverImage =
              item.media?.[0]?.mediaId?.secureUrl ||
              "https://images.unsplash.com/photo-1497366216548-37526070297c";

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Status Badge */}
                  <div className="relative aspect-video w-full bg-slate-100">
                    <Image
                      src={coverImage}
                      alt={item.title}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />

                    {/* Status Pill */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {item.isLive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-md">
                          <Radio className="w-3 h-3 animate-pulse" /> LIVE ONLINE
                        </span>
                      ) : item.status === "pending_review" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500 text-white shadow-md">
                          <Clock className="w-3 h-3" /> PENDING REVIEW
                        </span>
                      ) : item.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-600 text-white shadow-md">
                          <CheckCircle className="w-3 h-3" /> APPROVED (OFFLINE)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-600 text-white shadow-md">
                          <XCircle className="w-3 h-3" /> REJECTED
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    {item.categoryId?.name && (
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {item.categoryId.name}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1 hover:text-[#1E5BFF] transition">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">
                        {item.location.area}, {item.location.city.toUpperCase()}
                      </span>
                    </p>

                    {item.rejectionReason && item.status === "rejected" && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[11px]">
                        <strong>Feedback:</strong> {item.rejectionReason}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                          Starting At
                        </span>
                        <span className="text-base font-extrabold text-[#0A1F66]">
                          ₹{item.pricing?.basePrice?.toLocaleString("en-IN")}{" "}
                          <span className="text-xs font-medium text-slate-500">
                            /{item.pricing?.unit?.replace("per-", "")}
                          </span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                          Capacity
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {item.capacity || 1} Seats
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions (CRU Only - NO DELETE HANDLER FOR VENDOR) */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/vendor/listings/${item._id}/edit`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5BFF] hover:underline"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Property
                  </Link>

                  {item.isLive && (
                    <Link
                      href={`/${item.location.city}/${item.categoryId?.slug || "space"}/${item.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
                    >
                      <ExternalLink className="w-3 h-3" /> View Public Page
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
