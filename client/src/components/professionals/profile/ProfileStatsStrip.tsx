"use client";

import React from "react";
import { Award, ShieldCheck, Clock, Users } from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

/**
 * Extracts a concise, high-impact metric label from the response time text
 * so it never wraps across 4-5 lines.
 * e.g. "Usually responds within one business day" -> "< 24 Hours"
 */
function formatResponseSpeed(raw?: string): string {
  if (!raw) return "< 4 Hours";
  const lower = raw.toLowerCase().trim();

  if (
    lower.includes("business day") ||
    lower.includes("24 hour") ||
    lower.includes("24hr") ||
    lower.includes("one day") ||
    lower.includes("1 day")
  ) {
    return "< 24 Hours";
  }

  if (
    lower.includes("instant") ||
    lower.includes("immediate") ||
    lower.includes("15 min") ||
    lower.includes("30 min") ||
    lower.includes("1 hour") ||
    lower.includes("1hr")
  ) {
    return "< 1 Hour";
  }

  if (lower.includes("hour") || lower.includes("hr")) {
    const match = raw.match(/\d+(?:-\d+)?\s*(?:hours?|hrs?)/i);
    if (match) {
      return match[0].replace(/hours?/i, "Hours").replace(/hrs?/i, "Hours");
    }
    return "< 4 Hours";
  }

  if (raw.length > 16) {
    return "< 24 Hours";
  }

  return raw;
}

/**
 * Returns an accurate verification body title tailored to the professional's category.
 * Prevents showing "Bar / ICAI" for GST/Tax consultants.
 */
function getVerifiedBodyInfo(p: ProfessionalProfileItem): { title: string; subtitle: string } {
  const categorySlug = p.categoryId?.slug || "";
  const regBody = (p.registrationBody || "").trim();

  if (p.gstin) {
    return { title: "GST Verified", subtitle: "Active Registration" };
  }

  if (
    categorySlug === "chartered-accountants" ||
    regBody.toUpperCase().includes("ICAI") ||
    Boolean(p.copNumber || p.firmRegistrationNumber)
  ) {
    return { title: regBody || "ICAI Member", subtitle: "Official Membership" };
  }

  if (
    categorySlug.includes("law") ||
    categorySlug.includes("advocate") ||
    categorySlug.includes("legal") ||
    regBody.toUpperCase().includes("BAR")
  ) {
    return { title: regBody || "Bar Council", subtitle: "Enrolled Advocate" };
  }

  if (categorySlug.includes("secretary") || regBody.toUpperCase().includes("ICSI")) {
    return { title: "ICSI Member", subtitle: "Company Secretary" };
  }

  if (p.verificationStatus === "VERIFIED") {
    return { title: "Verified Pro", subtitle: "Statutory Registry" };
  }

  return { title: "Verified Partner", subtitle: "i-VANTAGE Network" };
}

export default function ProfileStatsStrip({ professional }: Props) {
  const p = professional;

  const responseMetric = formatResponseSpeed(p.responseTimeText);
  const verifiedBody = getVerifiedBodyInfo(p);

  const experienceText =
    p.yearsExperience && p.yearsExperience > 0
      ? `${p.yearsExperience}+ Years`
      : p.designation || "Senior Advisor";

  const experienceSubtitle =
    p.yearsExperience && p.yearsExperience > 0 ? "Practice Experience" : "Advisory Practice";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {/* Stat 1: Years Experience / Senior Partner */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 shadow-2xs min-w-0 h-full">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-[#1E5BFF] shrink-0">
          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs sm:text-sm lg:text-base font-black text-[#0A1F66] block leading-tight truncate">
            {experienceText}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate mt-0.5">
            {experienceSubtitle}
          </span>
        </div>
      </div>

      {/* Stat 2: Verified Body (Category-tailored) */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 shadow-2xs min-w-0 h-full">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-emerald-600 shrink-0">
          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs sm:text-sm lg:text-base font-black text-[#0A1F66] block leading-tight truncate">
            {verifiedBody.title}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate mt-0.5">
            {verifiedBody.subtitle}
          </span>
        </div>
      </div>

      {/* Stat 3: Response Speed (Concise Metric - No Multi-Line Overwrapping) */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 shadow-2xs min-w-0 h-full">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-100/80 flex items-center justify-center text-[#C8942C] shrink-0">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs sm:text-sm lg:text-base font-black text-[#0A1F66] block leading-tight truncate">
            {responseMetric}
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate mt-0.5">
            Average Response
          </span>
        </div>
      </div>

      {/* Stat 4: Client Reach / Direct Engagement */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 shadow-2xs min-w-0 h-full">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shrink-0">
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs sm:text-sm lg:text-base font-black text-[#0A1F66] block leading-tight truncate">
            100% Direct
          </span>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 block truncate mt-0.5">
            Zero Middlemen
          </span>
        </div>
      </div>
    </div>
  );
}
