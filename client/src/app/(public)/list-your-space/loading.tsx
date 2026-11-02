import React from "react";
import { HeroBannerSkeleton } from "@/components/common/Skeletons";

export default function ListSpaceLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <HeroBannerSkeleton />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-2xs space-y-6">
          <div className="h-8 w-64 rounded-xl skeleton-shimmer" />
          <div className="h-4 w-96 rounded skeleton-shimmer opacity-70" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
          </div>
          <div className="h-32 w-full rounded-2xl skeleton-shimmer" />
          <div className="h-12 w-full rounded-xl skeleton-shimmer-blue" />
        </div>
      </div>
    </div>
  );
}
