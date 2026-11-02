import React from "react";

/**
 * Top Hero Banner Skeleton - Matches user screenshot
 * Deep navy/indigo gradient with centered shimmering pill bars
 */
export function HeroBannerSkeleton({
  title = true,
  subtitle = true,
  badge = true,
}: {
  title?: boolean;
  subtitle?: boolean;
  badge?: boolean;
}) {
  return (
    <div className="relative w-full bg-gradient-to-r from-[#071330] via-[#0A1F66] to-[#0D2880] py-12 sm:py-16 px-4 overflow-hidden border-b border-blue-900/30">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,91,255,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4 text-center relative z-10">
        {badge && (
          <div className="h-6 w-36 rounded-full skeleton-shimmer-dark shadow-xs" />
        )}
        {title && (
          <div className="h-10 sm:h-12 w-3/4 max-w-xl rounded-2xl skeleton-shimmer-dark shadow-sm" />
        )}
        {subtitle && (
          <div className="h-5 sm:h-6 w-1/2 max-w-md rounded-xl skeleton-shimmer-dark opacity-80" />
        )}
      </div>
    </div>
  );
}

/**
 * Horizontal Category Filter Pills Skeleton
 * Row of horizontal rounded rectangles with subtle shimmer
 */
export function CategoryPillsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="w-full bg-white border-b border-slate-100 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`h-10 rounded-xl skeleton-shimmer shrink-0 shadow-2xs ${
              i === 0 ? "w-28 skeleton-shimmer-blue" : "w-32"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Single Workspace Card Skeleton
 * Exactly mirrors the 4 cards in the user's reference screenshot:
 * - Rounded-2xl white card with border & shadow
 * - Top aspect-video image skeleton with badges
 * - Tag line, title bar, address bar, specs
 * - Bottom action bar with price pill and button
 */
export function WorkspaceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs flex flex-col justify-between">
      <div>
        {/* Aspect Video Image Area */}
        <div className="relative aspect-video w-full skeleton-shimmer">
          {/* Top-left badge placeholder */}
          <div className="absolute top-3 left-3 h-5 w-20 rounded-full skeleton-shimmer-dark" />
          {/* Top-right badge placeholder */}
          <div className="absolute top-3 right-3 h-5 w-16 rounded-md skeleton-shimmer-dark" />
          {/* Bottom-left price tag placeholder */}
          <div className="absolute bottom-3 left-3 h-6 w-24 rounded-lg skeleton-shimmer-dark" />
        </div>

        {/* Card Body Details */}
        <div className="p-5 space-y-3">
          {/* Mint/Greenish category badge pill */}
          <div className="h-4 w-24 rounded-md skeleton-shimmer-emerald" />

          {/* Title line */}
          <div className="h-5 w-4/5 rounded-md skeleton-shimmer" />

          {/* Subtitle / Location line */}
          <div className="h-4 w-3/5 rounded-md skeleton-shimmer opacity-80" />

          {/* Description line */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full rounded skeleton-shimmer opacity-70" />
            <div className="h-3 w-3/4 rounded skeleton-shimmer opacity-70" />
          </div>

          {/* Specs pills row */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="h-4 w-20 rounded skeleton-shimmer" />
            <div className="h-4 w-24 rounded skeleton-shimmer-blue" />
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Left action pill (light green) */}
        <div className="h-7 w-24 rounded-lg skeleton-shimmer-emerald" />
        {/* Right CTA button */}
        <div className="h-8 w-28 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
}

/**
 * 4-Column Workspace Grid Skeleton
 * Matches the layout from the user's reference image
 */
