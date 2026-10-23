"use client";

import React from "react";
import {
  Clock,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Phone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
  onBookClick?: () => void;
}

export default function StickyBookingCard({ professional, onBookClick }: Props) {
  const p = professional;

  const handleScrollToBooking = () => {
    if (onBookClick) {
      onBookClick();
      return;
    }
    const target = document.getElementById("consultation-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-24 rounded-3xl bg-white border border-[#DCE5F5] p-6 shadow-[0_4px_20px_rgba(10,31,102,0.08)] space-y-6">
      {/* Top Pricing Header */}
      <div className="space-y-1.5 pb-5 border-b border-slate-100">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#1E5BFF] block">
          Consultation &amp; Advisory
        </span>
        <div className="flex items-baseline gap-1.5">
          {p.consultationFeeInr ? (
            <>
              <span className="text-2xl sm:text-3xl font-black text-[#0A1F66]">
                ₹{p.consultationFeeInr.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/ Session</span>
            </>
          ) : (
            <span className="text-xl sm:text-2xl font-black text-[#0A1F66]">
              Custom Advisory Quote
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Transparent fee for initial briefing, case analysis &amp; actionable advice.
        </p>
      </div>

      {/* Meta Features */}
      <div className="space-y-2.5 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-[#1E5BFF] shrink-0" />
          <span>
            Response SLA: <strong className="text-slate-800">{p.responseTimeText || "Within 2-4 Hours"}</strong>
          </span>
        </div>

        {p.consultationHours && (
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Available: <strong className="text-slate-800">{p.consultationHours}</strong>
            </span>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-800 font-medium">NDAs &amp; Confidentiality Protected</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={handleScrollToBooking}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#0A1F66] text-white text-sm font-black shadow-md hover:bg-[#1E5BFF] hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Consultation</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Direct Contact Options if contactMode is direct */}
        {p.contactMode === "direct" && (p.contactWhatsapp || p.contactPhone) && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            {p.contactWhatsapp && (
              <a
                href={`https://wa.me/${p.contactWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hi ${p.fullName}, I found your verified profile on I-VANTAGE and would like to consult with you.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <FaWhatsapp className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            )}

            {p.contactPhone && (
              <a
                href={`tel:${p.contactPhone.replace(/\D/g, "")}`}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold hover:bg-white hover:border-slate-300 transition-colors shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Call Direct</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Trust Pill Footer */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-[#C8942C]" />
          <span>I-VANTAGE DIRECT GUARANTEE</span>
        </div>
        <ul className="space-y-1.5 text-[11px] text-slate-500">
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Zero brokerage or commission markups</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Direct engagement with verified practitioner</span>
          </li>
          <li className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Option to meet in I-Vantage boardrooms</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
