"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  Award,
  Globe,
  Share2,
  Check,
  ChevronRight,
  User,
  Video,
  Building,
  Languages,
  Download,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
  onBookClick?: () => void;
}

export default function ProfileHero({ professional, onBookClick }: Props) {
  const p = professional;
  const [copied, setCopied] = useState(false);

  const categoryName = p.categoryId?.label || p.categoryId?.name || "Professional";
  const categorySlug = p.categoryId?.slug || "";

  const isCA =
    categorySlug === "chartered-accountants" ||
    (p.registrationBody || "").toUpperCase().includes("ICAI") ||
    Boolean(p.copNumber || p.firmRegistrationNumber);

  const isLegal =
    categorySlug.includes("law") ||
    categorySlug.includes("advocate") ||
    categorySlug.includes("legal");

  const hasGST = Boolean(p.gstin);

  // Determine Verification Badge Label (matching user requirement)
  const verificationBadgeText = hasGST
    ? "Verified GST Registration"
    : isCA
    ? "Verified ICAI Member"
    : isLegal
    ? "Verified Bar Council Advocate"
    : "Verified Professional";

  // Primary Role / Subtitle
  const roleSubtitle =
    p.designation ||
    (hasGST && categorySlug.includes("tax") ? "GST & Taxation Consultant" : categoryName);

  // Firm & Location
  const firmLocationText = `${p.firmName || (p.headline && p.headline.includes("TAXORA") ? "TAXORA PREMIUM SERVICES" : "Verified Practice")} · ${p.city}, ${p.state || "India"}`;

  // Pills to display (top specializations or headline tokens)
  const displayTags =
    Array.isArray(p.specializations) && p.specializations.length > 0
      ? p.specializations.slice(0, 3)
      : ["GST Compliance", "Bookkeeping"];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleScrollToBooking = () => {
    if (onBookClick) {
      onBookClick();
      return;
    }
    const target = document.getElementById("consultation-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-blue-50/20 to-[#F8FAFC] pt-6 pb-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <li>
              <Link href="/" className="hover:text-[#1E5BFF] transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <li>
              <Link href="/professionals" className="hover:text-[#1E5BFF] transition-colors">
                Professionals
              </Link>
            </li>
            {categorySlug && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <li>
                  <Link
                    href={`/professionals/${categorySlug}`}
                    className="hover:text-[#1E5BFF] transition-colors"
                  >
                    {categoryName}
                  </Link>
                </li>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <li className="text-[#0A1F66] font-bold truncate max-w-[200px]">
              {p.fullName}
            </li>
          </ol>
        </nav>

        {/* Executive Header Banner Card (Structured strictly matching user specification) */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0A1F66] via-[#0E2880] to-[#12389E] p-6 sm:p-8 text-white shadow-xl border border-blue-900/40 relative overflow-hidden">
          {/* Subtle Ambient Background Accents */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          {/* Top Row: Verification Pill & Share/Socials */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5">
            {/* Independently Verified Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 text-xs font-bold backdrop-blur-xs shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{verificationBadgeText}</span>
            </div>

            {/* Social Links & Share Button */}
            <div className="flex items-center gap-2">
              {p.linkedinUrl && (
                <a
                  href={p.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 shadow-2xs transition-colors"
                >
                  <FaLinkedinIn className="text-xs" />
                </a>
              )}
              {p.websiteUrl && (
                <a
                  href={p.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 shadow-2xs transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
              {p.portfolioFileUrl && (
                <a
                  href={p.portfolioFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.portfolioTitle || "Download Practice Portfolio"}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white hover:bg-white/20 shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </a>
              )}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share profile link"
                className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white hover:bg-white/20 shadow-2xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Center Content: Avatar + Name + Role + Firm + Specialization Pills */}
          <div className="relative z-10 flex flex-col md:flex-row items-start gap-6 lg:gap-8">
            {/* Avatar with Verified Status */}
            <div className="relative shrink-0">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-800 border-2 border-white/30 shadow-2xl">
                {p.photoUrl ? (
                  <Image
                    src={p.photoUrl}
                    alt={p.photoAlt || `${p.fullName} - Verified ${categoryName} in ${p.city}, India`}
                    fill
                    sizes="(max-width: 640px) 112px, 144px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white font-black text-4xl">
                    {p.fullName ? p.fullName.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
                  </div>
                )}
              </div>

              {p.verificationStatus === "VERIFIED" && (
                <div
                  title={verificationBadgeText}
                  className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white shadow-md border-2 border-[#0A1F66]"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>

            {/* Profile Identity Text */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* H1 Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {p.fullName}
              </h1>

              {/* Role / Subtitle */}
              <p className="text-sm sm:text-base font-bold text-blue-200">
                {roleSubtitle}
              </p>

              {/* Firm & City */}
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {firmLocationText}
              </p>

              {/* Specialization Tags (matching Image 1) */}
              <div className="flex flex-wrap gap-2 pt-1.5">
                {displayTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-lg bg-white/10 text-white border border-white/15 backdrop-blur-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Prominent Action Buttons (Call, Email, Book Consultation) */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                {/* 1. Book Consultation Primary CTA */}
                <button
                  type="button"
                  onClick={handleScrollToBooking}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0A1F66] text-xs sm:text-sm font-black shadow-lg hover:bg-blue-50 active:scale-95 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#1E5BFF]" />
                  <span>Book Consultation</span>
                </button>

                {/* 2. Direct Call Action */}
                {p.contactPhone && (
                  <a
                    href={`tel:${p.contactPhone.replace(/\D/g, "")}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-xs transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>
                )}

                {/* 3. Direct Email Action */}
                {p.contactEmail && (
                  <a
                    href={`mailto:${p.contactEmail}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-xs transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
