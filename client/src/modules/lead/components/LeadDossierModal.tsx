import React from "react";
import {
  X,
  Phone,
  MessageSquare,
  Mail,
  Trash2,
  Loader2,
  Send,
} from "lucide-react";
import {
  MarketplaceLeadItem,
  MarketplaceLeadStatus,
  STATUS_CONFIG,
} from "./lead.table.types";

export interface LeadDossierModalProps {
  lead: MarketplaceLeadItem | null;
  newNoteText: string;
  submittingNote: boolean;
  updatingStatusId: string | null;
  onClose: () => void;
  onNoteTextChange: (text: string) => void;
  onSubmitNote: (e: React.FormEvent) => void;
  onUpdateStatus: (id: string, status: MarketplaceLeadStatus) => void;
  onOpenDelete: (lead: MarketplaceLeadItem) => void;
}

export function LeadDossierModal({
  lead,
  newNoteText,
  submittingNote,
  updatingStatusId,
  onClose,
  onNoteTextChange,
  onSubmitNote,
  onUpdateStatus,
  onOpenDelete,
}: LeadDossierModalProps) {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0A1F66]">
              Enquiry Dossier
            </h3>
            <p className="text-[11px] text-slate-400">
              ID: {lead._id} • Received{" "}
              {new Date(lead.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions (Call, WhatsApp, Email) */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#1E5BFF] border border-slate-200/80 font-bold transition text-center"
          >
            <Phone className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
            <span>Call</span>
          </a>
          <a
            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `Hello ${lead.name}, thank you for inquiring about ${
                lead.listingId?.title || "our coworking space"
              } on i-VANTAGE Hub.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition text-center"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>WhatsApp</span>
          </a>
          {lead.email ? (
            <a
              href={`mailto:${lead.email}?subject=${encodeURIComponent(
                `Regarding your tour enquiry on ${lead.listingId?.title || "i-VANTAGE"}`
              )}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 sm:px-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#1E5BFF] border border-slate-200/80 font-bold transition text-center"
            >
              <Mail className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
              <span>Email</span>
            </a>
          ) : (
            <div className="flex items-center justify-center py-2.5 px-2 rounded-xl bg-slate-50 text-slate-300 border border-slate-200/50 font-medium text-center">
              No Email
            </div>
          )}
        </div>

        {/* Pipeline Stage Buttons */}
        <div className="bg-slate-50/80 p-3 sm:p-3.5 rounded-xl border border-slate-200/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Pipeline Stage</span>
            <span className="text-[11px] uppercase font-extrabold text-[#1E5BFF]">
              {lead.status}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {(["new", "contacted", "converted", "lost"] as const).map((st) => {
              const isActive = lead.status === st;
              const cfg = STATUS_CONFIG[st];

              return (
                <button
                  key={st}
                  type="button"
                  disabled={updatingStatusId === lead._id}
                  onClick={() => onUpdateStatus(lead._id, st)}
                  className={`py-2 px-1 rounded-lg text-[11px] font-bold uppercase transition flex items-center justify-center gap-1 border ${
                    isActive
                      ? `${cfg.badge} ${cfg.border} ring-2 ring-offset-1 ring-[#1E5BFF]`
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-2.5 sm:space-y-3 text-xs">
          <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Prospect Contact
            </span>
            <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
            <p className="text-slate-600">Phone: {lead.phone}</p>
            {lead.email && <p className="text-slate-600">Email: {lead.email}</p>}
          </div>

          <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Property & Partner
            </span>
            <p className="font-bold text-[#0A1F66]">
              {lead.listingId?.title || lead.spaceTitle || "Direct Space Enquiry"}
            </p>
            <p className="text-slate-600">
              Managing Partner:{" "}
              <strong>
                {lead.vendorId?.businessName ||
                  lead.vendorId?.name ||
                  "Direct / Platform"}
              </strong>
            </p>
            {lead.vendorId?.email && (
              <p className="text-slate-500">
                Partner Contact: {lead.vendorId.email}
              </p>
            )}
          </div>

          {lead.message && (
            <div className="bg-amber-50/60 border border-amber-200/60 p-3 sm:p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-amber-800 uppercase">
                Client Requirement / Note
              </span>
              <p className="text-slate-700 italic">&ldquo;{lead.message}&rdquo;</p>
            </div>
          )}

          {/* Internal Notes Section */}
          <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl space-y-2.5 border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#1E5BFF]" />
              Internal Activity & Team Notes ({lead.notes?.length || 0})
            </span>

            {/* Notes List */}
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {!lead.notes || lead.notes.length === 0 ? (
                <p className="text-slate-400 text-xs italic">
                  No internal notes recorded yet. Add updates from client calls or tour visits below.
                </p>
              ) : (
                lead.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-600">
                        {note.authorName || "Staff"}
                      </span>
                      <span>
                        {new Date(note.createdAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-slate-700">{note.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Input */}
            <form onSubmit={onSubmitNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Log client call, visit outcome, or seat quote..."
                value={newNoteText}
                onChange={(e) => onNoteTextChange(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#1E5BFF] bg-white"
              />
              <button
                type="submit"
                disabled={submittingNote || !newNoteText.trim()}
                className="px-3.5 py-2 rounded-lg bg-[#0A1F66] hover:bg-blue-950 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {submittingNote ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3 h-3" /> Log
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            type="button"
            onClick={() => onOpenDelete(lead)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Lead
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadDossierModal;
