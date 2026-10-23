"use client";

import React from "react";
import Link from "next/link";
import ProfessionalCard from "../listing/ProfessionalCard";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professionals: ProfessionalProfileItem[];
  categoryName?: string;
  categorySlug?: string;
}

export default function RelatedProfessionalsSection({
  professionals,
  categoryName = "Experts",
  categorySlug,
}: Props) {
  if (!professionals || professionals.length === 0) return null;

  return (
    <section className="space-y-6 pt-10 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Similar Practitioners</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight">
            More Verified {categoryName}
          </h2>
        </div>

        {categorySlug && (
          <Link
            href={`/professionals/category/${categorySlug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5BFF] hover:text-[#0A1F66] transition-colors"
          >
            <span>View All {categoryName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.slice(0, 3).map((pro) => (
          <ProfessionalCard key={pro._id} professional={pro} />
        ))}
      </div>
    </section>
  );
}
