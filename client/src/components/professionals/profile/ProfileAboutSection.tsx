"use client";

import React from "react";
import { Building2, Users2, MapPin, ShieldCheck, FileCheck, CheckCircle2, Award, Landmark, Check } from "lucide-react";
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

      {/* Statutory Credentials & Regulatory Compliance Card */}
      {(p.registrationNumber || p.copNumber || p.firmRegistrationNumber || p.gstin || p.udinEnabled || (p.documents && p.documents.length > 0)) && (
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/90 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#0A1F66]">
                  Statutory Registrations &amp; Regulatory Compliance
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified against ICAI / Bar Council / GSTN &amp; MCA public registries
                </p>
              </div>
            </div>
            {p.verificationStatus === "VERIFIED" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 w-fit">
                <CheckCircle2 className="w-3 h-3" />
                Audit Verified
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {p.registrationNumber && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {p.registrationBody || "ICAI / Bar"} Reg No.
                </span>
                <span className="font-black text-slate-800 text-sm mt-0.5 block">
                  {p.registrationNumber}
                </span>
                {p.enrollmentDate && (
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Enrolled: {p.enrollmentDate}
                  </span>
                )}
              </div>
            )}

            {p.copNumber && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Certificate of Practice (COP)
                </span>
                <span className="font-black text-slate-800 text-sm mt-0.5 block">
                  {p.copNumber}
                </span>
                {p.copValidity && (
                  <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
                    Valid till: {p.copValidity}
                  </span>
                )}
              </div>
            )}

            {p.firmRegistrationNumber && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Firm Reg. No. (FRN)
                </span>
                <span className="font-black text-slate-800 text-sm mt-0.5 block">
                  {p.firmRegistrationNumber}
                </span>
                {p.regionalCouncil && (
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Regional Council: {p.regionalCouncil}
                  </span>
                )}
              </div>
            )}

            {p.gstin && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  GSTIN Registration
                </span>
                <span className="font-black text-slate-800 text-sm mt-0.5 block font-mono">
                  {p.gstin}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
                  Status: {p.gstinStatus || "ACTIVE"}
                </span>
              </div>
            )}

            {p.panMasked && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PAN Identification
                </span>
                <span className="font-black text-slate-800 text-sm mt-0.5 block font-mono">
                  {p.panMasked}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Masked for Confidentiality
                </span>
              </div>
            )}

            {p.udinEnabled && (
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  UDIN Audit Readiness
                </span>
                <div className="flex items-center gap-1 mt-0.5 text-emerald-700 font-bold text-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Aadhaar Seeded &amp; UDIN Active</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Eligible for statutory certifications
                </span>
              </div>
            )}
          </div>

          {/* Document Vault Notice */}
          {Array.isArray(p.documents) && p.documents.length > 0 && (
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-600">
              <FileCheck className="w-4 h-4 text-[#1E5BFF] shrink-0" />
              <span>
                <strong>{p.documents.length} verified statutory documents</strong> (COP, membership, certificates) are securely on file in the i-VANTAGE Compliance Vault.
              </span>
            </div>
          )}
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
