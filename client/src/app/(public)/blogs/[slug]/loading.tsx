import React from "react";
import { HeroBannerSkeleton } from "@/components/common/Skeletons";

export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <HeroBannerSkeleton />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="aspect-video w-full rounded-3xl skeleton-shimmer shadow-sm" />
        <div className="space-y-4 pt-4">
          <div className="h-4 w-32 rounded skeleton-shimmer-blue" />
          <div className="h-8 w-4/5 rounded-xl skeleton-shimmer" />
          <div className="h-4 w-full rounded skeleton-shimmer opacity-70" />
          <div className="h-4 w-full rounded skeleton-shimmer opacity-70" />
          <div className="h-4 w-5/6 rounded skeleton-shimmer opacity-70" />
          <div className="h-4 w-3/4 rounded skeleton-shimmer opacity-70" />
        </div>
      </div>
    </div>
  );
}
