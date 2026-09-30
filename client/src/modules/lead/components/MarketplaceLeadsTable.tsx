"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import { useRealtimeEvent } from "@/context/RealtimeContext";
import { Search, Filter, RefreshCw, Building } from "lucide-react";
import { ConfirmDialog } from "@/components/ui";
import { DataTableShell } from "@/components/patterns";
import { LeadsDesktopTable } from "./LeadsDesktopTable";
import { LeadsMobileCards } from "./LeadsMobileCards";
import { LeadDossierModal } from "./LeadDossierModal";
import {
  MarketplaceLeadItem,
  MarketplaceLeadStatus,
} from "./lead.table.types";

export default function MarketplaceLeadsTable() {
  const [leads, setLeads] = useState<MarketplaceLeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<MarketplaceLeadItem | null>(null);

  // Status updating & note submitting state
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Delete dialog state
  const [leadToDelete, setLeadToDelete] = useState<MarketplaceLeadItem | null>(null);
  const [deletingLead, setDeletingLead] = useState(false);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await marketplaceApi.getAdminLeads();
      setLeads(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("Could not load marketplace leads:", msg);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const data = await marketplaceApi.getAdminLeads();
        if (!ignore) {
          setLeads(data || []);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn("Could not load marketplace leads:", msg);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Real-time live synchronization for desktop and mobile
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  useRealtimeEvent("leads", (payload: { type?: string; leadId?: string; status?: MarketplaceLeadStatus } | null) => {
    // 1. Instant in-memory optimistic updates for other devices
    if (payload?.type === "LEAD_DELETED" && payload?.leadId) {
      setLeads((prev) => prev.filter((l) => l._id !== payload.leadId));
      if (selectedLead?._id === payload.leadId) {
        setSelectedLead(null);
      }
    } else if (payload?.type === "LEAD_UPDATED" && payload?.leadId && payload?.status) {
      setLeads((prev) =>
        prev.map((l) => (l._id === payload.leadId ? { ...l, status: payload.status! } : l))
      );
      if (selectedLead?._id === payload.leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: payload.status! } : null));
      }
    }

    // 2. Debounced silent refetch to pull new leads or full populated relationships
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      fetchLeads(true);
    }, 250);
  });

  // Mobile App / Phone Tab resume listener (visibilitychange)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchLeads(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchLeads]);

  // Handle status update (Optimistic with immediate broadcast sync)
  const handleUpdateStatus = async (
    leadId: string,
    newStatus: MarketplaceLeadStatus
  ) => {
    const currentLead = leads.find((l) => l._id === leadId);
    if (!currentLead || currentLead.status === newStatus) return;
    const oldStatus = currentLead.status;

    setUpdatingStatusId(leadId);

    // Optimistic UI state update
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead._id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await marketplaceApi.updateAdminLead(leadId, { status: newStatus });
    } catch (err: unknown) {
      // Rollback on failure
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: oldStatus } : l))
      );
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, status: oldStatus } : null));
      }
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      alert(apiErr.response?.data?.message || apiErr.message || "Failed to update lead status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Handle add internal note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    setSubmittingNote(true);
    const noteText = newNoteText.trim();
    try {
      const updated = await marketplaceApi.updateAdminLead(selectedLead._id, {
        note: noteText,
      });

      const updatedLeadData = updated?.data || updated;
      const updatedNotes = updatedLeadData?.notes || [
        ...(selectedLead.notes || []),
        {
          authorName: "Administrator",
          text: noteText,
          createdAt: new Date().toISOString(),
        },
      ];

      setSelectedLead((prev) => (prev ? { ...prev, notes: updatedNotes } : null));
      setLeads((prev) =>
        prev.map((l) => (l._id === selectedLead._id ? { ...l, notes: updatedNotes } : l))
      );
      setNewNoteText("");
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      alert(apiErr.response?.data?.message || apiErr.message || "Failed to add note");
    } finally {
      setSubmittingNote(false);
    }
  };

  // Handle delete lead with optimistic update
  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    setDeletingLead(true);

    try {
      await marketplaceApi.deleteAdminLead(leadToDelete._id);
      setLeads((prev) => prev.filter((l) => l._id !== leadToDelete._id));
      if (selectedLead?._id === leadToDelete._id) {
        setSelectedLead(null);
      }
      setLeadToDelete(null);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      alert(apiErr.response?.data?.message || apiErr.message || "Failed to delete lead");
    } finally {
      setDeletingLead(false);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        (lead.email && lead.email.toLowerCase().includes(search.toLowerCase())) ||
        (lead.listingId?.title &&
          lead.listingId.title.toLowerCase().includes(search.toLowerCase())) ||
        (lead.spaceTitle &&
          lead.spaceTitle.toLowerCase().includes(search.toLowerCase())) ||
        (lead.vendorId?.businessName &&
          lead.vendorId.businessName.toLowerCase().includes(search.toLowerCase()));

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
      lost: leads.filter((l) => l.status === "lost").length,
    };
  }, [leads]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards (Mobile: 2 cols, Desktop: 5 cols) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3.5">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Inquiries
          </p>
          <p className="text-xl sm:text-2xl font-black text-[#0A1F66] mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200/60 shadow-2xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            New Leads
          </p>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{stats.new}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-blue-200/60 shadow-2xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            Contacted
          </p>
          <p className="text-xl sm:text-2xl font-black text-blue-600 mt-1">{stats.contacted}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-emerald-200/60 shadow-2xs">
          <p className="text-[10px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Converted
          </p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{stats.converted}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-rose-200/60 shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-[10px] sm:text-[11px] font-bold text-rose-700 uppercase tracking-wider">
            Lost / Closed
          </p>
          <p className="text-xl sm:text-2xl font-black text-rose-600 mt-1">{stats.lost}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
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

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#1E5BFF]"
            >
              <option value="all">All Statuses ({leads.length})</option>
              <option value="new">New ({stats.new})</option>
              <option value="contacted">Contacted ({stats.contacted})</option>
              <option value="converted">Converted ({stats.converted})</option>
              <option value="lost">Lost ({stats.lost})</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => fetchLeads(false)}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition active:scale-95"
            title="Refresh Leads Live"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#1E5BFF]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Leads Container via DataTableShell */}
      <DataTableShell
        loading={loading}
        skeletonRows={6}
        skeletonCols={6}
        isEmpty={filteredLeads.length === 0}
        emptyTitle="No property tour enquiries found"
        emptyDescription="Enquiries submitted on workspace listings will appear here in real-time."
        emptyIcon={<Building className="w-6 h-6 text-slate-400" />}
      >
        {/* Desktop View (>= 768px) */}
        <LeadsDesktopTable
          leads={filteredLeads}
          updatingStatusId={updatingStatusId}
          onUpdateStatus={handleUpdateStatus}
          onOpenDossier={(lead) => setSelectedLead(lead)}
          onOpenDelete={(lead) => setLeadToDelete(lead)}
        />

        {/* Mobile View (< 768px) */}
        <LeadsMobileCards
          leads={filteredLeads}
          updatingStatusId={updatingStatusId}
          onUpdateStatus={handleUpdateStatus}
          onOpenDossier={(lead) => setSelectedLead(lead)}
          onOpenDelete={(lead) => setLeadToDelete(lead)}
        />
      </DataTableShell>

      {/* Lead Detail & Management Dossier Modal */}
      <LeadDossierModal
        lead={selectedLead}
        newNoteText={newNoteText}
        submittingNote={submittingNote}
        updatingStatusId={updatingStatusId}
        onClose={() => setSelectedLead(null)}
        onNoteTextChange={setNewNoteText}
        onSubmitNote={handleAddNote}
        onUpdateStatus={handleUpdateStatus}
        onOpenDelete={(lead) => setLeadToDelete(lead)}
      />

      {/* Accessible Reusable Confirm Dialog for Lead Deletion */}
      <ConfirmDialog
        open={Boolean(leadToDelete)}
        title="Delete Enquiry Lead?"
        description={
          leadToDelete ? (
            <>
              Are you sure you want to permanently delete the lead from{" "}
              <strong>{leadToDelete.name}</strong> ({leadToDelete.phone})? This action cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deletingLead}
        onConfirm={handleDeleteLead}
        onCancel={() => setLeadToDelete(null)}
      />
    </div>
  );
}
