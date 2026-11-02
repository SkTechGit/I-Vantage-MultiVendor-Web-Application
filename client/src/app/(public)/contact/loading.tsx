import React from "react";
import { HeroBannerSkeleton } from "@/components/common/Skeletons";

export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <HeroBannerSkeleton />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 w-36 rounded-full skeleton-shimmer-blue" />
            <div className="h-9 w-4/5 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-full rounded skeleton-shimmer opacity-70" />
            <div className="space-y-3 pt-6">
              <div className="h-14 w-full rounded-2xl skeleton-shimmer" />
              <div className="h-14 w-full rounded-2xl skeleton-shimmer" />
              <div className="h-14 w-full rounded-2xl skeleton-shimmer" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-28 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer-blue" />
          </div>
        </div>
      </div>
    </div>
  );
}
