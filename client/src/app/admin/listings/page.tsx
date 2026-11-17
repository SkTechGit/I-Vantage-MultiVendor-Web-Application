"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { marketplaceApi } from "@/lib/marketplace.api";
import { useRealtimeEvent, useRealtime } from "@/context/RealtimeContext";
import {
  Building2,
  Radio,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  PlusCircle,
  Search,
  MapPin,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Filter,
  X,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

interface ListingItem {
  _id: string;
  title: string;
  slug: string;
  vendorId: { _id: string; name: string; businessName?: string; email: string };
  categoryId: { name: string; slug: string };
  location: { city: string; area: string; address: string };
  pricing: { basePrice: number; currency: string; unit: string };
  capacity?: number;
  media: Array<{ mediaId: { secureUrl: string }; order: number }>;
  status: "draft" | "pending_review" | "approved" | "rejected";
  isLive: boolean;
  createdAt: string;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { broadcastLocal } = useRealtime();

  const fetchAllListings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await marketplaceApi.getAdminListings();
      setListings(data || []);
    } catch (err: any) {
      console.error("Failed to load admin listings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    marketplaceApi.getAdminListings()
      .then((data) => {
        if (!ignore) setListings(data || []);
      })
      .catch((err: unknown) => {
        if (!ignore) {
          console.error("Failed to load admin listings:", err);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Debounced silent refetch for real-time events (prevents 2-3x redundant calls)
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  useRealtimeEvent("listings", () => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      fetchAllListings(true);
    }, 300);
  });

  const handleToggleLive = async (id: string, currentLive: boolean, status: string) => {
    if (!currentLive && status !== "approved") {
      alert("Only approved listings can be toggled LIVE. Please approve this property first.");
      return;
    }

    // Optimistic UI: flip toggle instantly before server responds
    setListings((prev) =>
      prev.map((l) => (l._id === id ? { ...l, isLive: !currentLive } : l))
    );
    // Instant 0ms local broadcast across all other open tabs on this device
    broadcastLocal("listings", "LISTING_STATUS_CHANGED", {
      listingId: id,
      isLive: !currentLive,
    });
    setTogglingId(id);
    try {
      await marketplaceApi.toggleLiveListing(id, !currentLive);
      // Silent background sync to get authoritative server state
      fetchAllListings(true);
    } catch (err: any) {
      // Revert optimistic update on failure
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isLive: currentLive } : l))
      );
      alert(err.message || "Failed to toggle live status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This action is exclusive to SuperAdmin.`)) {
      return;
    }

    // Optimistic: remove from list immediately
    setListings((prev) => prev.filter((l) => l._id !== id));
    broadcastLocal("listings", "LISTING_DELETED", { listingId: id });
    try {
      await marketplaceApi.deleteAdminListing(id);
      fetchAllListings(true);
    } catch (err: any) {
      alert(err.message || "Failed to delete listing");
      fetchAllListings(true);
    }
  };

  const counts = useMemo(() => {
    return {
      all: listings.length,
      live: listings.filter((l) => l.isLive).length,
      pending: listings.filter((l) => l.status === "pending_review").length,
      approved: listings.filter((l) => l.status === "approved").length,
      rejected: listings.filter((l) => l.status === "rejected").length,
    };
  }, [listings]);

  const adminQuickTags = [
    { label: "Founder Quest", icon: "⚡" },
    { label: "Get Set Office", icon: "🏢" },
    { label: "REEON SPACES", icon: "🏢" },
    { label: "Saket", icon: "📍" },
    { label: "Green Park", icon: "📍" },
    { label: "Gurugram", icon: "📍" },
    { label: "Delhi", icon: "📍" },
    { label: "Noida", icon: "📍" },
  ];

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return listings.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const vendorName = item.vendorId?.name?.toLowerCase() || "";
      const vendorBiz = item.vendorId?.businessName?.toLowerCase() || "";
      const vendorEmail = item.vendorId?.email?.toLowerCase() || "";
      const city = item.location?.city?.toLowerCase() || "";
      const area = item.location?.area?.toLowerCase() || "";
      const address = item.location?.address?.toLowerCase() || "";
      const category = item.categoryId?.name?.toLowerCase() || "";

      const matchesSearch =
        !term ||
        title.includes(term) ||
        vendorName.includes(term) ||
        vendorBiz.includes(term) ||
        vendorEmail.includes(term) ||
        city.includes(term) ||
        area.includes(term) ||
        address.includes(term) ||
        category.includes(term);

      if (!matchesSearch) return false;
      if (statusFilter === "all") return true;
      if (statusFilter === "live") return item.isLive;
      if (statusFilter === "pending") return item.status === "pending_review";
      if (statusFilter === "approved") return item.status === "approved";
      if (statusFilter === "rejected") return item.status === "rejected";
      return true;
    });
  }, [listings, search, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-[#0A1F66]">
              All Coworking Properties (Cross-Vendor)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1E5BFF] border border-blue-200">
              {listings.length} Total Spaces
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            SuperAdmin central database of all partner spaces across all cities with full CRUD & live toggle permissions.
          </p>
        </div>

        <Link
          href="/admin/approvals"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D99000] text-white text-xs font-bold hover:brightness-110 transition shadow-sm self-start sm:self-auto"
        >
          <Clock className="w-4 h-4" /> Review Queue ({counts.pending})
        </Link>
      </div>

      {/* Ultra-Premium Search and Filter Control Center */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xs border border-slate-200/90 space-y-3.5">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#1E5BFF]" />
            <input
              type="text"
              placeholder="Search by property title, vendor name, email, city, area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-24 py-2.5 sm:py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E5BFF] focus:border-[#1E5BFF] transition-all bg-slate-50/70 focus:bg-white font-medium"
            />
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#0A1F66] text-white">
                {filtered.length} found
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
            {[
              { id: "all", label: "All Properties", count: counts.all },
              { id: "live", label: "Live Online", count: counts.live },
              { id: "pending", label: "Pending Review", count: counts.pending },
              { id: "approved", label: "Approved", count: counts.approved },
              { id: "rejected", label: "Rejected", count: counts.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-[#0A1F66] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 border border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    statusFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filter Tag Chips */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2.5 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D99000]" /> Quick Search:
          </span>
          {adminQuickTags.map((item) => {
            const isActive = search.toLowerCase().trim() === item.label.toLowerCase();
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setSearch(isActive ? "" : item.label)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  isActive
                    ? "bg-[#1E5BFF] text-white font-bold"
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

      {/* Listings Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading marketplace properties...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">No properties found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="p-4">Property & Photos</th>
                  <th className="p-4">Vendor / Brand</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price & Pax</th>
                  <th className="p-4">Review Status</th>
                  <th className="p-4 text-center">Live Toggle</th>
                  <th className="p-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((item) => {
                  const coverImage =
                    item.media?.[0]?.mediaId?.secureUrl ||
                    "https://images.unsplash.com/photo-1497366216548-37526070297c";
                  const isToggling = togglingId === item._id;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border">
                            <Image
                              src={coverImage}
                              alt={item.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-sm line-clamp-1">
                              {item.title}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] bg-blue-50 text-[#1E5BFF] px-1.5 py-0.5 rounded font-semibold">
                                {item.categoryId?.name || "Space"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                • {item.media?.length || 0} {item.media?.length === 1 ? "photo" : "photos"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="truncate max-w-[220px]" title={item.vendorId?.businessName || item.vendorId?.name || "Verified Coworking Partner"}>
                            {item.vendorId?.businessName || item.vendorId?.name || "Verified Coworking Partner"}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {item.vendorId?.email || "Coworking Partner"}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 text-slate-800">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.location.area}, {item.location.city.toUpperCase()}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {item.location.address}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-[#0A1F66]">
                          ₹{item.pricing?.basePrice?.toLocaleString("en-IN")}/{item.pricing?.unit?.replace("per-", "")}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.capacity || 1} Seats
                        </div>
                      </td>

                      <td className="p-4">
                        {item.status === "approved" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                            Approved
                          </span>
                        ) : item.status === "pending_review" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700">
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* DEDICATED LIVE TOGGLE SWITCH (Rule 2) */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={() => handleToggleLive(item._id, item.isLive, item.status)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            item.isLive ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.isLive ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="block text-[10px] font-semibold text-slate-400 mt-1">
                          {item.isLive ? "LIVE" : "OFFLINE"}
                        </span>
                      </td>

                      {/* SuperAdmin Full CRUD Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {item.isLive && (
                            <Link
                              href={`/${item.location.city}/${item.categoryId?.slug || "space"}/${item.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                              title="View Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            href={`/vendor/listings/${item._id}/edit`}
                            className="p-1.5 text-slate-400 hover:text-[#1E5BFF] hover:bg-blue-50 rounded-lg"
                            title="Edit Listing (Stays Live)"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id, item.title)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Exclusive Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
