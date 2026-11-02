import React from "react";
import { HeroBannerSkeleton } from "@/components/common/Skeletons";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <HeroBannerSkeleton />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="h-5 w-28 rounded-full skeleton-shimmer-blue" />
            <div className="h-9 w-4/5 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-full rounded skeleton-shimmer opacity-70" />
            <div className="h-4 w-full rounded skeleton-shimmer opacity-70" />
            <div className="h-4 w-3/4 rounded skeleton-shimmer opacity-70" />
          </div>
          <div className="h-80 w-full rounded-3xl skeleton-shimmer shadow-sm" />
        </div>
      </div>
    </div>
  );
}
