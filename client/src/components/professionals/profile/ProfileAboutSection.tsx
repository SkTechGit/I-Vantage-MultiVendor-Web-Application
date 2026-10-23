"use client";

import React from "react";
import { Building2, Users2, MapPin } from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

export default function ProfileAboutSection({ professional }: Props) {
  const p = professional;

  return (
    <section id="overview-section" className="space-y-6 pt-2">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
          About {p.fullName}
        </h2>
        {p.summary && (
          <p className="text-sm text-slate-700 leading-relaxed font-medium bg-blue-50/40 p-4 rounded-2xl border border-blue-100/70">
            {p.summary}
          </p>
        )}
      </div>

      {/* Main Bio / Narrative */}
      {p.aboutMd && (
        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {p.aboutMd}
        </div>
      )}

      {/* Industries & Client Types Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Industries Served */}
        {Array.isArray(p.industries) && p.industries.length > 0 && (
          <div className="rounded-2xl bg-white border border-[#DCE5F5] p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A1F66]">
              <Building2 className="w-4 h-4 text-[#1E5BFF]" />
              <span>Target Industry Sectors</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.industries.map((ind, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Client Types */}
        {Array.isArray(p.clientTypes) && p.clientTypes.length > 0 && (
          <div className="rounded-2xl bg-white border border-[#DCE5F5] p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A1F66]">
              <Users2 className="w-4 h-4 text-emerald-600" />
              <span>Client Profiles</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.clientTypes.map((client, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60"
                >
                  {client}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Serving Geographic Areas */}
      {Array.isArray(p.servesAreas) && p.servesAreas.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-700">Jurisdictions &amp; Active Areas:</span>
          <span>{p.servesAreas.join(" • ")}</span>
        </div>
      )}
    </section>
  );
}
