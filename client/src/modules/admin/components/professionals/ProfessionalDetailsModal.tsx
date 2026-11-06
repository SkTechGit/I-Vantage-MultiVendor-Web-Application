"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import {
  X,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  Calendar,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Lock,
  Eye,
  User,
  Clock,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";

export interface ProfessionalDetailsModalProps {
  professional: any | null;
  professionalId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfessionalDetailsModal({
  professional,
  professionalId,
  isOpen,
  onClose,
}: ProfessionalDetailsModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<any | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Dynamically fetch live data from backend every time modal opens
  useEffect(() => {
    if (!isOpen) {
      setLiveData(null);
      return;
    }

    if (professional) {
      setLiveData(professional);
    }

    const targetIdentifier =
      professionalId ||
      professional?._id ||
      professional?.id ||
      professional?.slug ||
      professional?.contactEmail ||
      professional?.email;

    if (!targetIdentifier) return;

    setIsLoadingLive(true);
    axiosInstance
      .get(`/professionals/admin/${encodeURIComponent(targetIdentifier)}/details`)
      .then((res) => {
        if (res.data?.data) {
          setLiveData(res.data.data);
        }
      })
      .catch((err) => {
        console.warn("Dynamic live details fetch notice:", err?.message || err);
      })
      .finally(() => {
        setIsLoadingLive(false);
      });
  }, [isOpen, professional, professionalId]);

  if (!isOpen) return null;

  const pro = liveData || professional;
  if (!pro && isLoadingLive) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-3xl p-8 flex flex-col items-center justify-center gap-3 shadow-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#1E5BFF]" />
          <p className="text-xs font-bold text-slate-700">Loading live professional dossier...</p>
        </div>
      </div>
    );
  }

  if (!pro) return null;
  const fullName = pro.fullName || pro.name || "Verified Professional";
  const email = pro.contactEmail || pro.email || pro.userId?.email || null;
  const phone = pro.contactPhone || pro.phone || pro.userId?.phone || null;
  const whatsapp = pro.contactWhatsapp || null;
  const categoryTitle =
    pro.categoryId?.label ||
    pro.categoryId?.name ||
    pro.categoryName ||
    "Professional Advisor";
  const city = pro.city || "Gurugram";
  const state = pro.state || "Haryana";
  const country = pro.country || "India";
  const languages = Array.isArray(pro.languages) ? pro.languages : [];
  const yearsExp = pro.yearsExperience ?? 0;
  const qualification = pro.qualification || null;
  const registrationBody = pro.registrationBody || null;
  const registrationNumber = pro.registrationNumber || null;
  const headline = pro.headline || `${categoryTitle} & Advisor`;
  const summary = pro.summary || pro.bio || null;
  const about = pro.aboutMd || null;
  const services = Array.isArray(pro.services) ? pro.services : [];
  const expertise = Array.isArray(pro.expertise) ? pro.expertise : [];
  const linkedinUrl = pro.linkedinUrl || null;
  const websiteUrl = pro.websiteUrl || null;
  const status = pro.status || "PUBLISHED";
  const verificationStatus = pro.verificationStatus || "VERIFIED";

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateVal?: string | Date | null) => {
    if (!dateVal) return "N/A";
    try {
      return new Date(dateVal).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-md transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-modal-in">
        {/* =========================================================
            TOP MODAL HEADER (Executive Brand Bar)
        ========================================================= */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-[#0B1F5E] to-[#0A1F66] text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-blue-200 border border-white/15 shrink-0 shadow-xs">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold tracking-tight truncate text-white">
                  Professional Profile Dossier
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-blue-100 border border-white/20 shrink-0">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Read-Only View</span>
                </span>
                {isLoadingLive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-400/20 text-blue-200 border border-blue-300/30 shrink-0 animate-pulse">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>Syncing Live DB</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Live Dynamic Data</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-200/80 truncate">
                SuperAdmin verification audit • Details are view-only
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer shrink-0 ml-3"
            title="Close Dossier (Esc)"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =========================================================
            SCROLLABLE CONTENT BODY
        ========================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
          {/* 1. HERO IDENTITY CARD */}
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 via-slate-50 to-white border border-blue-100/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                {/* Photo / Initials */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md shrink-0">
                  {pro.photoUrl ? (
                    <Image
                      src={pro.photoUrl}
                      alt={fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A1F66] to-[#1E5BFF] text-white font-black text-xl">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {verificationStatus === "VERIFIED" && (
                    <div
                      className="absolute bottom-0 right-0 p-1 bg-emerald-500 text-white rounded-tl-lg shadow-xs"
                      title="Verified Partner"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Name & Headline */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {fullName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1E5BFF]/10 text-[#1E5BFF] border border-[#1E5BFF]/20">
                      {categoryTitle}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 mt-1 line-clamp-1">
                    {headline}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {city}, {state}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      {yearsExp > 0 ? `${yearsExp} Years Exp.` : "Empaneled Advisor"}
                    </span>
                    {qualification && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-slate-400" />
                          {qualification}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badges & Public Preview */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : status === "PENDING_REVIEW"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : status === "SUSPENDED"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {status}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      verificationStatus === "VERIFIED"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {verificationStatus}
                  </span>
                </div>

                {pro.slug && (
                  <Link
                    href={`/professionals/${pro.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E5BFF] hover:text-blue-800 hover:underline transition"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* 2. DIRECT CONTACT INFORMATION (Highlighted Priority Card) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Contact &amp; Communication Details
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Direct credentials and contact channels for superadmin communication
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                Strictly Confidential
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Email Address */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-2xs shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Email Address
                    </span>
                    <span className="block text-xs font-bold text-slate-800 truncate select-all">
                      {email || "No email on record"}
                    </span>
                  </div>
                </div>

                {email && (
                  <button
                    type="button"
                    onClick={() => handleCopy(email, "email")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-white transition cursor-pointer shrink-0"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Phone Number */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-2xs shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Mobile / Phone Number
                    </span>
                    <span className="block text-xs font-bold text-slate-800 truncate select-all">
                      {phone ? (
                        <a
                          href={`tel:${phone}`}
                          className="hover:underline hover:text-emerald-700"
                        >
                          {phone}
                        </a>
                      ) : (
                        "No phone provided"
                      )}
                    </span>
                  </div>
                </div>

                {phone && (
                  <button
                    type="button"
                    onClick={() => handleCopy(phone, "phone")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-white transition cursor-pointer shrink-0"
                    title="Copy Phone"
                  >
                    {copiedField === "phone" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* WhatsApp Number (if present) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-green-600 shadow-2xs shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      WhatsApp Channel
                    </span>
                    <span className="block text-xs font-bold text-slate-800 truncate">
                      {whatsapp ? (
                        <a
                          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline hover:text-green-700"
                        >
                          {whatsapp}
                        </a>
                      ) : (
                        phone ? `${phone} (Default)` : "Not registered"
                      )}
                    </span>
                  </div>
                </div>

                {whatsapp && (
                  <button
                    type="button"
                    onClick={() => handleCopy(whatsapp, "whatsapp")}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-white transition cursor-pointer shrink-0"
                    title="Copy WhatsApp"
                  >
                    {copiedField === "whatsapp" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Communication Routing Mode */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-amber-600 shadow-2xs shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Client Lead Routing
                  </span>
                  <span className="block text-xs font-bold text-slate-800 capitalize">
                    {pro.contactMode === "DIRECT"
                      ? "Direct Practitioner Routing"
                      : "i-VANTAGE Concierge Hub Routing"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. STATUTORY, REGULATORY & PRACTICE CREDENTIALS */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Statutory &amp; Regulatory Credentials
                </h3>
                <p className="text-[10px] text-slate-400">
                  Registration council, qualifications, and statutory license verification
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* Regulatory Body */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  Statutory Authority / Council
                </span>
                <span className="block text-xs font-bold text-slate-800 mt-0.5">
                  {registrationBody || "Unregistered / General Advisor"}
                </span>
              </div>

              {/* License Number */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  License / COP Registration
                </span>
                <span className="block text-xs font-mono font-bold text-slate-800 mt-0.5">
                  {registrationNumber ? `#${registrationNumber}` : "Not on file"}
                </span>
              </div>

              {/* Qualification */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  Degrees &amp; Qualifications
                </span>
                <span className="block text-xs font-bold text-slate-800 mt-0.5">
                  {qualification || "Practitioner"}
                </span>
              </div>

              {/* Jurisdiction / City */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  Base Jurisdiction
                </span>
                <span className="block text-xs font-bold text-slate-800 mt-0.5">
                  {city}, {state}, {country}
                </span>
              </div>

              {/* Practice Experience */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  Practice Experience
                </span>
                <span className="block text-xs font-bold text-slate-800 mt-0.5">
                  {yearsExp > 0 ? `${yearsExp} Years in Practice` : "Established Advisor"}
                </span>
              </div>

              {/* Languages */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">
                  Consultation Languages
                </span>
                <span className="block text-xs font-bold text-slate-800 mt-0.5">
                  {languages.length > 0 ? languages.join(", ") : "English, Hindi"}
                </span>
              </div>
            </div>
          </div>

          {/* 4. SUMMARY & PRACTICE BIO */}
          {(summary || about) && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <User className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Practice Bio &amp; Executive Summary
                </h3>
              </div>

              {summary && (
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Executive Summary
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {summary}
                  </p>
                </div>
              )}

              {about && about !== summary && (
                <div className="mt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Detailed Practice Statement
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line">
                    {about}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 5. SERVICES & SPECIALIZATIONS */}
          {(services.length > 0 || expertise.length > 0) && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Practice Services &amp; Specializations
                </h3>
              </div>

              {expertise.length > 0 && (
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                    Areas of Expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {expertise.map((exp: any, i: number) => {
                      const title = typeof exp === "string" ? exp : exp.title;
                      return (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50/80 text-indigo-700 border border-indigo-100"
                        >
                          {title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {services.length > 0 && (
                <div className="mt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                    Catalogued Services
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {services.map((svc: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-800 truncate mr-2">
                          {svc.title}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                          {svc.priceInr ? `₹${svc.priceInr.toLocaleString("en-IN")}` : "By Quote"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. SOCIAL & EXTERNAL PROFILES */}
          {(linkedinUrl || websiteUrl) && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                External Profiles:
              </span>
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                >
                  <FaLinkedinIn className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Official Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* =========================================================
            MODAL FOOTER (Audit Notice & Action)
        ========================================================= */}
        <div className="shrink-0 flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50/90 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Empaneled: {formatDate(pro.createdAt || pro.registeredAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="luxury-btn px-4 py-1.5 rounded-xl bg-slate-200/90 hover:bg-slate-300 text-slate-800 text-xs font-bold transition active:scale-95 cursor-pointer shadow-2xs"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
