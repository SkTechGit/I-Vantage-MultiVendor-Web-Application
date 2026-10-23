"use client";

import React from "react";
import { UserX, RotateCcw } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export default function EmptyState({
  title = "No professionals found",
  description = "We couldn't find any verified professionals matching your current search criteria or filters. Try adjusting your search keywords, location, or category.",
  onReset,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 max-w-xl mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E5BFF] mb-4 shadow-2xs">
        <UserX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-black text-[#0A1F66] mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F66] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1E5BFF] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
}