export function WorkspaceGridSkeleton({
  count = 4,
  columns = 4,
}: {
  count?: number;
  columns?: 3 | 4;
}) {
  const colClass =
    columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={`grid ${colClass} gap-6 w-full`}>
      {Array.from({ length: count }).map((_, i) => (
        <WorkspaceCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Filter Sidebar Skeleton for Marketplace Pages
 */
export function FilterSidebarSkeleton() {
  return (
    <div className="w-full lg:w-72 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-6 shadow-2xs h-fit shrink-0">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="h-5 w-28 rounded skeleton-shimmer" />
        <div className="h-4 w-12 rounded skeleton-shimmer opacity-70" />
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <div className="h-4 w-24 rounded skeleton-shimmer" />
        <div className="h-10 w-full rounded-xl skeleton-shimmer" />
      </div>

      {/* Budget Filter */}
      <div className="space-y-2">
        <div className="h-4 w-20 rounded skeleton-shimmer" />
        <div className="h-10 w-full rounded-xl skeleton-shimmer" />
      </div>

      {/* Team Size Buttons */}
      <div className="space-y-2">
        <div className="h-4 w-24 rounded skeleton-shimmer" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 rounded-xl skeleton-shimmer-blue" />
          <div className="h-9 rounded-xl skeleton-shimmer" />
          <div className="h-9 rounded-xl skeleton-shimmer" />
          <div className="h-9 rounded-xl skeleton-shimmer" />
        </div>
      </div>

      {/* Amenities Checkboxes */}
      <div className="space-y-2.5 pt-2">
        <div className="h-4 w-20 rounded skeleton-shimmer" />
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-3">
            <div className="h-4 w-4 rounded skeleton-shimmer" />
            <div className="h-3.5 w-32 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Full Marketplace Explorer Skeleton (City & Category Pages)
 */
export function MarketplaceExplorerSkeleton({
  cityName = "Gurugram",
}: {
  cityName?: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* 1. Hero Banner Skeleton */}
      <HeroBannerSkeleton />

      {/* 2. Category Filter Pills */}
      <CategoryPillsSkeleton count={6} />

      {/* 3. Main Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar Skeleton */}
          <div className="hidden lg:block">
            <FilterSidebarSkeleton />
          </div>

          {/* Cards Area */}
          <div className="flex-1 w-full space-y-6">
            {/* Header bar skeleton */}
            <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="space-y-1">
                <div className="h-5 w-48 rounded skeleton-shimmer" />
                <div className="h-3.5 w-32 rounded skeleton-shimmer opacity-70" />
              </div>
              <div className="h-8 w-28 rounded-xl skeleton-shimmer-blue" />
            </div>

            {/* 3-Column / 4-Column Workspace Grid */}
            <WorkspaceGridSkeleton count={6} columns={3} />
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Listing Detail Page Skeleton
 */
export function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* 1. Breadcrumbs Skeleton */}
      <div className="bg-white border-b border-slate-200/80 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="h-4 w-12 rounded skeleton-shimmer" />
          <div className="h-4 w-4 rounded skeleton-shimmer opacity-50" />
          <div className="h-4 w-16 rounded skeleton-shimmer" />
          <div className="h-4 w-4 rounded skeleton-shimmer opacity-50" />
          <div className="h-4 w-24 rounded skeleton-shimmer" />
          <div className="h-4 w-4 rounded skeleton-shimmer opacity-50" />
          <div className="h-4 w-48 rounded skeleton-shimmer" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* 2. Photo Gallery Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 h-full skeleton-shimmer" />
          <div className="hidden md:grid grid-rows-2 gap-3 h-full">
            <div className="skeleton-shimmer rounded-xl" />
            <div className="skeleton-shimmer rounded-xl" />
          </div>
        </div>

        {/* 3. Two Column Details & Booking Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Info, Amenities, Seating Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex gap-2">
                <div className="h-5 w-24 rounded-full skeleton-shimmer-blue" />
                <div className="h-5 w-20 rounded-full skeleton-shimmer-emerald" />
              </div>
              <div className="h-8 w-4/5 rounded-xl skeleton-shimmer" />
              <div className="h-4 w-3/5 rounded skeleton-shimmer opacity-70" />
              <div className="h-4 w-2/5 rounded skeleton-shimmer opacity-70" />
            </div>

            {/* Seating Plans Skeleton */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="h-6 w-48 rounded skeleton-shimmer" />
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl skeleton-shimmer shrink-0" />
                      <div className="space-y-2">
                        <div className="h-5 w-36 rounded skeleton-shimmer" />
                        <div className="h-3.5 w-24 rounded skeleton-shimmer opacity-70" />
                      </div>
                    </div>
                    <div className="h-8 w-28 rounded-xl skeleton-shimmer-emerald" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Sticky Booking Form Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm sticky top-24">
              <div className="h-6 w-32 rounded skeleton-shimmer" />
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
              <div className="space-y-3 pt-2">
                <div className="h-10 w-full rounded-xl skeleton-shimmer" />
                <div className="h-10 w-full rounded-xl skeleton-shimmer" />
                <div className="h-10 w-full rounded-xl skeleton-shimmer" />
              </div>
              <div className="h-12 w-full rounded-xl skeleton-shimmer-blue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Professional Directory Skeleton
 */
export function ProfessionalDirectorySkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <HeroBannerSkeleton title subtitle badge />
      <CategoryPillsSkeleton count={7} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full skeleton-shimmer shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 rounded skeleton-shimmer" />
                  <div className="h-4 w-24 rounded skeleton-shimmer opacity-70" />
                </div>
              </div>
              <div className="h-3 w-full rounded skeleton-shimmer opacity-70" />
              <div className="h-3 w-4/5 rounded skeleton-shimmer opacity-70" />
              <div className="pt-2 flex justify-between border-t border-slate-100">
                <div className="h-4 w-20 rounded skeleton-shimmer" />
                <div className="h-8 w-24 rounded-lg skeleton-shimmer-blue" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Blogs Page Skeleton
 */
export function BlogsPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <HeroBannerSkeleton title subtitle badge />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Featured blog post skeleton */}
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xs">
          <div className="aspect-video lg:aspect-auto h-64 lg:h-full skeleton-shimmer" />
          <div className="p-8 space-y-4 flex flex-col justify-center">
            <div className="h-5 w-28 rounded-full skeleton-shimmer-blue" />
            <div className="h-8 w-4/5 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-full rounded skeleton-shimmer opacity-70" />
            <div className="h-4 w-2/3 rounded skeleton-shimmer opacity-70" />
            <div className="h-8 w-32 rounded-xl skeleton-shimmer pt-2" />
          </div>
        </div>

        {/* 3-Column Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs space-y-4 pb-5"
            >
              <div className="aspect-video w-full skeleton-shimmer" />
              <div className="px-5 space-y-2.5">
                <div className="h-4 w-20 rounded skeleton-shimmer-blue" />
                <div className="h-5 w-4/5 rounded skeleton-shimmer" />
                <div className="h-3.5 w-full rounded skeleton-shimmer opacity-70" />
                <div className="h-3.5 w-3/4 rounded skeleton-shimmer opacity-70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Generic Full Page Skeleton (Matches screenshot: Hero Banner + Filter Bar + 4 Cards)
 */
export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Banner Skeleton */}
      <HeroBannerSkeleton />

      {/* Category Pills Skeleton */}
      <CategoryPillsSkeleton count={4} />

      {/* 4 Cards Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WorkspaceGridSkeleton count={4} columns={4} />
      </div>
    </div>
  );
}
