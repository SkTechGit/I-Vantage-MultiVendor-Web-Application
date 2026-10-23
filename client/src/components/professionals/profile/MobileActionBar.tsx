"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
  onBookClick?: () => void;
}

export default function MobileActionBar({ professional, onBookClick }: Props) {
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
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-3">
        {/* Fee Display */}
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Consultation
          </span>
          {p.consultationFeeInr ? (
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-[#0A1F66]">
                ₹{p.consultationFeeInr.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">/ session</span>
            </div>
          ) : (
            <span className="text-xs font-black text-[#0A1F66] truncate block">
              Custom Quote
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {p.contactMode === "direct" && p.contactWhatsapp && (
            <a
              href={`https://wa.me/${p.contactWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                `Hi ${p.fullName}, I found your verified profile on I-VANTAGE and would like to consult with you.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 active:scale-90 transition-transform"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          )}

          <button
            type="button"
            onClick={handleScrollToBooking}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-black shadow-sm active:scale-95 transition-transform"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Consult</span>
          </button>
        </div>
      </div>
    </div>
  );
}
