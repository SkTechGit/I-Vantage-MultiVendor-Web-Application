"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { marketplaceApi } from "@/lib/marketplace.api";
import { useRealtimeEvent } from "@/context/RealtimeContext";
import {
  Building2,
  PlusCircle,
  Users,
  Radio,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  Phone,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function VendorDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await marketplaceApi.getVendorAnalytics();
      if (data) {
        setStats(data.stats);
        setRecentListings(data.recentListings || []);
      }
    } catch (err: any) {
      console.warn("Vendor analytics note:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    marketplaceApi.getVendorAnalytics()
      .then((data) => {
        if (!ignore && data) {
          setStats(data.stats);
          setRecentListings(data.recentListings || []);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn("Vendor analytics note:", msg);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Debounced silent refetch for real-time events
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const silentRefresh = useCallback(() => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      fetchAnalytics();
    }, 500);
  }, [fetchAnalytics]);

  useRealtimeEvent("listings", silentRefresh);
  useRealtimeEvent("leads", silentRefresh);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0A1F66] via-[#1E5BFF] to-blue-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D99000] text-white">
            <Sparkles className="w-3.5 h-3.5" /> Workspace Partner Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome to Your Partner Center
          </h2>
          <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
            Monitor real-time coworking inventory status, manage verified listings, and track your commercial spaces across the marketplace.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/vendor/listings/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#0A1F66] text-xs font-extrabold hover:bg-blue-50 transition shadow-md"
          >
            <PlusCircle className="w-4 h-4 text-[#1E5BFF]" /> Add New Property
          </Link>
          <Link
            href="/vendor/listings"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20"
          >
            <Building2 className="w-4 h-4" /> View My Listings
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading workspace metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Properties
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E5BFF] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalListings || 0}
            </div>
            <Link
              href="/vendor/listings"
              className="text-xs font-semibold text-[#1E5BFF] hover:underline flex items-center gap-1"
            >
              Manage all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live on Marketplace
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-600">
              {stats?.liveListings || 0}
            </div>
            <p className="text-xs text-slate-500">
              Verified & receiving client traffic
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pending Review
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-600">
              {stats?.pendingListings || 0}
            </div>
            <p className="text-xs text-slate-500">
              Under verification review
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Custom Services
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D99000] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {stats?.totalServices || 0}
            </div>
            <Link
              href="/vendor/services"
              className="text-xs font-semibold text-[#D99000] hover:underline flex items-center gap-1"
            >
              Manage services <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Two Column Layout: Quick Actions & Recent Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Listings (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0A1F66]">
                Recent Workspace Listings
              </h3>
              <p className="text-xs text-slate-500">
                Live publication and SuperAdmin verification status
              </p>
            </div>
            <Link
              href="/vendor/listings"
              className="text-xs font-bold text-[#1E5BFF] hover:underline"
            >
              View All Listings
            </Link>
          </div>

          {recentListings.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500">
                No workspace listings added yet. Create your first property listing to begin.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentListings.map((item, idx) => (
                <div
                  key={item._id || item.id || `recent-${idx}`}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-slate-500">
                      {item.categoryId?.name ? `${item.categoryId.name} • ` : ""}
                      {item.location?.area || item.location?.city || "Gurugram"}
                    </p>
                    {item.pricing?.basePrice && (
                      <p className="text-[11px] font-semibold text-slate-700">
                        ₹{item.pricing.basePrice.toLocaleString("en-IN")} / {item.pricing.unit || "month"}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.isLive
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "pending_review"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item.isLive ? "Live Online" : item.status === "pending_review" ? "Under Review" : item.status}
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Updated {new Date(item.updatedAt || item.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tools & Shortcuts (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#0A1F66]">
            Vendor Workspace Tools
          </h3>

          <div className="space-y-2.5">
            <Link
              href="/vendor/listings/new"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#1E5BFF] hover:bg-blue-50/30 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E5BFF] flex items-center justify-center group-hover:bg-[#1E5BFF] group-hover:text-white transition">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Add Property</p>
                  <p className="text-[11px] text-slate-500">7-step listing creator</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E5BFF] transition" />
            </Link>

            <Link
              href="/vendor/services"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#1E5BFF] hover:bg-blue-50/30 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D99000] flex items-center justify-center group-hover:bg-[#D99000] group-hover:text-white transition">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Custom Services</p>
                  <p className="text-[11px] text-slate-500">Cabin & desk catalog</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E5BFF] transition" />
            </Link>

            <Link
              href="/vendor/analytics"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#1E5BFF] hover:bg-blue-50/30 transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Analytics</p>
                  <p className="text-[11px] text-slate-500">Performance insights</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E5BFF] transition" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
