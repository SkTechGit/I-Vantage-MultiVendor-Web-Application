"use client";

import React from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Service } from "@/modules/service/service.types";

interface Props {
  selectedServices: Service[];
  onOpenLeadForm: () => void;
}

export default function SelectedServicesFloatingBar({
  selectedServices,
  onOpenLeadForm,
}: Props) {
  if (selectedServices.length === 0) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 z-40 w-[calc(100%-24px)] sm:w-[calc(100%-32px)] max-w-md -translate-x-1/2 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <button
        type="button"
        onClick={onOpenLeadForm}
        className="group relative flex w-full items-center justify-between rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] px-3.5 py-2.5 sm:px-4.5 sm:py-3.5 text-white shadow-[0_12px_40px_rgba(10,31,102,0.4)] border border-white/20 hover:brightness-108 transition-all active:scale-[0.99] cursor-pointer"
        aria-label="Continue with selected services"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex h-8.5 w-8.5 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-white/15 text-white shadow-xs backdrop-blur-md">
            <ShoppingBag size={17} className="sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#F4A900] text-[9px] sm:text-[10px] font-black text-slate-900 shadow-xs ring-2 ring-[#0A1F66]">
              {selectedServices.length}
            </span>
          </div>

          <div className="text-left">
            <p className="text-xs sm:text-sm font-black tracking-tight text-white leading-tight">
              {selectedServices.length}{" "}
              {selectedServices.length === 1 ? "Service" : "Services"}{" "}
              Selected
            </p>
            <p className="text-[10.5px] sm:text-[11px] text-blue-100 font-medium">
              Continue to your details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 pl-2">
          <span className="hidden sm:inline-block text-xs font-bold text-white/90 group-hover:text-white transition">
            Continue &rarr;
          </span>
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white/15 group-hover:bg-white group-hover:text-[#0A1F66] transition">
            <ArrowRight size={13} className="sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </button>
    </div>
  );
}
