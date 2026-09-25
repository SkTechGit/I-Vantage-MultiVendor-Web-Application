"use client";

import React, { useState } from "react";
import LeadTable from "@/modules/lead/components/LeadTable";
import MarketplaceLeadsTable from "@/modules/lead/components/MarketplaceLeadsTable";
import { Building2, MessageSquare, Sparkles } from "lucide-react";

export default function AdminLeadsPage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "general">("marketplace");

  return (
    <div className="space-y-6">
      {/* Header & Tab Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1E5BFF]/10 text-[#1E5BFF] mb-1.5">
            <Sparkles className="w-3 h-3" /> Lead Intelligence Center
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
            Customer Inquiries & Leads
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming coworking tour requests and general platform communications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "marketplace"
                ? "bg-white text-[#0A1F66] shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#1E5BFF]" />
            <span>Marketplace Tours</span>
          </button>

          <button
            onClick={() => setActiveTab("general")}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "general"
                ? "bg-white text-[#0A1F66] shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#F4A900]" />
            <span>General Enquiries</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "marketplace" ? (
        <MarketplaceLeadsTable />
      ) : (
        <LeadTable />
      )}
    </div>
  );
}