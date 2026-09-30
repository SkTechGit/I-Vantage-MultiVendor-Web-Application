"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import { useRealtimeEvent } from "@/context/RealtimeContext";
import {
  Users,
  Search,
  Phone,
  Mail,
  Building2,
  Calendar,
  MessageSquare,
  Sparkles,
  Loader2,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Send,
  X,
} from "lucide-react";

interface LeadNote {
  authorId?: { name?: string; role?: string };
  text: string;
  createdAt: string;
}

interface LeadItem {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: string;
  status: "new" | "contacted" | "converted" | "lost";
  listingId?: {
    _id: string;
    title: string;
    slug: string;
    location?: { area: string; city: string };
  };
  notes: LeadNote[];
  createdAt: string;
}

export default function VendorLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Notes / Detail Modal State
  const [activeLead, setActiveLead] = useState<LeadItem | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await marketplaceApi.getVendorLeads();
      setLeads(data || []);
    } catch (err: any) {
      console.warn("Vendor leads note:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    marketplaceApi.getVendorLeads()
      .then((data) => {
        if (!ignore) setLeads(data || []);
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn("Vendor leads note:", msg);
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
  useRealtimeEvent("leads", () => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      fetchLeads(true);
    }, 300);
  });

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    const currentLead = leads.find((l) => l._id === leadId);
    if (!currentLead || currentLead.status === newStatus) return;
    const oldStatus = currentLead.status;

    setUpdatingStatusId(leadId);

    // Optimistic UI state update
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, status: newStatus as any } : l))
    );
    if (activeLead && activeLead._id === leadId) {
      setActiveLead((prev) => (prev ? { ...prev, status: newStatus as any } : null));
    }

    try {
      await marketplaceApi.updateVendorLead(leadId, { status: newStatus });
    } catch (err: any) {
      // Rollback on failure
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: oldStatus } : l))
      );
      if (activeLead && activeLead._id === leadId) {
        setActiveLead((prev) => (prev ? { ...prev, status: oldStatus } : null));
      }
      alert(err.response?.data?.error || err.message || "Failed to update lead status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !newNoteText.trim()) return;

    setSubmittingNote(true);
    try {
      await marketplaceApi.updateVendorLead(activeLead._id, {
        noteText: newNoteText.trim(),
      });
      const updatedNotes: LeadNote[] = [
        ...activeLead.notes,
        {
          text: newNoteText.trim(),
          createdAt: new Date().toISOString(),
        },
      ];
      setActiveLead({ ...activeLead, notes: updatedNotes });
      setLeads((prev) =>
        prev.map((l) => (l._id === activeLead._id ? { ...l, notes: updatedNotes } : l))
      );
      setNewNoteText("");
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || "Failed to add note");
    } finally {
      setSubmittingNote(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      l.name.toLowerCase().includes(query) ||
      l.phone.includes(query) ||
      (l.email && l.email.toLowerCase().includes(query)) ||
      (l.listingId?.title && l.listingId.title.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-[#1E5BFF] border-blue-200";
      case "contacted":
        return "bg-amber-50 text-[#D99000] border-amber-200";
      case "converted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "lost":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D99000] text-white uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Client Pipeline
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Customer Enquiries & Leads
          </h1>
          <p className="text-xs md:text-sm text-blue-100 mt-1 max-w-xl">
            Track inquiries, schedule site visits, maintain follow-up notes, and convert prospective tenants for your listed spaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
            <p className="text-[11px] text-blue-200 font-medium">Total Inquiries</p>
            <p className="text-xl font-black text-white">{leads.length}</p>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-md px-4 py-2.5 rounded-xl border border-emerald-400/30 text-center">
            <p className="text-[11px] text-emerald-200 font-medium">New</p>
            <p className="text-xl font-black text-emerald-300">
              {leads.filter((l) => l.status === "new").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Leads" },
            { id: "new", label: "New" },
            { id: "contacted", label: "Contacted" },
            { id: "converted", label: "Converted" },
            { id: "lost", label: "Lost" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-[#0A1F66] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search client, phone, property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white transition"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E5BFF]" />
            <p className="text-xs font-semibold">Loading tenant leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="py-20 text-center space-y-3 px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E5BFF] flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0A1F66]">No inquiries found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search || statusFilter !== "all"
                ? "No customer leads match your active filters. Try adjusting your search query."
                : "When prospective clients submit enquiries on your listed coworking spaces, they will appear here in real-time."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Client Details</th>
                  <th className="py-3.5 px-4">Workspace Listing</th>
                  <th className="py-3.5 px-4">Lead Status</th>
                  <th className="py-3.5 px-4">Date Received</th>
                  <th className="py-3.5 px-4">Quick Contact</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/60 transition group">
                    {/* Client */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-[#1E5BFF] transition">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{lead.phone}</span>
                      </div>
                      {lead.email && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{lead.email}</span>
                        </div>
                      )}
                    </td>

                    {/* Listing */}
                    <td className="py-3.5 px-4">
                      {lead.listingId ? (
                        <div>
                          <p className="font-bold text-[#0A1F66] line-clamp-1">
                            {lead.listingId.title}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>{lead.listingId.location?.area || "Gurugram"}</span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">General Inquiry</span>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                        disabled={updatingStatusId === lead._id}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer transition ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(lead.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    {/* Direct Contact CTAs */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
                          title="Call client"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-[#1E5BFF] hover:bg-blue-100 transition border border-blue-200"
                            title="Email client"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveLead(lead)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0A1F66] hover:text-white text-slate-700 font-bold transition text-[11px] shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Notes ({lead.notes?.length || 0})</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notes & Activity Modal */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] flex flex-col justify-between">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0A1F66]">
                  Lead Activity: {activeLead.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeLead.phone} {activeLead.email ? `• ${activeLead.email}` : ""}
                </p>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inquired message snippet */}
            {activeLead.message && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                <p className="text-[10px] font-bold text-[#1E5BFF] uppercase tracking-wider mb-1">
                  Client Message
                </p>
                <p className="text-slate-700 italic">&ldquo;{activeLead.message}&rdquo;</p>
              </div>
            )}

            {/* Notes Thread */}
            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-56 pr-1 scrollbar-thin">
              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Follow-up Notes & Timeline
              </p>
              {!activeLead.notes || activeLead.notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3 text-center">
                  No notes recorded yet. Add your first client note below.
                </p>
              ) : (
                activeLead.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <p className="text-slate-800">{note.text}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Record note (e.g., Scheduled site visit for Friday 3 PM)..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={submittingNote || !newNoteText.trim()}
                  className="px-4 py-2.5 bg-[#0A1F66] hover:bg-[#1E5BFF] text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingNote ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Save</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
