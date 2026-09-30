import React, { useState, useMemo, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  Briefcase,
  User as UserIcon,
  Shield,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { PlatformUser } from "./team.types";

export interface VendorsDirectoryTableProps {
  vendors: PlatformUser[];
  loading: boolean;
  isSuperAdmin: boolean;
  updatingRoleId?: string | null;
  updatingStatusId?: string | null;
  onRefresh: () => void;
  onToggleStatus: (vendor: PlatformUser) => void;
  onRoleChange: (vendorId: string, vendorName: string, newRole: string) => void;
  onOpenDeleteModal: (vendor: PlatformUser) => void;
}

type StatusFilter = "all" | "active" | "suspended" | "logged_in" | "never_logged_in";
type SortOption = "newest" | "oldest" | "name_asc" | "name_desc" | "last_login";

const formatSafeDate = (val?: string | Date | null): string => {
  if (!val) return "Recent";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

const formatSafeDateTime = (val?: string | Date | null): string | null => {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function VendorsDirectoryTable({
  vendors,
  loading,
  isSuperAdmin,
  updatingRoleId = null,
  updatingStatusId = null,
  onRefresh,
  onToggleStatus,
  onRoleChange,
  onOpenDeleteModal,
}: VendorsDirectoryTableProps) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Enterprise Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState("");

  // Live Metric Counts across all loaded partners
  const activeCount = useMemo(
    () => vendors.filter((v) => v.status === "active" && v.isActive !== false).length,
    [vendors]
  );
  const suspendedCount = vendors.length - activeCount;
  const loggedInCount = useMemo(
    () =>
      vendors.filter((v) => Boolean(v.lastLogin) || (v.loginCount && v.loginCount > 0)).length,
    [vendors]
  );

  // Multi-facet filtering & sorting
  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    // 1. Text Search Filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (v) =>
          (v.businessName && v.businessName.toLowerCase().includes(term)) ||
          (v.name && v.name.toLowerCase().includes(term)) ||
          (v.email && v.email.toLowerCase().includes(term)) ||
          (v.phone && v.phone.toLowerCase().includes(term)) ||
          v._id.toLowerCase().includes(term)
      );
    }

    // 2. Status & Access Filter
    if (statusFilter === "active") {
      result = result.filter((v) => v.status === "active" && v.isActive !== false);
    } else if (statusFilter === "suspended") {
      result = result.filter((v) => v.status === "suspended" || v.isActive === false);
    } else if (statusFilter === "logged_in") {
      result = result.filter((v) => Boolean(v.lastLogin) || (v.loginCount && v.loginCount > 0));
    } else if (statusFilter === "never_logged_in") {
      result = result.filter((v) => !v.lastLogin && (!v.loginCount || v.loginCount === 0));
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        const timeA = new Date(a.createdAt || 0).getTime() || 0;
        const timeB = new Date(b.createdAt || 0).getTime() || 0;
        return timeB - timeA;
      }
      if (sortBy === "oldest") {
        const timeA = new Date(a.createdAt || 0).getTime() || 0;
        const timeB = new Date(b.createdAt || 0).getTime() || 0;
        return timeA - timeB;
      }
      if (sortBy === "name_asc") {
        const nameA = (a.businessName || a.name || "").toLowerCase();
        const nameB = (b.businessName || b.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "name_desc") {
        const nameA = (a.businessName || a.name || "").toLowerCase();
        const nameB = (b.businessName || b.name || "").toLowerCase();
        return nameB.localeCompare(nameA);
      }
      if (sortBy === "last_login") {
        const timeA = new Date(a.lastLogin || 0).getTime() || 0;
        const timeB = new Date(b.lastLogin || 0).getTime() || 0;
        return timeB - timeA;
      }
      return 0;
    });

    return result;
  }, [vendors, searchTerm, statusFilter, sortBy]);

  // Compute pagination parameters
  const totalItems = filteredVendors.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset or clamp page number safely when filters, search or pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = totalItems === 0 ? 0 : (clampedPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedVendors = useMemo(() => {
    return filteredVendors.slice(startIndex, endIndex);
  }, [filteredVendors, startIndex, endIndex]);

  // Dynamic pagination window builder
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (clampedPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (clampedPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [1, "...", clampedPage - 1, clampedPage, clampedPage + 1, "...", totalPages];
  }, [totalPages, clampedPage]);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
      setJumpPageInput("");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(searchTerm || statusFilter !== "all" || sortBy !== "newest");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* ----------------- Top Header Section ----------------- */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[#0A1F66]">
                Registered Marketplace Coworking Vendors
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1E5BFF] border border-blue-200">
                <Sparkles className="w-3 h-3 text-[#F4A900]" />
                {vendors.length} Total Partners
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {activeCount} Active
              </span>
              {suspendedCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  {suspendedCount} Suspended
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Clock className="w-3 h-3 text-indigo-600" />
                {loggedInCount} Logged In
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Coworking operators &amp; space owners managing listings on the i-VANTAGE platform.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="self-start lg:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-[#1E5BFF]" : ""} />
            Refresh Directory
          </button>
        </div>

        {/* ----------------- Filter & Search Controls Bar ----------------- */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            {/* Quick Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search partner, business, email, phone..."
                className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 focus:border-[#1E5BFF] transition"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300">
                <Filter size={12} className="text-slate-400" />
                <span className="text-slate-400 text-[11px]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="bg-transparent text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none pr-1"
                >
                  <option value="all">All ({vendors.length})</option>
                  <option value="active">Active ({activeCount})</option>
                  <option value="suspended">Suspended ({suspendedCount})</option>
                  <option value="logged_in">Logged In ({loggedInCount})</option>
                  <option value="never_logged_in">Never Logged In ({vendors.length - loggedInCount})</option>
                </select>
              </div>
            </div>

            {/* Sort Order Selector */}
            <div className="relative">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300">
                <ArrowUpDown size={12} className="text-slate-400" />
                <span className="text-slate-400 text-[11px]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none pr-1"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name_asc">Name (A → Z)</option>
                  <option value="name_desc">Name (Z → A)</option>
                  <option value="last_login">Recent Activity</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-medium text-[#1E5BFF] hover:underline cursor-pointer px-1"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Quick Active Filter Indicator */}
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{totalItems}</span> of{" "}
            <span className="font-bold text-slate-800">{vendors.length}</span> partners
          </div>
        </div>
      </div>

      {/* ----------------- Table View ----------------- */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="pl-4 sm:pl-6 pr-2 py-3">Vendor &amp; Business</th>
              <th className="px-2 py-3">Contact Details</th>
              <th className="px-2 py-3">Role</th>
              <th className="px-2 py-3">Status &amp; Access</th>
              <th className="px-2 py-3">Last Login Activity</th>
              <th className="px-2 py-3">Registered</th>
              <th className="pr-4 sm:pr-6 pl-2 py-3 text-center w-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedVendors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">
                      {hasActiveFilters
                        ? "No matching partners found"
                        : "No registered vendors found"}
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      {hasActiveFilters
                        ? "Try adjusting your search query or status filter to see more partners."
                        : "When a partner signs up on /vendor/signup, they will appear here automatically."}
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#1E5BFF] text-xs font-semibold hover:bg-blue-100 transition"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedVendors.map((vendor) => {
                const isVendorActive =
                  vendor.status === "active" && vendor.isActive !== false;
                const hasLoggedIn = Boolean(vendor.lastLogin);
                const isUpdatingRole = updatingRoleId === vendor._id;
                const isUpdatingStatus = updatingStatusId === vendor._id;

                const currentRoleVal =
                  vendor.role === "superadmin" || vendor.role === "super_admin"
                    ? "superadmin"
                    : vendor.role === "vendor"
                    ? "vendor"
                    : "user";

                const formattedLogin = formatSafeDateTime(vendor.lastLogin);
                const formattedRegistered = formatSafeDate(vendor.createdAt);

                return (
                  <tr key={vendor._id} className="hover:bg-slate-50/70 transition">
                    {/* 1. VENDOR & BUSINESS */}
                    <td className="pl-4 sm:pl-6 pr-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1E5BFF] font-bold text-xs shrink-0 shadow-2xs">
                          {vendor.businessName ? (
                            <Building2 className="w-4 h-4 text-[#1E5BFF]" />
                          ) : (
                            (vendor.name || "V").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div
                            className="font-semibold text-slate-900 truncate max-w-[140px] xl:max-w-[200px]"
                            title={vendor.businessName || vendor.name}
                          >
                            {vendor.businessName || vendor.name}
                          </div>
                          {vendor.businessName && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              Rep: {vendor.name}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-400 font-mono">
                            ID: {vendor._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. CONTACT DETAILS */}
                    <td className="px-2 py-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[130px] xl:max-w-[170px]" title={vendor.email}>
                            {vendor.email}
                          </span>
                        </div>
                        {vendor.phone ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 whitespace-nowrap">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{vendor.phone}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-300">No phone</div>
                        )}
                      </div>
                    </td>

                    {/* 3. ROLE SELECTOR */}
                    <td className="px-2 py-3">
                      {isSuperAdmin ? (
                        <div className="relative inline-flex items-center">
                          <select
                            value={currentRoleVal}
                            disabled={isUpdatingRole}
                            onChange={(e) =>
                              onRoleChange(vendor._id, vendor.name, e.target.value)
                            }
                            className={`appearance-none cursor-pointer pl-5 pr-5 py-1 text-[11px] font-semibold rounded-full border transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
                              currentRoleVal === "vendor"
                                ? "bg-blue-50 text-[#1E5BFF] border-blue-200 hover:bg-blue-100 focus:ring-blue-400"
                                : currentRoleVal === "superadmin"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 focus:ring-indigo-400"
                                : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 focus:ring-slate-400"
                            }`}
                            title="Change partner role (Super Admin only)"
                          >
                            <option value="vendor">Vendor</option>
                            <option value="user">User</option>
                            <option value="superadmin">SuperAdmin</option>
                          </select>

                          <span className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2">
                            {isUpdatingRole ? (
                              <Loader2 size={10} className="animate-spin text-slate-500" />
                            ) : currentRoleVal === "vendor" ? (
                              <Briefcase size={10} className="text-[#1E5BFF]" />
                            ) : currentRoleVal === "superadmin" ? (
                              <Shield size={10} className="text-indigo-600" />
                            ) : (
                              <UserIcon size={10} className="text-slate-600" />
                            )}
                          </span>

                          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <ChevronDown size={9} />
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-[#1E5BFF] border border-blue-200">
                          <Briefcase size={10} />
                          Vendor
                        </span>
                      )}
                    </td>

                    {/* 4. STATUS & ACCESS SWITCH */}
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1.5">
                        {isSuperAdmin ? (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isVendorActive}
                            disabled={isUpdatingStatus}
                            onClick={() => onToggleStatus(vendor)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                              isVendorActive
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-slate-300 hover:bg-slate-400"
                            }`}
                            title={
                              isVendorActive
                                ? "Toggle Off to Suspend vendor & block partner access"
                                : "Toggle On to Activate vendor and restore access"
                            }
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-250 cubic-bezier(0.16, 1, 0.3, 1) ${
                                isVendorActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className={`relative inline-flex h-5 w-9 shrink-0 opacity-50 cursor-not-allowed rounded-full border-2 border-transparent ${
                              isVendorActive ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 ${
                                isVendorActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        )}

                        {isVendorActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            <CheckCircle2 size={10} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200 whitespace-nowrap">
                            <AlertCircle size={10} />
                            Suspended
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. LAST LOGIN ACTIVITY */}
                    <td className="px-2 py-3">
                      {hasLoggedIn && formattedLogin ? (
                        <div className="space-y-0.5 min-w-0">
                          <div className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                            {formattedLogin}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-slate-400" />
                              {vendor.loginCount || 1} logins
                            </span>
                            {vendor.lastLoginIp && (
                              <span className="text-slate-400 font-mono text-[9px]">
                                • {vendor.lastLoginIp}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 whitespace-nowrap">
                          <Clock className="w-3 h-3 text-amber-500" />
                          Never logged in
                        </span>
                      )}
                    </td>

                    {/* 6. REGISTERED DATE */}
                    <td className="px-2 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {formattedRegistered}
                    </td>

                    {/* 7. ACTIONS */}
                    <td className="pr-4 sm:pr-6 pl-2 py-3 text-center w-12 shrink-0">
                      <div className="flex items-center justify-center">
                        {isSuperAdmin ? (
                          <button
                            type="button"
                            onClick={() => onOpenDeleteModal(vendor)}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                            title={`Delete ${vendor.businessName || vendor.name} permanently`}
                          >
                            <Trash2 size={15} />
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ----------------- Enterprise MNC Pagination Footer ----------------- */}
      <div className="px-4 sm:px-6 py-3.5 border-t border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Summary & Rows-Per-Page Selector */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div>
            Showing{" "}
            <span className="font-bold text-slate-900">
              {totalItems === 0 ? 0 : startIndex + 1}
            </span>{" "}
            to <span className="font-bold text-slate-900">{endIndex}</span> of{" "}
            <span className="font-bold text-slate-900">{totalItems}</span> partners
            {totalItems !== vendors.length && (
              <span className="text-slate-400 ml-1">
                (filtered from {vendors.length})
              </span>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Rows Per Page dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="py-1 px-2.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 text-xs shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/30 cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Right: Modern MNC Page Navigation */}
        <div className="flex flex-wrap items-center gap-2 self-center md:self-auto">
          {/* Quick Page Info */}
          <span className="text-xs text-slate-500 mr-1 hidden sm:inline">
            Page <span className="font-bold text-slate-800">{clampedPage}</span> of{" "}
            <span className="font-bold text-slate-800">{totalPages}</span>
          </span>

          {/* First Page Button */}
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            disabled={clampedPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
            title="First page"
          >
            <ChevronsLeft size={15} />
          </button>

          {/* Previous Page Button */}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={clampedPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft size={15} />
          </button>

          {/* Numbered Page Buttons with dynamic window & ellipsis */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pNum, index) => {
              if (pNum === "...") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1.5 py-1 text-xs text-slate-400 select-none font-semibold"
                  >
                    ...
                  </span>
                );
              }

              const num = pNum as number;
              const isActive = num === clampedPage;

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCurrentPage(num)}
                  className={`min-w-[28px] h-7 px-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#1E5BFF] text-white shadow-xs ring-2 ring-[#1E5BFF]/20"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Next Page Button */}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={clampedPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
            title="Next page"
          >
            <ChevronRight size={15} />
          </button>

          {/* Last Page Button */}
          <button
            type="button"
            onClick={() => setCurrentPage(totalPages)}
            disabled={clampedPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
            title="Last page"
          >
            <ChevronsRight size={15} />
          </button>

          {/* Quick Jump Input for High-Scale (shown when totalPages > 3) */}
          {totalPages > 3 && (
            <form
              onSubmit={handleJumpSubmit}
              className="hidden lg:flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-200"
            >
              <span className="text-[11px] text-slate-400">Go to:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                placeholder={`${clampedPage}`}
                className="w-11 py-1 px-1.5 text-center text-xs rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1E5BFF]/30"
              />
              <button
                type="submit"
                disabled={!jumpPageInput}
                className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Go
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
