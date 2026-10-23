"use client";

import React from "react";

export default function CardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-[0_1px_3px_rgba(10,31,102,0.06)] animate-pulse">
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-5 w-36 bg-slate-200 rounded" />
            <div className="h-3.5 w-24 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Headline Skeleton */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3.5 w-full bg-slate-200 rounded" />
          <div className="h-3.5 w-4/5 bg-slate-200 rounded" />
        </div>

        {/* Chips Skeleton */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <div className="h-5 w-20 bg-slate-100 rounded-md" />
          <div className="h-5 w-24 bg-slate-100 rounded-md" />
          <div className="h-5 w-16 bg-slate-100 rounded-md" />
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="h-4 w-20 bg-slate-200 rounded" />
      </div>
    </div>
  );
}
