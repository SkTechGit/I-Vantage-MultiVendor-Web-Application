"use client";

import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

export default function ProfileExpertiseSection({ professional }: Props) {
  const p = professional;
  const expertiseList = Array.isArray(p.expertise) ? p.expertise : [];
  const specializations = Array.isArray(p.specializations) ? p.specializations : [];

  if (expertiseList.length === 0 && specializations.length === 0) return null;

  return (
    <section id="expertise-section" className="space-y-6 pt-6 border-t border-slate-200">
      <div className="space-y-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
          Core Competencies
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
          Key Expertise &amp; Specializations
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          In-depth domain expertise backed by statutory qualifications and real-world track record.
        </p>
      </div>

      {/* Specialization Tags Strip */}
      {specializations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {specializations.map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs font-bold text-[#0A1F66] shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1E5BFF]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Expertise Items */}
      {expertiseList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {expertiseList.map((item, idx) => (
            <div
              key={item._id || idx}
              className="rounded-2xl bg-white border border-[#DCE5F5] p-4 space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <h3 className="text-sm font-black text-[#0A1F66]">
                  {item.title}
                </h3>
              </div>
              {item.description && (
                <p className="text-xs text-slate-600 leading-relaxed pl-6 font-normal">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
