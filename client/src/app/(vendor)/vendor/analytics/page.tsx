"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import { useRealtimeEvent } from "@/context/RealtimeContext";
import {
  BarChart3,
  TrendingUp,
  Radio,
  Clock,
  CheckCircle,
  Users,
  Building,
  Loader2,
} from "lucide-react";

export default function VendorAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const data = await marketplaceApi.getVendorAnalytics();
      if (data) setStats(data.stats);
    } catch (err: any) {
      console.warn("Analytics fetch note:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    marketplaceApi.getVendorAnalytics()
      .then((data) => {
        if (!ignore && data) setStats(data.stats);
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn("Analytics fetch note:", msg);
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
      fetchStats();
    }, 500);
  }, [fetchStats]);

  useRealtimeEvent("listings", silentRefresh);
  useRealtimeEvent("leads", silentRefresh);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-black text-[#0A1F66]">
          Performance Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics on your active spaces, approval pipeline, and customer acquisition.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Analyzing workspace data...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">
                Listing Success Rate
              </span>
              <div className="text-3xl font-black text-slate-900">
                {stats?.totalListings > 0
                  ? `${Math.round((stats.liveListings / stats.totalListings) * 100)}%`
                  : "0%"}
              </div>
              <p className="text-xs text-slate-500">
                {stats?.liveListings} of {stats?.totalListings} properties live online
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">
                Custom Services
              </span>
              <div className="text-3xl font-black text-amber-500">
                {stats?.totalServices || 0}
              </div>
              <p className="text-xs text-slate-500">
                Configured cabin & desk service offerings
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold uppercase text-slate-400">
                Pipeline Review Queue
              </span>
              <div className="text-3xl font-black text-amber-600">
                {stats?.pendingListings || 0}
              </div>
              <p className="text-xs text-slate-500">
                Properties awaiting SuperAdmin approval
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
