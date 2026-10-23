"use client";

import React from "react";
import { Video, Building, ArrowRight, CheckCircle2 } from "lucide-react";
import type { ProfessionalProfileItem, ServiceItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
  onSelectService?: (serviceTitle: string) => void;
}

export default function ProfileServicesGrid({ professional, onSelectService }: Props) {
  const p = professional;
  const services = Array.isArray(p.services) ? p.services.filter((s) => s.isActive !== false) : [];

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
          Services &amp; Advisory Fees
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Transparent pricing and engagement models for all corporate, statutory, and advisory needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s, idx) => (
          <div
            key={s._id || idx}
            className="flex flex-col justify-between rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all duration-200"
          >
            <div className="space-y-3">
              {/* Header: Mode Badge + Price */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {s.mode === "ONLINE" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Video className="w-3 h-3" />
                      Online / Video
                    </span>
                  )}
                  {s.mode === "IN_PERSON" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      <Building className="w-3 h-3" />
                      In-Person / Office
                    </span>
                  )}
                  {s.mode === "ONLINE_IN_PERSON" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Online &amp; In-Person
                    </span>
                  )}
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
                <h3 className="text-base font-black text-[#0A1F66] mb-1">
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] hover:text-[#0A1F66] transition-colors cursor-pointer group"
              >
                <span>Enquire for this service</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
