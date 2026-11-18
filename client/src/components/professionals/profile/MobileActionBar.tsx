"use client";

import React from "react";
import { Calendar, Phone, Mail } from "lucide-react";
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
    const target =
      document.getElementById("consultation-section-mobile") ||
      document.getElementById("consultation-section") ||
      document.getElementById("sticky-lead-form-wrapper");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-2">
        {/* Fee Display */}
        <div className="min-w-0 pr-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
            Consultation
          </span>
          {p.consultationFeeInr ? (
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-sm font-black text-[#0A1F66]">
                ₹{p.consultationFeeInr.toLocaleString("en-IN")}
              </span>
              <span className="text-[9px] text-slate-500 font-medium">
                {p.consultationDurationMinutes ? `/${p.consultationDurationMinutes}m` : "/session"}
              </span>
            </div>
          ) : (
            <span className="text-xs font-black text-[#0A1F66] truncate block mt-0.5">
              Custom Quote
            </span>
          )}
        </div>

        {/* Action Buttons: Call, Email, and Book Consult */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Direct Call Button */}
          {p.contactPhone && (
            <a
              href={`tel:${p.contactPhone.replace(/\D/g, "")}`}
              aria-label="Call Professional"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] border border-blue-200/80 active:scale-90 transition-transform"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}

          {/* Direct Email Button */}
          {p.contactEmail && (
            <a
              href={`mailto:${p.contactEmail}`}
              aria-label="Email Professional"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 border border-slate-200 active:scale-90 transition-transform"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}

          {/* Direct WhatsApp Button (if available) */}
          {p.contactWhatsapp && (
            <a
              href={`https://wa.me/${p.contactWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                `Hi ${p.fullName}, I found your verified profile on I-VANTAGE and would like to consult with you.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 active:scale-90 transition-transform"
            >
              <FaWhatsapp className="w-4 h-4" />
            </a>
          )}

          {/* Primary Book Consult CTA */}
          <button
            type="button"
            onClick={handleScrollToBooking}
            className="flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-[#0A1F66] text-white text-xs font-black shadow-sm active:scale-95 transition-transform"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Consult</span>
          </button>
        </div>
      </div>
    </div>
  );
}
