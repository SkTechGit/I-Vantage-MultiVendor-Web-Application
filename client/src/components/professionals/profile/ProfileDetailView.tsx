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

  const handleSelectService = (title: string) => {
    setSelectedService(title);
  };

  const handleBookClick = () => {
    const target = document.getElementById("consultation-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasVideos = Array.isArray(p.videos) && p.videos.length > 0;
  const categoryName = p.categoryId?.label || p.categoryId?.name || "Professionals";
  const categorySlug = p.categoryId?.slug || "";

  return (
    <>
      {/* Sticky Scrollspy Navigation Bar */}
      <ProfileScrollspyNav hasVideos={hasVideos} />

      {/* Main Body Grid */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left / Main Content Column (Span 8) */}
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

            {/* Direct Consultation Booking Form */}
            <ProfileConsultationForm
              professional={p}
              preselectedService={selectedService}
            />

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

          {/* Right Column: Sticky Booking Card on Desktop (Span 4) */}
          <div className="hidden lg:block lg:col-span-4">
            <StickyBookingCard professional={p} onBookClick={handleBookClick} />
          </div>

        </div>
      </div>

      {/* Floating Bottom Action Bar on Mobile */}
      <MobileActionBar professional={p} onBookClick={handleBookClick} />
    </>
  );
}
