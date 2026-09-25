"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import { useRealtimeEvent, useRealtime } from "@/context/RealtimeContext";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  MapPin,
  Radio,
  Eye,
  Loader2,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

interface ListingItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  vendorId: { name: string; businessName?: string; email: string; phone?: string };
  categoryId: { name: string; slug: string };
  location: { city: string; area: string; address: string };
  pricing: { basePrice: number; currency: string; unit: string };
  capacity?: number;
  media: Array<{ mediaId: { secureUrl: string }; order: number }>;
  status: "draft" | "pending_review" | "approved" | "rejected";
  isLive: boolean;
  rejectionReason?: string;
  createdAt: string;
}

export default function AdminApprovalsPage() {
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { broadcastLocal } = useRealtime();

  // Reject Modal
  const [rejectModalItem, setRejectModalItem] = useState<ListingItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchPendingListings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await marketplaceApi.getAdminListings({ status: "pending_review" });
      setListings(data || []);
    } catch (err: any) {
      console.error("Failed to load approvals queue:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingListings();
  }, [fetchPendingListings]);

  // Debounced silent refetch for real-time events
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  useRealtimeEvent("listings", () => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      fetchPendingListings(true);
    }, 300);
  });

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await marketplaceApi.approveListing(id, { status: "approved" });
      // Optimistic: remove from pending list
      setListings((prev) => prev.filter((l) => l._id !== id));
      broadcastLocal("listings", "LISTING_STATUS_CHANGED", { listingId: id, status: "approved" });
      fetchPendingListings(true);
    } catch (err: any) {
      alert(err.message || "Failed to approve listing");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem) return;

    setProcessingId(rejectModalItem._id);
    try {
      await marketplaceApi.approveListing(rejectModalItem._id, {
        status: "rejected",
        rejectionReason: rejectionReason.trim() || "Listing details require revision",
      });
      // Optimistic: remove from pending list
      setListings((prev) => prev.filter((l) => l._id !== rejectModalItem._id));
      broadcastLocal("listings", "LISTING_STATUS_CHANGED", { listingId: rejectModalItem._id, status: "rejected" });
      setRejectModalItem(null);
      setRejectionReason("");
      fetchPendingListings(true);
    } catch (err: any) {
      alert(err.message || "Failed to reject listing");
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleLive = async (id: string, currentLive: boolean) => {
    // Optimistic toggle
    setListings((prev) =>
      prev.map((l) => (l._id === id ? { ...l, isLive: !currentLive } : l))
    );
    broadcastLocal("listings", "LISTING_STATUS_CHANGED", { listingId: id, isLive: !currentLive });
    setProcessingId(id);
    try {
      await marketplaceApi.toggleLiveListing(id, !currentLive);
      fetchPendingListings(true);
    } catch (err: any) {
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, isLive: currentLive } : l))
      );
      alert(err.message || "Failed to toggle live status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D99000] text-white uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" /> Verification Queue
          </span>
          <h2 className="text-2xl font-black tracking-tight">
            Coworking Approval & Verification
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Review submitted vendor workspaces, verify quality & photos, approve or return with revision notes.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl text-center">
          <span className="text-2xl font-black text-white">{listings.length}</span>
          <span className="block text-[10px] uppercase font-bold text-blue-200">
            Awaiting Review
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading verification queue...
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Queue is clear!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            No properties currently waiting for verification review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((item) => {
            const isBusy = processingId === item._id;
            const coverImage =
              item.media?.[0]?.mediaId?.secureUrl ||
              "https://images.unsplash.com/photo-1497366216548-37526070297c";

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between hover:border-slate-300 transition"
              >
                {/* Media & Details */}
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 shadow-xs">
                    <Image
                      src={coverImage}
                      alt={item.title}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {item.media?.length || 0} photos
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-[#1E5BFF]">
                        {item.categoryId?.name || "Workspace"}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Review
                      </span>
                      <span className="text-xs text-slate-400">
                        Submitted: {new Date(item.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.location.address}, {item.location.area}, {item.location.city.toUpperCase()}
                    </p>

                    <div className="text-xs text-slate-600 flex items-center gap-4 pt-1">
                      <span>
                        <strong>Partner:</strong> {item.vendorId?.businessName || item.vendorId?.name || "Unknown"}
                      </span>
                      <span>
                        <strong>Price:</strong> ₹{item.pricing?.basePrice?.toLocaleString("en-IN")}/{item.pricing?.unit?.replace("per-", "")}
                      </span>
                      <span>
                        <strong>Capacity:</strong> {item.capacity || 1} Seats
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Exclusive Live Toggle */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                  <button
                    disabled={isBusy}
                    onClick={() => setRejectModalItem(item)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>

                  <button
                    disabled={isBusy}
                    onClick={() => handleApprove(item._id)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
                  >
                    {isBusy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approve Space
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Reject Listing Submission
              </h3>
              <button
                onClick={() => setRejectModalItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-4">
              <p className="text-xs text-slate-600">
                Provide feedback to <strong>{rejectModalItem.vendorId?.name || "the vendor"}</strong> regarding what changes are needed before this listing can be approved.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Please upload higher resolution workspace photos and verify the street address number."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full text-xs p-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId === rejectModalItem._id}
                  className="px-5 py-2 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1.5"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
