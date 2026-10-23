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
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import type { ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
}

export default function ProfileHero({ professional }: Props) {
  const p = professional;
  const [copied, setCopied] = useState(false);

  const categoryName = p.categoryId?.label || p.categoryId?.name || "Professional";
  const categorySlug = p.categoryId?.slug || "";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-blue-50/25 to-[#F8FAFC] border-b border-slate-200/80 pt-6 pb-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
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
                    href={`/professionals/category/${categorySlug}`}
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

        {/* Profile Header Card */}
        <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
          {/* Avatar with Verified Badge Overlay */}
          <div className="relative shrink-0">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-slate-100 border-2 border-white shadow-[0_8px_24px_rgba(10,31,102,0.12)]">
              {p.photoUrl ? (
                <Image
                  src={p.photoUrl}
                  alt={p.photoAlt || p.fullName}
                  fill
                  sizes="144px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0A1F66] text-white font-black text-4xl">
                  {p.fullName ? p.fullName.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
                </div>
              )}
            </div>

            {p.verificationStatus === "VERIFIED" && (
              <div
                title="Verified Professional Credentials"
                className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-black text-white shadow-md border-2 border-white"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            )}
          </div>

          {/* Details & Metadata */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Category Pill */}
              <Link
                href={`/professionals/category/${categorySlug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-3 py-1 text-xs font-bold text-[#1E5BFF] hover:bg-blue-100/70 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{categoryName}</span>
              </Link>

              {/* Share & Socials */}
              <div className="flex items-center gap-2">
                {p.linkedinUrl && (
                  <a
                    href={p.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-[#1E5BFF] hover:border-blue-300 shadow-2xs transition-colors"
                  >
                    <FaLinkedinIn className="text-xs" />
                  </a>
                )}
                {p.websiteUrl && (
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Personal Website"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-[#1E5BFF] hover:border-blue-300 shadow-2xs transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share profile link"
                  className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-[#0A1F66] hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
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

            {/* Name & Headline */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1F66] tracking-tight">
                  {p.fullName}
                </h1>
                {p.qualification && (
                  <span className="text-sm sm:text-base font-bold text-slate-500">
                    ({p.qualification})
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#1E5BFF] mt-1 leading-snug">
                {p.headline}
              </p>
            </div>

            {/* Registration Details & Trust Line */}
            {p.registrationBody && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100/90 border border-slate-200/70 px-3 py-1.5 text-xs text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong className="font-bold text-slate-800">{p.registrationBody}</strong>
                  {p.registrationNumber ? ` — Reg No. ${p.registrationNumber}` : ""}
                </span>
              </div>
            )}

            {/* Badges / Meta Strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-slate-600">
              {/* Location */}
              <div className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {p.city}
                  {p.state ? `, ${p.state}` : ""}, India
                </span>
              </div>

              {/* Experience */}
              {p.yearsExperience && (
                <div className="flex items-center gap-1 font-medium">
                  <Award className="w-3.5 h-3.5 text-[#C8942C] shrink-0" />
                  <span>{p.yearsExperience}+ Years Experience</span>
                </div>
              )}

              {/* Spoken Languages */}
              {Array.isArray(p.languages) && p.languages.length > 0 && (
                <div className="flex items-center gap-1 font-medium">
                  <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{p.languages.join(", ")}</span>
                </div>
              )}

              {/* Consultation Modes */}
              {Array.isArray(p.consultationModes) && p.consultationModes.length > 0 && (
                <div className="flex items-center gap-1.5 font-medium">
                  {p.consultationModes.includes("ONLINE") && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Video className="w-3 h-3" />
                      Video Session
                    </span>
                  )}
                  {p.consultationModes.includes("IN_PERSON") && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                      <Building className="w-3 h-3" />
                      Boardroom / In-Person
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
