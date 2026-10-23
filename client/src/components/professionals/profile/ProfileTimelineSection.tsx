"use client";

import React, { useState } from "react";
import { Briefcase, GraduationCap, Award, Calendar } from "lucide-react";
import type { ProfessionalProfileItem, ExperienceItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

export default function ProfileTimelineSection({ professional }: Props) {
  const p = professional;
  const items = Array.isArray(p.experience) ? p.experience : [];
  const [activeFilter, setActiveFilter] = useState<"ALL" | "WORK" | "EDUCATION" | "CERTIFICATION">("ALL");

  if (items.length === 0) return null;

  const filteredItems = items.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.kind === activeFilter;
  });

  const getIcon = (kind: string) => {
    switch (kind) {
      case "EDUCATION":
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case "CERTIFICATION":
        return <Award className="w-4 h-4 text-[#C8942C]" />;
      default:
        return <Briefcase className="w-4 h-4 text-[#1E5BFF]" />;
    }
  };

  return (
    <section id="credentials-section" className="space-y-6 pt-6 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
            Track Record &amp; Pedigree
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
            Experience &amp; Education
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          {(["ALL", "WORK", "EDUCATION", "CERTIFICATION"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeFilter === filter
                  ? "bg-white text-[#0A1F66] shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {filter === "ALL" ? "All" : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6 ml-2 sm:ml-3">
        {filteredItems.map((item, idx) => (
          <div key={item._id || idx} className="relative group">
            {/* Timeline Dot with Icon */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
              {getIcon(item.kind)}
            </div>

            <div className="rounded-2xl bg-white border border-[#DCE5F5] p-4 sm:p-5 shadow-2xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-sm sm:text-base font-black text-[#0A1F66]">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {item.startYear} — {item.endYear ? item.endYear : "Present"}
                  </span>
                </div>
              </div>

              {(item.organization || item.location) && (
                <div className="text-xs font-semibold text-[#1E5BFF]">
                  {item.organization}
                  {item.location ? ` • ${item.location}` : ""}
                </div>
              )}

              {item.description && (
                <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
