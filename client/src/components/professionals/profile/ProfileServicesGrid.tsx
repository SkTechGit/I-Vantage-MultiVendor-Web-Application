"use client";

import React from "react";
import {
  Video,
  Building,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  FileText,
  Scale,
  Calculator,
  Landmark,
  Briefcase,
  Layers,
} from "lucide-react";
import type { ProfessionalProfileItem, ServiceItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
  onSelectService?: (serviceTitle: string) => void;
}

/**
 * Returns a relevant Lucide icon matching the service title.
 */
function getServiceIcon(title: string = "") {
  const t = title.toLowerCase();
  if (t.includes("registration") || t.includes("incorporat") || t.includes("setup")) {
    return <FileCheck className="w-5 h-5 text-[#1E5BFF]" />;
  }
  if (t.includes("return") || t.includes("filing") || t.includes("compliance") || t.includes("gstr")) {
    return <FileText className="w-5 h-5 text-[#1E5BFF]" />;
  }
  if (t.includes("reconcil") || t.includes("litigat") || t.includes("notice") || t.includes("dispute") || t.includes("legal")) {
    return <Scale className="w-5 h-5 text-[#1E5BFF]" />;
  }
  if (t.includes("bookkeeping") || t.includes("account") || t.includes("bank") || t.includes("ledger")) {
    return <Calculator className="w-5 h-5 text-[#1E5BFF]" />;
  }
  if (t.includes("tax") || t.includes("gst") || t.includes("tds")) {
    return <Landmark className="w-5 h-5 text-[#1E5BFF]" />;
  }
  return <CheckCircle2 className="w-5 h-5 text-[#1E5BFF]" />;
}

export default function ProfileServicesGrid({ professional, onSelectService }: Props) {
  const p = professional;

  // Active DB services
  const dbServices = Array.isArray(p.services)
    ? p.services.filter((s) => s.isActive !== false)
    : [];

  // If no DB services exist, dynamically synthesize fallback cards from specializations
  const services: ServiceItem[] =
    dbServices.length > 0
      ? dbServices
      : (p.specializations || []).slice(0, 4).map((spec, idx) => ({
          _id: `fallback-${idx}`,
          title: spec,
          slug: spec.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: `Professional advisory, statutory compliance, and documentation assistance for ${spec}.`,
          mode: "ONLINE_IN_PERSON",
          priceType: "FROM",
          priceInr: p.consultationFeeInr || 1000,
          sortOrder: idx + 1,
          isActive: true,
        }));

  const handleEnquireService = (title: string) => {
    if (onSelectService) {
      onSelectService(title);
    }
    const target = document.getElementById("consultation-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (services.length === 0) return null;

  return (
    <section id="services-section" className="space-y-6 pt-6 border-t border-slate-200">
      <div className="space-y-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
          Practice Offerings
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
          Services Offered
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Transparent pricing and direct engagement models for all corporate, statutory, and tax requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s, idx) => (
          <div
            key={s._id || idx}
            className="flex flex-col justify-between rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-2xs hover:shadow-md hover:border-[#1E5BFF]/60 transition-all duration-200 group"
          >
            <div className="space-y-3">
              {/* Header: Dynamic Icon + Mode Badge + Price */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center shrink-0 group-hover:bg-blue-100/70 transition-colors">
                    {getServiceIcon(s.title)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.mode === "ONLINE" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <Video className="w-3 h-3" />
                        Online
                      </span>
                    )}
                    {s.mode === "IN_PERSON" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        <Building className="w-3 h-3" />
                        In-Person
                      </span>
                    )}
                    {s.mode === "ONLINE_IN_PERSON" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        Online &amp; Office
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {s.priceType === "FROM" && s.priceInr ? (
                    <span className="text-sm font-black text-[#0A1F66]">
                      From ₹{s.priceInr.toLocaleString("en-IN")}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500">
                      Custom Quote
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-black text-[#0A1F66] mb-1 group-hover:text-[#1E5BFF] transition-colors">
                  {s.title}
                </h3>
                {s.description && (
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {s.description}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">
                1-on-1 Consultation
              </span>
              <button
                type="button"
                onClick={() => handleEnquireService(s.title)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] hover:text-[#0A1F66] transition-colors cursor-pointer group/btn"
              >
                <span>Enquire for this service</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
