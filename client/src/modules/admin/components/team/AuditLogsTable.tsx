import React from "react";
import {
  ShieldAlert,
  LogIn,
  UserPlus,
  ShieldCheck,
  Monitor,
  Clock,
  Sparkles,
  Activity,
} from "lucide-react";
import { SecurityAuditItem } from "./team.types";

export interface AuditLogsTableProps {
  logs: SecurityAuditItem[];
  loading: boolean;
  onRefresh: () => void;
}

const getActionBadge = (action: string) => {
  switch (action) {
    case "vendor_login":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1E5BFF] border border-blue-200">
          <LogIn className="w-3 h-3 text-[#1E5BFF]" />
          Vendor Login
        </span>
      );
    case "admin_login":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <ShieldCheck className="w-3 h-3 text-purple-600" />
          Admin Login
        </span>
      );
    case "vendor_registered":
    case "vendor_signup":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <UserPlus className="w-3 h-3 text-emerald-600" />
          Vendor Signup
        </span>
      );
    case "admin_status_toggled":
    case "member_status_toggled":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <ShieldAlert className="w-3 h-3 text-amber-600" />
          Status Changed
        </span>
      );
    case "member_role_changed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Activity className="w-3 h-3 text-indigo-600" />
          Role Updated
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Activity className="w-3 h-3 text-slate-500" />
          {action.replace(/_/g, " ").toUpperCase()}
        </span>
      );
  }
};

const getPortalLabel = (portal: string) => {
  if (portal === "vendor_portal") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
        Vendor Portal
      </span>
    );
  }
  if (portal === "admin_portal") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700">
        Admin Console
      </span>
    );
  }
  return <span className="text-xs text-slate-500">Public Site</span>;
};

export default function AuditLogsTable({
  logs,
  loading,
  onRefresh,
}: AuditLogsTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#0A1F66]">
              Live Security & Activity Audit Log
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live SSE Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time audit stream of all authentication events, login sessions, and administrative actions across all portals.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition self-start sm:self-auto cursor-pointer"
        >
          Refresh Stream
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5">Action & Event</th>
              <th className="px-6 py-3.5">Target Account</th>
              <th className="px-6 py-3.5">Portal Origin</th>
              <th className="px-6 py-3.5">Client IP & Device</th>
              <th className="px-6 py-3.5">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Activity className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-semibold">No recent activity logs found</p>
                    <p className="text-xs text-slate-400">
                      When users log in, sign up, or modify accounts, events will stream here live.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const dateFormatted = new Date(log.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                });

                return (
                  <tr key={log._id} className="hover:bg-slate-50/70 transition">
                    {/* Action */}
                    <td className="px-6 py-3.5">{getActionBadge(log.action)}</td>

                    {/* Target Email / User */}
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-800 text-xs">
                        {log.targetEmail || "System Event"}
                      </div>
                      {Boolean(log.metadata && typeof log.metadata === "object" && (log.metadata as Record<string, unknown>).businessName) && (
                        <div className="text-[11px] text-slate-400">
                          {String((log.metadata as Record<string, unknown>).businessName)}
                        </div>
                      )}
                    </td>

                    {/* Portal */}
                    <td className="px-6 py-3.5">{getPortalLabel(log.portal)}</td>

                    {/* IP & Device */}
                    <td className="px-6 py-3.5">
                      <div className="space-y-0.5">
                        <div className="font-mono text-xs text-slate-600">
                          {log.ipAddress || "127.0.0.1"}
                        </div>
                        {log.userAgent && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate max-w-xs">
                            <Monitor className="w-3 h-3 shrink-0" />
                            <span className="truncate">{log.userAgent}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dateFormatted}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
