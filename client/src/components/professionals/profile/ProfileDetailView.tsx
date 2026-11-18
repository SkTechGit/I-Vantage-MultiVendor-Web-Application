"use client";

import React, { useState } from "react";
import ProfileStatsStrip from "./ProfileStatsStrip";
import ProfileScrollspyNav from "./ProfileScrollspyNav";
import ProfileAboutSection from "./ProfileAboutSection";
import ProfileProcessSection from "./ProfileProcessSection";
import ProfileServicesGrid from "./ProfileServicesGrid";
import ProfileExpertiseSection from "./ProfileExpertiseSection";
import ProfileVideoSection from "./ProfileVideoSection";
import ProfileTimelineSection from "./ProfileTimelineSection";
import ProfileConsultationForm from "./ProfileConsultationForm";
import StickyBookingCard from "./StickyBookingCard";
import MobileActionBar from "./MobileActionBar";
import RelatedProfessionalsSection from "./RelatedProfessionalsSection";
import ProfileDisclaimer from "./ProfileDisclaimer";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
  relatedProfessionals?: ProfessionalProfileItem[];
}

export default function ProfileDetailView({ professional, relatedProfessionals = [] }: Props) {
  const p = professional;
  const [selectedService, setSelectedService] = useState<string>("");

  const scrollToBookingForm = () => {
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    const target = isDesktop
      ? document.getElementById("sticky-lead-form-wrapper") || document.getElementById("consultation-section")
      : document.getElementById("consultation-section-mobile") || document.getElementById("sticky-lead-form-wrapper") || document.getElementById("consultation-section");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectService = (title: string) => {
    setSelectedService(title);
    scrollToBookingForm();
  };

  const handleBookClick = () => {
    scrollToBookingForm();
  };

  const hasVideos = Array.isArray(p.videos) && p.videos.length > 0;
  const categoryName = p.categoryId?.label || p.categoryId?.name || "Professionals";
  const categorySlug = p.categoryId?.slug || "";

  return (
    <>
      {/* Scrollspy Navigation Strip */}
      <ProfileScrollspyNav hasVideos={hasVideos} />

      {/* Main Body Grid */}
      {/*
        Layout pattern (matches ListingDetailView):
        - Outer wrapper: overflow-x-clip (ensures position:sticky is not broken)
        - Grid: items-stretch so both columns extend to full height
        - Left column: scrolls naturally with all expanded content
        - Right column: self-stretch flex flex-col space-y-6
          - Consultant Price Card at top (scrolls naturally)
          - Contact Form below it with lg:sticky lg:top-[76px] (pins below navbar)
      */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 overflow-x-clip">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

          {/* ── LEFT / MAIN CONTENT COLUMN (Span 8) ───────────────── */}
          <div className="lg:col-span-8 space-y-10 min-w-0">
            {/* 4-Column Practice Stats Strip */}
            <ProfileStatsStrip professional={p} />

            {/* About / Bio & Sectors */}
            <ProfileAboutSection professional={p} />

            {/* Services & Pricing Grid with Preselect */}
            <ProfileServicesGrid professional={p} onSelectService={handleSelectService} />

            {/* Core Competencies & Expertise */}
            <ProfileExpertiseSection professional={p} />

            {/* How It Works (4-Step Framework) */}
            <ProfileProcessSection professional={p} />

            {/* Videos / Webinars (if any) */}
            {hasVideos && <ProfileVideoSection professional={p} />}

            {/* Timeline: Experience & Education */}
            <ProfileTimelineSection professional={p} />

            {/* Mobile-only Consultation Form (in-flow at bottom for mobile) */}
            <div className="lg:hidden">
              <ProfileConsultationForm
                professional={p}
                preselectedService={selectedService}
                formId="consultation-section-mobile"
              />
            </div>

            {/* Related Professionals */}
            {relatedProfessionals.length > 0 && (
              <RelatedProfessionalsSection
                professionals={relatedProfessionals}
                categoryName={categoryName}
                categorySlug={categorySlug}
              />
            )}

            {/* Regulatory & Ethics Disclaimer */}
            <ProfileDisclaimer />
          </div>

          {/* ── RIGHT COLUMN: Price Card + Sticky Contact / Lead Form (Span 4) ── */}
          <div
            id="consultation-booking-section"
            className="hidden lg:flex lg:col-span-4 self-stretch flex-col space-y-6 scroll-mt-20"
          >
            {/* 1. Consultant Price Card (at the top, in-flow) */}
            <StickyBookingCard professional={p} onBookClick={handleBookClick} />

            {/* 2. Contact Form / Lead Form (Sticky once scrolled to top margin of navbar) */}
            <div
              id="sticky-lead-form-wrapper"
              className="lg:sticky lg:top-[76px] z-20 space-y-4 max-h-[calc(100vh-86px)] overflow-y-auto no-scrollbar scroll-mt-20 transition-all duration-200"
            >
              <div className="rounded-3xl bg-white border border-[#DCE5F5] shadow-[0_8px_30px_rgba(10,31,102,0.08)] overflow-hidden">
                <ProfileConsultationForm
                  professional={p}
                  preselectedService={selectedService}
                  compact
                  formId="consultation-section"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Bottom Action Bar on Mobile */}
      <MobileActionBar professional={p} onBookClick={handleBookClick} />
    </>
  );
}
