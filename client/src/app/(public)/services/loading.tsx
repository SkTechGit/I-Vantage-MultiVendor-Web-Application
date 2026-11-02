import React from "react";
import { HeroBannerSkeleton, WorkspaceGridSkeleton } from "@/components/common/Skeletons";

export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <HeroBannerSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="h-5 w-32 rounded-full skeleton-shimmer-blue mx-auto" />
          <div className="h-9 w-3/4 rounded-xl skeleton-shimmer mx-auto" />
          <div className="h-4 w-1/2 rounded skeleton-shimmer opacity-70 mx-auto" />
        </div>
        <WorkspaceGridSkeleton count={4} columns={4} />
      </div>
    </div>
  );
}
