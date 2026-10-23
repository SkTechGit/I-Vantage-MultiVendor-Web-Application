"use client";

import React from "react";
import { Info, ShieldAlert } from "lucide-react";

export default function ProfileDisclaimer() {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 sm:p-5 text-xs text-slate-500 space-y-2 mt-10">
      <div className="flex items-center gap-1.5 font-bold text-slate-700">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>Professional Standards &amp; Regulatory Disclaimer</span>
      </div>
      <p className="leading-relaxed">
        I-VANTAGE Business Hub operates as an enterprise discovery and infrastructure platform facilitating connections between clients and verified professionals. All advisory, audit, tax, and legal services are rendered solely and independently by qualified practitioners subject to the professional code of ethics established by the Institute of Chartered Accountants of India (ICAI), the Bar Council of India, or other statutory bodies. I-VANTAGE does not dispense direct legal or chartered accountancy services.
      </p>
    </div>
  );
}
