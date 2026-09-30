import React from "react";
import { Building2, UserCheck, Activity, ShieldCheck } from "lucide-react";
import { TeamTab } from "./team.types";

export interface TeamMetricsCardsProps {
  // Vendor metrics (Real-time)
  totalVendors: number;
  activeVendorsCount: number;
  suspendedVendorsCount: number;
  loggedInVendorsCount: number;
  neverLoggedInVendorsCount: number;
  totalVendorLogins: number;

  // Administrative team metrics
  totalMembers: number;
  activeMembersCount: number;
  pendingRequestsCount?: number;

  // Tab navigation
  activeTab: TeamTab;
  onSelectTab: (tab: TeamTab) => void;
}

export default function TeamMetricsCards({
  totalVendors,
  activeVendorsCount,
  suspendedVendorsCount,
  loggedInVendorsCount,
  neverLoggedInVendorsCount,
  totalVendorLogins,
  totalMembers,
  activeMembersCount,
  pendingRequestsCount = 0,
  activeTab,
  onSelectTab,
}: TeamMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Registered Vendors (Signups) */}
      <div
        onClick={() => onSelectTab("vendors")}
        className={`group cursor-pointer rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          activeTab === "vendors"
            ? "border-[#1E5BFF] ring-2 ring-blue-100"
            : "border-slate-200 hover:border-blue-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Vendor Signups
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] transition group-hover:scale-110">
            <Building2 size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-3xl font-extrabold text-[#0A1F66]">
            {totalVendors}
          </p>
          <span className="text-xs font-semibold text-slate-400">
            All-Time
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            {activeVendorsCount} Active
            {suspendedVendorsCount > 0 && (
              <span className="text-rose-500"> • {suspendedVendorsCount} Suspended</span>
            )}
          </span>
          <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#1E5BFF]">
            Partners
          </span>
        </div>
      </div>

      {/* 2. Authenticated / Logged-in Vendors */}
      <div
        onClick={() => onSelectTab("vendors")}
        className={`group cursor-pointer rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          activeTab === "vendors"
            ? "border-emerald-500 ring-2 ring-emerald-100"
            : "border-slate-200 hover:border-emerald-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Logged-In Partners
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:scale-110">
            <UserCheck size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-3xl font-extrabold text-[#0A1F66]">
            {loggedInVendorsCount}
          </p>
          <span className="text-xs font-semibold text-slate-400">
            / {totalVendors} Total
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            {neverLoggedInVendorsCount > 0
              ? `${neverLoggedInVendorsCount} never logged in`
              : "All partners have logged in"}
          </span>
          <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            {totalVendors > 0
              ? `${Math.round((loggedInVendorsCount / totalVendors) * 100)}%`
              : "0%"}
          </span>
        </div>
      </div>

      {/* 3. Real-Time Login Sessions */}
      <div
        onClick={() => onSelectTab("audit")}
        className={`group cursor-pointer rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          activeTab === "audit"
            ? "border-amber-500 ring-2 ring-amber-100"
            : "border-slate-200 hover:border-amber-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Login Sessions
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:scale-110">
            <Activity size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-3xl font-extrabold text-[#0A1F66]">
            {totalVendorLogins}
          </p>
          <span className="text-xs font-semibold text-slate-400">
            Sessions
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">Recorded partner sessions</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* 4. Console Administrators */}
      <div
        onClick={() => onSelectTab("members")}
        className={`group cursor-pointer rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
          activeTab === "members"
            ? "border-indigo-500 ring-2 ring-indigo-100"
            : "border-slate-200 hover:border-indigo-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Authorized Admins
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:scale-110">
            <ShieldCheck size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-3xl font-extrabold text-[#0A1F66]">
            {activeMembersCount}
          </p>
          <span className="text-xs font-semibold text-slate-400">
            / {totalMembers} Total
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            {pendingRequestsCount > 0
              ? `${pendingRequestsCount} pending approval`
              : "Privileged team members"}
          </span>
          {pendingRequestsCount > 0 && (
            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
              Action Req.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
