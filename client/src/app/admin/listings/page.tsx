"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
    fetchAllListings();
  }, [fetchAllListings]);

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

  const filtered = listings.filter((item) => {
    const term = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(term) ||
      item.vendorId?.name?.toLowerCase().includes(term) ||
      item.vendorId?.businessName?.toLowerCase().includes(term) ||
      item.location?.city?.toLowerCase().includes(term) ||
      item.location?.area?.toLowerCase().includes(term);

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "live") return matchesSearch && item.isLive;
    if (statusFilter === "pending") return matchesSearch && item.status === "pending_review";
    if (statusFilter === "approved") return matchesSearch && item.status === "approved";
    if (statusFilter === "rejected") return matchesSearch && item.status === "rejected";
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0A1F66]">
            All Coworking Properties (Cross-Vendor)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            SuperAdmin central database of all partner spaces across all cities with full CRUD & live toggle permissions.
          </p>
        </div>

        <Link
          href="/admin/approvals"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D99000] text-white text-xs font-bold hover:brightness-110 transition shadow-sm self-start sm:self-auto"
        >
          <Clock className="w-4 h-4" /> Review Queue ({listings.filter((l) => l.status === "pending_review").length})
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by property, vendor, city, area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-[#1E5BFF]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: "all", label: "All Properties" },
            { id: "live", label: "Live Online" },
            { id: "pending", label: "Pending Review" },
            { id: "approved", label: "Approved" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? "bg-[#0A1F66] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
                            <span className="text-[10px] bg-blue-50 text-[#1E5BFF] px-1.5 py-0.5 rounded font-semibold">
                              {item.categoryId?.name || "Space"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900">
                          {item.vendorId?.businessName || item.vendorId?.name || "Unknown Vendor"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.vendorId?.email}
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
