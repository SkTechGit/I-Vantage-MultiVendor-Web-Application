"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Briefcase,
  Users,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getDashboard } from "../admin.api";
import { DashboardStats } from "../admin.types";
import StatCard from "./StatCard";
import RecentLeadTable from "./RecentLeadTable";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);

  const fetchDashboard = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await getDashboard();
      setDashboard(data);
      if (isManualRefresh) {
        toast.success("Dashboard metrics updated.");
      }
    } catch (err: unknown) {
      console.error(err);
      setError("Unable to retrieve dashboard metrics. Please check connection.");
      if (isManualRefresh) {
        toast.error("Failed to refresh dashboard.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const userDisplayName = user?.fullName || "Admin";

  /* =========================================================
     LOADING SKELETON STATE (Zero Layout Shift)
     ========================================================= */
  if (loading) {
    return (
      <div className="w-full space-y-6 sm:space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-44 rounded-xl bg-slate-200" />
            <div className="h-4 w-60 rounded-lg bg-slate-100" />
          </div>
          <div className="h-10 w-32 rounded-xl bg-slate-200" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 rounded bg-slate-100" />
                <div className="h-10 w-10 rounded-xl bg-slate-100" />
              </div>
              <div className="h-9 w-20 rounded-lg bg-slate-200" />
              <div className="h-3 w-36 rounded bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Table Workspace Skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="h-6 w-36 rounded bg-slate-200" />
          <div className="h-10 w-full rounded-xl bg-slate-100" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full rounded-xl bg-slate-50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR STATE
     ========================================================= */
  if (error || !dashboard) {
    return (
      <div className="w-full rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center space-y-4 max-w-lg mx-auto my-12">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Unable to Load Dashboard
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            {error || "An unexpected error occurred while fetching system data."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchDashboard(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  /* =========================================================
     ENTERPRISE DASHBOARD CONTENT
     ========================================================= */
  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* 1. Page Header: Title, Subtitle, Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1F5E]">
            Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Welcome back, <span className="font-semibold text-slate-700">{userDisplayName}</span>. Here is your enterprise operations overview.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            title="Refresh dashboard metrics"
            className="inline-flex h-9 sm:h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95 disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin text-blue-600" : "text-slate-400"}
            />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <Link
            href="/admin/services"
            className="inline-flex h-9 sm:h-10 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-700 active:scale-95"
          >
            <PlusCircle size={15} />
            <span>Manage Catalog</span>
          </Link>
        </div>
      </div>

      {/* 2. Core Operational Metrics (KPIs) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        <StatCard
          title="Categories"
          value={dashboard.totalCategories}
          subtitle="Taxonomy classifications active in directory"
          href="/admin/categories"
          icon={<FolderOpen size={20} />}
        />

        <StatCard
          title="Services"
          value={dashboard.totalServices}
          subtitle="Published business offerings & packages"
          href="/admin/services"
          icon={<Briefcase size={20} />}
        />

        <StatCard
          title="Total Leads"
          value={dashboard.totalLeads}
          subtitle="Customer inquiries recorded in system"
          href="/admin/leads"
          icon={<Users size={20} />}
        />
      </div>

      {/* 3. Primary Data Workspace: Recent Leads */}
      <div className="min-w-0">
        <RecentLeadTable leads={dashboard.recentLeads} />
      </div>

      {/* 4. Quick Operational Shortcuts Footer */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
              <Users size={18} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0B1F5E]">
                Need to process enquiries or assign follow-ups?
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Jump directly to the CRM Pipeline to update lead stages and log notes.
              </p>
            </div>
          </div>

          <Link
            href="/admin/crm"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold text-[#2563EB] hover:text-blue-800 hover:underline"
          >
            <span>Open CRM Pipeline</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}