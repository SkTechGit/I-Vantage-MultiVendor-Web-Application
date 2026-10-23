"use client";

import React from "react";
import { Award, ShieldCheck, Clock, Users } from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

export default function ProfileStatsStrip({ professional }: Props) {
  const p = professional;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* Stat 1: Years Experience */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-4 flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E5BFF] shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base sm:text-lg font-black text-[#0A1F66] block leading-tight">
            {p.yearsExperience ? `${p.yearsExperience}+ Years` : "Senior Partner"}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">Advisory Practice</span>
        </div>
      </div>

      {/* Stat 2: Verified Body */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-4 flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-base sm:text-lg font-black text-[#0A1F66] block leading-tight truncate">
            {p.registrationBody || "Bar / ICAI"}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">Official Membership</span>
        </div>
      </div>

      {/* Stat 3: Response Speed */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-4 flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#C8942C] shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base sm:text-lg font-black text-[#0A1F66] block leading-tight">
            {p.responseTimeText || "< 4 Hours"}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">Average Response</span>
        </div>
      </div>

      {/* Stat 4: Client Reach */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-4 flex items-center gap-3.5 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base sm:text-lg font-black text-[#0A1F66] block leading-tight">
            100% Direct
          </span>
          <span className="text-[11px] font-semibold text-slate-500">Zero Middlemen</span>
        </div>
      </div>
    </div>
  );
}
