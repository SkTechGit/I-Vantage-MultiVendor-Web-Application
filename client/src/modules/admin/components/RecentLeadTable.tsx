"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowRight,
  Phone,
  Copy,
  Check,
  MoreHorizontal,
  ExternalLink,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardStats } from "../admin.types";

interface Props {
  leads: DashboardStats["recentLeads"];
}

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  NEW: {
    bg: "bg-blue-50 border-blue-200/60",
    text: "text-blue-700",
    dot: "bg-blue-500",
    label: "New",
  },
  CONTACTED: {
    bg: "bg-amber-50 border-amber-200/60",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Contacted",
  },
  FOLLOW_UP: {
    bg: "bg-orange-50 border-orange-200/60",
    text: "text-orange-700",
    dot: "bg-orange-500",
    label: "Follow Up",
  },
  QUALIFIED: {
    bg: "bg-purple-50 border-purple-200/60",
    text: "text-purple-700",
    dot: "bg-purple-500",
    label: "Qualified",
  },
  CONVERTED: {
    bg: "bg-emerald-50 border-emerald-200/60",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Converted",
  },
  WON: {
    bg: "bg-green-50 border-green-200/60",
    text: "text-green-700",
    dot: "bg-green-500",
    label: "Won",
  },
  LOST: {
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
    label: "Lost",
  },
};

export default function RecentLeadTable({ leads = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleCopyPhone = (id: string, phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    toast.success(`Copied phone: ${phone}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered & Sorted Leads
  const processedLeads = useMemo(() => {
    let result = [...leads];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((lead) => {
        const nameMatch = lead.fullName?.toLowerCase().includes(q);
        const mobileMatch = lead.mobile?.includes(q);
        const serviceMatch = lead.services?.some((s) =>
          s.name?.toLowerCase().includes(q)
        );
        return nameMatch || mobileMatch || serviceMatch;
      });
    }

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter(
        (lead) => (lead.status || "NEW").toUpperCase() === statusFilter
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      }
      if (sortBy === "name-asc") {
        return (a.fullName || "").localeCompare(b.fullName || "");
      }
      if (sortBy === "name-desc") {
        return (b.fullName || "").localeCompare(a.fullName || "");
      }
      return 0;
    });

    return result;
  }, [leads, searchTerm, statusFilter, sortBy]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (statusStr?: string) => {
    const key = (statusStr || "NEW").toUpperCase();
    const conf = STATUS_CONFIG[key] || STATUS_CONFIG.NEW;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${conf.bg} ${conf.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
        <span>{conf.label}</span>
      </span>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
      {/* 1. Header Area: Title, Description, Link */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 p-5 sm:px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1F5E]">
              Recent Leads
            </h2>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#2563EB]">
              {leads.length} Active
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Latest customer inquiries and workspace booking requests.
          </p>
        </div>

        <Link
          href="/admin/leads"
          className="group inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          <span>View all leads pipeline</span>
          <ArrowRight
            size={14}
            className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-700"
          />
        </Link>
      </div>

      {/* 2. Interactive Toolbar: Search, Status Filter, Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, mobile, service..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-slate-400 hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="CONVERTED">Converted</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown size={14} className="text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Table Workspace (Desktop & Tablet) */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-3.5 sm:px-6">
                Client / Contact
              </th>
              <th scope="col" className="px-4 py-3.5">
                Requested Services
              </th>
              <th scope="col" className="px-4 py-3.5">
                Phone Contact
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right sm:px-6">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-sans">
            {processedLeads.length > 0 ? (
              processedLeads.map((lead) => {
                const isExpanded = expandedRow === lead._id;
                const services = lead.services || [];
                const visibleServices = isExpanded ? services : services.slice(0, 2);
                const hasMore = services.length > 2;

                const initials = lead.fullName
                  ? lead.fullName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "LD";

                return (
                  <tr
                    key={lead._id}
                    className="group transition-colors duration-100 hover:bg-slate-50/80"
                  >
                    {/* 1. Name & Creation Timestamp */}
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {lead.fullName || "Unnamed Client"}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {formatDate(lead.createdAt)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Services Requested */}
                    <td className="px-4 py-4 max-w-[320px]">
                      {services.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {visibleServices.map((s, idx) => (
                            <span
                              key={s._id || idx}
                              className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 truncate max-w-[180px]"
                              title={s.name}
                            >
                              {s.name}
                            </span>
                          ))}
                          {hasMore && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedRow(isExpanded ? null : lead._id)
                              }
                              className="text-[10px] font-semibold text-blue-600 hover:underline px-1 py-0.5 rounded bg-blue-50"
                            >
                              {isExpanded
                                ? "Show less"
                                : `+${services.length - 2} more`}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          General Inquiry
                        </span>
                      )}
                    </td>

                    {/* 3. Mobile Phone with One-Click Copy */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {lead.mobile ? (
                        <div className="inline-flex items-center gap-1.5 group/phone">
                          <a
                            href={`tel:${lead.mobile}`}
                            className="text-xs font-medium text-slate-800 hover:text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Phone size={13} className="text-slate-400" />
                            <span>{lead.mobile}</span>
                          </a>

                          <button
                            type="button"
                            onClick={(e) =>
                              handleCopyPhone(lead._id, lead.mobile, e)
                            }
                            title="Copy phone number"
                            className="opacity-0 group-hover/phone:opacity-100 p-1 text-slate-400 hover:text-slate-700 transition"
                          >
                            {copiedId === lead._id ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* 4. Status Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(lead.status)}
                    </td>

                    {/* 5. Row Actions */}
                    <td className="px-5 py-4 text-right sm:px-6 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href="/admin/leads"
                          title="Open in Leads Module"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
                        >
                          <ExternalLink size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-14 text-center">
                  <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    No leads match your filter
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Try adjusting your search keywords or status filter.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Mobile Responsive Card List (Under 640px) */}
      <div className="sm:hidden divide-y divide-slate-100">
        {processedLeads.length > 0 ? (
          processedLeads.map((lead) => (
            <div key={lead._id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">
                    {lead.fullName || "Unnamed Client"}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
                {getStatusBadge(lead.status)}
              </div>

              {/* Mobile Services */}
              <div className="flex flex-wrap gap-1">
                {(lead.services || []).map((s, idx) => (
                  <span
                    key={s._id || idx}
                    className="text-[10px] bg-slate-100 text-slate-700 rounded px-2 py-0.5"
                  >
                    {s.name}
                  </span>
                ))}
              </div>

              {/* Mobile Action bar */}
              <div className="flex items-center justify-between pt-1 text-xs">
                {lead.mobile ? (
                  <a
                    href={`tel:${lead.mobile}`}
                    className="flex items-center gap-1.5 font-medium text-blue-600"
                  >
                    <Phone size={13} />
                    <span>{lead.mobile}</span>
                  </a>
                ) : (
                  <span className="text-slate-400">No phone</span>
                )}

                <Link
                  href="/admin/leads"
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                >
                  <span>Details</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">
            <p className="text-sm font-medium">No matching leads</p>
          </div>
        )}
      </div>

      {/* 5. Footer: Record Summary */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-500">
        <span>
          Showing{" "}
          <strong className="font-semibold text-slate-700">
            {processedLeads.length}
          </strong>{" "}
          of {leads.length} recent enquiries
        </span>

        <Link
          href="/admin/leads"
          className="font-medium text-blue-600 hover:underline flex items-center gap-1"
        >
          <span>Complete pipeline in Leads Module</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}