"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ShieldCheck, ArrowRight, User } from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

export default function ProfessionalCard({ professional }: Props) {
  const p = professional;
  const categoryName = p.categoryId?.label || p.categoryId?.name || "Professional";
  const chips = Array.isArray(p.specializations) ? p.specializations.slice(0, 3) : [];
  const extraCount = Array.isArray(p.specializations) && p.specializations.length > 3 ? p.specializations.length - 3 : 0;

  return (
    <Link
      href={`/professionals/${p.slug}`}
      className="group flex flex-col justify-between rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-[0_1px_3px_rgba(10,31,102,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(10,31,102,0.14)] hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="space-y-4">
        {/* Header: Photo + Category + Name */}
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-2xs">
            {p.photoUrl ? (
              <Image
                src={p.photoUrl}
                alt={p.photoAlt || `Photo of ${p.fullName}, verified ${categoryName} in ${p.city}`}
                fill
                sizes="80px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0A1F66] text-white font-bold text-xl">
                {p.fullName ? p.fullName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
              {categoryName}
            </span>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base sm:text-lg font-black text-[#0A1F66] truncate group-hover:text-[#1E5BFF] transition-colors">
                {p.fullName}
              </h3>
              {p.verificationStatus === "VERIFIED" && (
                <span title="Verified Professional" className="inline-flex shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{p.city}{p.state ? `, ${p.state}` : ""}</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
          {p.headline}
        </p>

        {/* Specialization Chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {chips.map((chip, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold text-slate-700 bg-slate-100/80 border border-slate-200/70 px-2 py-0.5 rounded-md truncate max-w-[140px]"
              >
                {chip}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                +{extraCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / CTA Row */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          {p.consultationFeeInr ? (
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultation</span>
              <span className="font-extrabold text-[#0A1F66] text-sm">
                From ₹{p.consultationFeeInr.toLocaleString("en-IN")}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Available for consult</span>
          )}
        </div>

        <span className="inline-flex items-center gap-1 font-bold text-xs text-[#1E5BFF] group-hover:translate-x-0.5 transition-transform">
          <span>View Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
