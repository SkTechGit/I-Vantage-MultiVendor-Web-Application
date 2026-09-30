import React from "react";
import { Phone, MessageSquare, Trash2, ChevronDown, Loader2 } from "lucide-react";
import {
  MarketplaceLeadItem,
  MarketplaceLeadStatus,
  STATUS_CONFIG,
} from "./lead.table.types";

export interface LeadsMobileCardsProps {
  leads: MarketplaceLeadItem[];
  updatingStatusId: string | null;
  onUpdateStatus: (id: string, status: MarketplaceLeadStatus) => void;
  onOpenDossier: (lead: MarketplaceLeadItem) => void;
  onOpenDelete: (lead: MarketplaceLeadItem) => void;
}

export function LeadsMobileCards({
  leads,
  updatingStatusId,
  onUpdateStatus,
  onOpenDossier,
  onOpenDelete,
}: LeadsMobileCardsProps) {
  return (
    <div className="block md:hidden divide-y divide-slate-100">
      {leads.map((item) => {
        const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
        const isUpdating = updatingStatusId === item._id;

        return (
          <div key={item._id} className="p-3.5 space-y-2.5 hover:bg-slate-50/60 transition">
            {/* Top: Prospect & Call/WhatsApp quick buttons */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                  <Phone className="w-3 h-3 text-[#1E5BFF] shrink-0" />
                  <a href={`tel:${item.phone}`} className="hover:underline font-semibold">
                    {item.phone}
                  </a>
                </div>
                {item.email && (
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.email}</p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`tel:${item.phone}`}
                  className="p-2 rounded-xl bg-blue-50 text-[#1E5BFF] hover:bg-blue-100 transition active:scale-95"
                  title="Call Prospect"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${item.name}, thank you for inquiring on i-VANTAGE Hub.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition active:scale-95"
                  title="WhatsApp Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Property & Partner */}
            <div className="bg-slate-50 p-2 rounded-lg text-xs space-y-0.5 border border-slate-100">
              <p className="font-semibold text-slate-800 line-clamp-1 text-[11px]">
                {item.listingId?.title || item.spaceTitle || "Direct Space Enquiry"}
              </p>
              <p className="text-[10px] text-slate-500">
                Partner:{" "}
                <span className="font-bold text-[#0A1F66]">
                  {item.vendorId?.businessName || item.vendorId?.name || "Direct / Admin"}
                </span>
              </p>
            </div>

            {/* Status & Actions Row */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <div className="relative inline-block">
                <select
                  disabled={isUpdating}
                  value={item.status}
                  onChange={(e) =>
                    onUpdateStatus(
                      item._id,
                      e.target.value as MarketplaceLeadStatus
                    )
                  }
                  className={`appearance-none cursor-pointer pl-2.5 pr-6 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border outline-none transition focus:ring-2 focus:ring-[#1E5BFF]/30 disabled:opacity-60 ${cfg.badge} ${cfg.border}`}
                >
                  <option value="new">● New</option>
                  <option value="contacted">● Contacted</option>
                  <option value="converted">● Converted</option>
                  <option value="lost">● Lost</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                  {isUpdating ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-slate-500" />
                  ) : (
                    <ChevronDown className="w-2.5 h-2.5 text-slate-500" />
                  )}
                </div>
              </div>

              <span className="text-[10px] text-slate-400">
                {new Date(item.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onOpenDossier(item)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#1E5BFF] text-slate-700 font-bold transition text-[11px]"
                >
                  Details
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDelete(item)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                  title="Delete Lead"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LeadsMobileCards;
