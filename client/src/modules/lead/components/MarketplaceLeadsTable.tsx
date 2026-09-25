"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import { useRealtimeEvent } from "@/context/RealtimeContext";
import {
  Search,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";

interface MarketplaceLeadItem {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: "new" | "contacted" | "converted" | "lost";
  source: string;
  listingId?: {
    _id: string;
    title: string;
    slug: string;
    location?: { area: string; city: string };
  };
  vendorId?: {
    _id: string;
    name: string;
    businessName?: string;
    email: string;
    phone?: string;
  };
  notes?: Array<{
    authorId: { name: string; role: string };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export default function MarketplaceLeadsTable() {
  const [leads, setLeads] = useState<MarketplaceLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<MarketplaceLeadItem | null>(null);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await marketplaceApi.getAdminLeads();
      setLeads(data || []);
    } catch (err: any) {
      console.warn("Could not load marketplace leads:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Debounced silent refetch for real-time events
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  useRealtimeEvent("leads", () => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      fetchLeads(true);
    }, 300);
  });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        (lead.email && lead.email.toLowerCase().includes(search.toLowerCase())) ||
        (lead.listingId?.title && lead.listingId.title.toLowerCase().includes(search.toLowerCase())) ||
        (lead.vendorId?.businessName && lead.vendorId.businessName.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      converted: leads.filter((l) => l.status === "converted").length,
    };
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inquiries</p>
          <p className="text-2xl font-black text-[#0A1F66] mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">New Leads</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.new}</p>
        </div>
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Contacted</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{stats.contacted}</p>
        </div>
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Converted</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.converted}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prospect, phone, space, vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#1E5BFF] transition"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#1E5BFF]"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <button
            onClick={() => fetchLeads(false)}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition active:scale-95"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#1E5BFF]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#1E5BFF]" />
            <span className="text-xs">Loading marketplace enquiries...</span>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Building className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">No property tour enquiries found</p>
            <p className="text-xs text-slate-400 mt-1">Enquiries submitted on workspace listings will appear here in real-time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Client / Prospect</th>
                  <th className="py-3 px-4">Property / Space</th>
                  <th className="py-3 px-4">Space Partner (Vendor)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Enquiry Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLeads.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-[#1E5BFF]" />
                        <a href={`tel:${item.phone}`} className="hover:underline text-slate-600">
                          {item.phone}
                        </a>
                      </div>
                      {item.email && (
                        <div className="text-slate-400 text-[11px] truncate max-w-[180px] mt-0.5">
                          {item.email}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">
                        {item.listingId?.title || "Direct Space Enquiry"}
                      </div>
                      {item.listingId?.location && (
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          {item.listingId.location.area}, {item.listingId.location.city}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#0A1F66]">
                        {item.vendorId?.businessName || item.vendorId?.name || "Direct / Admin"}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {item.vendorId?.email || "Platform"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          item.status === "new"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : item.status === "contacted"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : item.status === "converted"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLead(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#1E5BFF] text-slate-700 font-bold transition text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0A1F66]">Enquiry Dossier</h3>
                <p className="text-xs text-slate-400">ID: {selectedLead._id}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Prospect Contact</span>
                <p className="font-bold text-slate-900 text-sm">{selectedLead.name}</p>
                <p className="text-slate-600">Phone: {selectedLead.phone}</p>
                {selectedLead.email && <p className="text-slate-600">Email: {selectedLead.email}</p>}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Property & Partner</span>
                <p className="font-bold text-[#0A1F66]">{selectedLead.listingId?.title || "Direct Space Enquiry"}</p>
                <p className="text-slate-600">
                  Managing Partner: <strong>{selectedLead.vendorId?.businessName || selectedLead.vendorId?.name || "Direct"}</strong>
                </p>
                <p className="text-slate-500">Partner Contact: {selectedLead.vendorId?.email}</p>
              </div>

              {selectedLead.message && (
                <div className="bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 uppercase">Client Requirement / Note</span>
                  <p className="text-slate-700 italic">"{selectedLead.message}"</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
