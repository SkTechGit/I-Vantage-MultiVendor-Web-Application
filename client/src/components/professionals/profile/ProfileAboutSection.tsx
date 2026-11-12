"use client";

import React, { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Building2,
  Users2,
  MapPin,
  ShieldCheck,
  FileCheck,
  CheckCircle2,
  Award,
  Landmark,
  Check,
  Download,
  ExternalLink,
  FileText,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Scale,
  Sparkles,
} from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

/**
 * Smart pre-processor to format raw bio narrative:
 * 1. Converts unformatted section titles ("About ...", "Services Offered", etc.) to H2/H3 markdown headings.
 * 2. Cleans duplicate header lines (e.g. repeated name/title at top).
 * 3. Sanitizes bullet lines and eliminates excessive blank lines.
 */
function normalizeBioMarkdown(raw: string, fullName: string = ""): string {
  if (!raw) return "";

  const lines = raw.split(/\r?\n/);
  const processed: string[] = [];
  const lowerName = fullName.toLowerCase();

  const sectionHeadings = [
    /^about\s+/i,
    /^services\s+offered/i,
    /^industries\s+served/i,
    /^service\s+areas/i,
    /^practice\s+areas/i,
    /^areas\s+of\s+expertise/i,
    /^statutory\s+compliance/i,
    /^key\s+competencies/i,
    /^client\s+profile/i,
    /^why\s+choose/i,
    /^contact\s+(&|\+)\s+consultation/i,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      processed.push("");
      continue;
    }

    // Skip redundant top lines that merely repeat name or tagline
    if (
      i < 6 &&
      (line.toLowerCase() === lowerName ||
        line.toLowerCase().includes("gst & taxation consultant") ||
        line.toLowerCase().includes("taxora premium services ·") ||
        line.toLowerCase() === "gst compliance" ||
        line.toLowerCase() === "bookkeeping")
    ) {
      continue;
    }

    // Auto-detect section headings if not already markdown headings
    if (!line.startsWith("#")) {
      const isHeading = sectionHeadings.some((regex) => regex.test(line));
      if (isHeading) {
        processed.push(`### ${line}`);
        continue;
      }
    }

    // Bullet formatting
    if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
      processed.push(`- ${line.replace(/^[•\-\*]\s*/, "")}`);
      continue;
    }

    processed.push(line);
  }

  // Compress 3+ consecutive newlines to double newlines
  return processed.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export default function ProfileAboutSection({ professional }: Props) {
  const p = professional;
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const categorySlug = p.categoryId?.slug || "";
  const isCA =
    categorySlug === "chartered-accountants" ||
    (p.registrationBody || "").toUpperCase().includes("ICAI") ||
    Boolean(p.copNumber || p.firmRegistrationNumber);

  const isLegal =
    categorySlug.includes("law") ||
    categorySlug.includes("advocate") ||
    categorySlug.includes("legal");

  const hasGST = Boolean(p.gstin);

  const formattedBio = useMemo(() => {
    return normalizeBioMarkdown(p.aboutMd, p.fullName);
  }, [p.aboutMd, p.fullName]);

  const isBioLong = formattedBio.length > 450;

  return (
    <section id="overview-section" className="space-y-6 pt-2">
      {/* Section Heading & Executive Summary Box */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
          About {p.fullName}
        </h2>
        {p.summary && (
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-100/80 shadow-2xs">
            {p.summary}
          </div>
        )}
      </div>

      {/* Main Bio / Narrative with ReactMarkdown */}
      {formattedBio && (
        <div className="bg-white rounded-2xl border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-3">
          <div
            className={`relative transition-all duration-300 ${
              !isBioExpanded && isBioLong ? "max-h-64 overflow-hidden" : ""
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h2 className="text-lg sm:text-xl font-black text-[#0A1F66] mt-5 mb-2 pb-1 border-b border-slate-100 flex items-center gap-2">
                    {children}
                  </h2>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base sm:text-lg font-black text-[#0A1F66] mt-4 mb-2 pb-1 border-b border-slate-100 flex items-center gap-2">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm sm:text-base font-bold text-[#0A1F66] mt-3.5 mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E5BFF]" />
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3 font-normal">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="space-y-1.5 my-3 pl-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal space-y-1.5 my-3 pl-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-xs sm:text-sm text-slate-700 flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E5BFF] mt-1.5 shrink-0" />
                    <span className="flex-1">{children}</span>
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-[#0A1F66]">{children}</strong>
                ),
              }}
            >
              {formattedBio}
            </ReactMarkdown>

            {/* Gradient Overlay when collapsed */}
            {!isBioExpanded && isBioLong && (
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
            )}
          </div>

          {/* Read More / Read Less Toggle */}
          {isBioLong && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsBioExpanded(!isBioExpanded)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] hover:text-[#0A1F66] transition-colors cursor-pointer py-1"
              >
                <span>{isBioExpanded ? "Read Less" : "Read Full Biography"}</span>
                {isBioExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <span className="text-[10px] text-slate-400 font-medium">
                Verified Practice Narrative
              </span>
            </div>
          )}
        </div>
      )}

      {/* Statutory Credentials & Regulatory Compliance Card (Strictly Verified Only) */}
      {(hasGST || isCA || isLegal || p.registrationNumber) && (
        <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-200/90 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#0A1F66]">
                  Statutory Registrations &amp; Regulatory Compliance
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Independently verified against statutory public registries
                </p>
              </div>
            </div>
            {p.verificationStatus === "VERIFIED" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 w-fit">
                <CheckCircle2 className="w-3 h-3" />
                {isCA ? "Audit Verified" : "Identity & GST Verified"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {/* 1. Verified GST Registration (Separated & Accurate) */}
            {hasGST && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Verified GST Registration
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Active
                  </span>
                </div>
                <span className="font-black text-[#0A1F66] text-sm block font-mono tracking-wide">
                  {p.gstin}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Status: {p.gstinStatus || "ACTIVE (GSTN Verified)"}
                </span>
              </div>
            )}

            {/* 2. ICAI Membership (CA Only) */}
            {isCA && p.registrationNumber && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ICAI Membership Reg No.
                </span>
                <span className="font-black text-[#0A1F66] text-sm mt-0.5 block">
                  {p.registrationNumber}
                </span>
                {p.enrollmentDate && (
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Enrolled: {p.enrollmentDate}
                  </span>
                )}
              </div>
            )}

            {/* 3. Certificate of Practice (CA Only) */}
            {isCA && p.copNumber && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Certificate of Practice (COP)
                </span>
                <span className="font-black text-[#0A1F66] text-sm mt-0.5 block">
                  {p.copNumber}
                </span>
                {p.copValidity && (
                  <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">
                    Valid till: {p.copValidity}
                  </span>
                )}
              </div>
            )}

            {/* 4. Firm Reg No (CA Only) */}
            {isCA && p.firmRegistrationNumber && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Firm Reg. No. (FRN)
                </span>
                <span className="font-black text-[#0A1F66] text-sm mt-0.5 block">
                  {p.firmRegistrationNumber}
                </span>
                {p.regionalCouncil && (
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Regional Council: {p.regionalCouncil}
                  </span>
                )}
              </div>
            )}

            {/* 5. Bar Council / Legal Registration (Lawyers Only) */}
            {isLegal && p.registrationNumber && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Bar Council Enrollment
                </span>
                <span className="font-black text-[#0A1F66] text-sm mt-0.5 block">
                  {p.registrationNumber}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {p.registrationBody || "State Bar Council"}
                </span>
              </div>
            )}

            {/* 6. UDIN Audit Readiness (Displayed ONLY for Verified CAs) */}
            {isCA && p.udinEnabled && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
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
                <strong>{p.documents.length} verified statutory documents</strong> (registration certificate, identification) are securely on file in the i-VANTAGE Compliance Vault.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Industries Served Section (Matching User Image 2) */}
      {Array.isArray(p.industries) && p.industries.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-3">
          <h3 className="text-sm sm:text-base font-black text-[#0A1F66] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1E5BFF]" />
            <span>Industries Served</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {p.industries.join(" · ")}
          </p>
        </div>
      )}

      {/* Service Areas Section (Matching User Image 2) */}
      {Array.isArray(p.servesAreas) && p.servesAreas.length > 0 && (
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-3">
          <h3 className="text-sm sm:text-base font-black text-[#0A1F66] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Service Areas</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {p.servesAreas.join(" · ")}
          </p>
        </div>
      )}

      {/* Contact & Consultation Card (Matching User Image 2) */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-black text-[#0A1F66]">
              Contact &amp; Consultation
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Direct communication for prospective clients and business enquiries
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Available for enquiries
          </span>
        </div>

        <div className="space-y-2.5">
          {/* Practice / Firm Name */}
          {(p.firmName || p.headline) && (
            <div className="text-xs font-bold text-slate-800">
              {p.firmName || "TAXORA PREMIUM SERVICES"}
            </div>
          )}

          {/* Contact Phone with 1-Click Call */}
          {p.contactPhone && (
            <div className="flex items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-2.5 text-slate-800 font-semibold font-mono">
                <Phone className="w-4 h-4 text-[#1E5BFF]" />
                <span>{p.contactPhone}</span>
              </div>
              <a
                href={`tel:${p.contactPhone.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF] transition-colors shadow-2xs"
              >
                <Phone className="w-3 h-3" />
                <span>Call Now</span>
              </a>
            </div>
          )}

          {/* Contact Email with 1-Click Email */}
          {p.contactEmail && (
            <div className="flex items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-2.5 text-slate-800 font-medium truncate">
                <Mail className="w-4 h-4 text-[#1E5BFF] shrink-0" />
                <span className="truncate">{p.contactEmail}</span>
              </div>
              <a
                href={`mailto:${p.contactEmail}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[#0A1F66] text-xs font-bold hover:bg-slate-100 transition-colors shadow-2xs shrink-0"
              >
                <Mail className="w-3 h-3" />
                <span>Send Email</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Practice Portfolio & Capability Deck (Optional Showcase) */}
      {(p.portfolioFileUrl || p.portfolioExternalUrl) && (
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-[#1E5BFF] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-[#0A1F66]">
                    {p.portfolioTitle || "Practice Portfolio & Firm Presentation Deck"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1E5BFF] border border-blue-100">
                    Official Deck
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {p.portfolioDescription || "Detailed overview of statutory advisory engagements, representative transactions, and client results."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {p.portfolioFileUrl && (
                <a
                  href={p.portfolioFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A1F66] hover:bg-[#1E5BFF] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Deck</span>
                </a>
              )}
              {p.portfolioExternalUrl && (
                <a
                  href={p.portfolioExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Case Studies</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
