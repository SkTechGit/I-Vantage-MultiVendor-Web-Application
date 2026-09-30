import React from "react";
import { Phone, Eye, Trash2, ChevronDown, Loader2 } from "lucide-react";
import {
  MarketplaceLeadItem,
  MarketplaceLeadStatus,
  STATUS_CONFIG,
} from "./lead.table.types";

export interface LeadsDesktopTableProps {
  leads: MarketplaceLeadItem[];
  updatingStatusId: string | null;
  onUpdateStatus: (id: string, status: MarketplaceLeadStatus) => void;
  onOpenDossier: (lead: MarketplaceLeadItem) => void;
  onOpenDelete: (lead: MarketplaceLeadItem) => void;
}

export function LeadsDesktopTable({
  leads,
  updatingStatusId,
  onUpdateStatus,
  onOpenDossier,
  onOpenDelete,
}: LeadsDesktopTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
          <tr>
            <th className="py-3 px-4">Client / Prospect</th>
            <th className="py-3 px-4">Property / Space</th>
            <th className="py-3 px-4">Space Partner (Vendor)</th>
            <th className="py-3 px-4">Status & Pipeline</th>
            <th className="py-3 px-4">Enquiry Date</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {leads.map((item) => {
            const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
            const isUpdating = updatingStatusId === item._id;

            return (
              <tr key={item._id} className="hover:bg-slate-50/60 transition-colors">
                {/* Client / Prospect */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-[#1E5BFF]" />
                    <a
                      href={`tel:${item.phone}`}
                      className="hover:underline text-slate-600 font-semibold"
                    >
                      {item.phone}
                    </a>
                  </div>
                  {item.email && (
                    <div className="text-slate-400 text-[11px] truncate max-w-[180px] mt-0.5">
                      {item.email}
                    </div>
                  )}
                </td>

                {/* Property / Space */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-800 line-clamp-1">
                    {item.listingId?.title || item.spaceTitle || "Direct Space Enquiry"}
                  </div>
                  {(item.listingId?.location || item.spaceLocation) && (
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      {item.listingId?.location
                        ? `${item.listingId.location.area || item.listingId.location.city || ""}`
                        : item.spaceLocation}
                    </div>
                  )}
                </td>

                {/* Space Partner */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#0A1F66]">
                    {item.vendorId?.businessName || item.vendorId?.name || "Direct / Admin"}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {item.vendorId?.email || "Platform"}
                  </div>
                </td>

                {/* Interactive Status Dropdown */}
                <td className="py-3.5 px-4">
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
                      className={`appearance-none cursor-pointer pl-3 pr-7 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border outline-none transition focus:ring-2 focus:ring-[#1E5BFF]/30 disabled:opacity-60 ${cfg.badge} ${cfg.border}`}
                    >
                      <option value="new">● New</option>
                      <option value="contacted">● Contacted</option>
                      <option value="converted">● Converted</option>
                      <option value="lost">● Lost</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      {isUpdating ? (
                        <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  </div>
                </td>

                {/* Enquiry Date */}
                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenDossier(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#1E5BFF] text-slate-700 font-bold transition text-xs"
                      title="View Enquiry Dossier"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenDelete(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LeadsDesktopTable;
