"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Mail,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { professionalsApi, ProfessionalProfileItem } from "@/lib/professionals.api";

export default function ProfessionalDashboardOverview() {
  const [profile, setProfile] = useState<ProfessionalProfileItem | null>(null);
  const [enquiriesCount, setEnquiriesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, enqRes] = await Promise.all([
          professionalsApi.getMyProfile(),
          professionalsApi.getMyEnquiries().catch(() => ({ data: [] })),
        ]);

        const p = profRes?.profile || profRes;
        if (p && (p._id || p.fullName)) {
          setProfile(p);
        }
        const enquiriesList = Array.isArray(enqRes) ? enqRes : enqRes?.data || [];
        setEnquiriesCount(enquiriesList.length);
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const p = profile;
  const servicesCount = Array.isArray(p?.services) ? p.services.length : 0;
  const completeness = p?.completeness || 80;

  const checklist = [
    { title: "Statutory Registration Details", done: Boolean(p?.registrationBody && p?.registrationNumber) },
    { title: "Headline & Practice Summary", done: Boolean(p?.headline && p?.summary) },
    { title: "In-Depth Bio / Markdown", done: Boolean(p?.aboutMd && p.aboutMd.length > 50) },
    { title: "Practice Offerings & Services Added", done: servicesCount > 0 },
    { title: "Core Specializations Tagged", done: Array.isArray(p?.specializations) && p.specializations.length > 0 },
    { title: "Consultation Fee Specified", done: Boolean(p?.consultationFeeInr) },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0A1F66] via-[#0E2A8C] to-[#1E5BFF] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C8942C] bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Practitioner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {p?.fullName || "Professional"}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Manage your public profile, update practice fees, and respond to corporate client consultation inquiries directly.
          </p>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Client Enquiries
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E5BFF] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A1F66]">
            {enquiriesCount}
          </div>
          <p className="text-[11px] text-slate-400">Total consultation requests received</p>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Services
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A1F66]">
            {servicesCount}
          </div>
          <p className="text-[11px] text-slate-400">Services listed on your profile</p>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Profile Completeness
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C8942C] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A1F66]">
            {completeness}%
          </div>
          <p className="text-[11px] text-slate-400">Higher score ranks your profile higher</p>
        </div>
      </div>

      {/* Completeness Checklist & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checklist */}
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-black text-[#0A1F66]">
            Profile Completeness Checklist
          </h2>
          <div className="space-y-2.5">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1">
                <span className={item.done ? "font-semibold text-slate-700" : "text-slate-400"}>
                  {item.title}
                </span>
                {item.done ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Pending</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-black text-[#0A1F66]">
            Quick Management Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/professional/profile"
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-[#1E5BFF]" />
                <span className="font-bold text-slate-700">Update Profile Bio &amp; Identity</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#1E5BFF] transition-all" />
            </Link>

            <Link
              href="/dashboard/professional/services"
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-700">Manage Practice Offerings &amp; Pricing</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#1E5BFF] transition-all" />
            </Link>

            <Link
              href="/dashboard/professional/enquiries"
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8942C]" />
                <span className="font-bold text-slate-700">Open Client Enquiries Inbox</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#1E5BFF] transition-all" />
            </Link>

            {p?.slug && (
              <Link
                href={`/professionals/${p.slug}`}
                target="_blank"
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-700">Preview Public Directory Listing</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#1E5BFF] transition-all" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
