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
  BookOpen,
  User,
  Clock,
  Phone,
  Eye,
} from "lucide-react";
import { professionalsApi, ProfessionalProfileItem } from "@/lib/professionals.api";

export default function ProfessionalDashboardOverview() {
  const [profile, setProfile] = useState<ProfessionalProfileItem | null>(null);
  const [stats, setStats] = useState<{
    enquiriesCount: number;
    articlesCount: number;
    activeServicesCount: number;
    totalServicesCount: number;
    completeness: number;
  }>({
    enquiriesCount: 0,
    articlesCount: 0,
    activeServicesCount: 0,
    totalServicesCount: 0,
    completeness: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overviewRes = await professionalsApi.getMyOverview().catch(() => null);

        if (overviewRes && overviewRes.profile) {
          setProfile(overviewRes.profile);
          if (overviewRes.stats) {
            setStats(overviewRes.stats);
          }
          if (Array.isArray(overviewRes.recentEnquiries)) {
            setRecentEnquiries(overviewRes.recentEnquiries);
          }
        } else {
          // Fallback to getMyProfile
          const profRes = await professionalsApi.getMyProfile();
          const p = profRes?.profile || profRes;
          if (p && (p._id || p.fullName)) {
            setProfile(p);
            setStats({
              enquiriesCount: 0,
              articlesCount: 0,
              activeServicesCount: Array.isArray(p.services) ? p.services.length : 0,
              totalServicesCount: Array.isArray(p.services) ? p.services.length : 0,
              completeness: p.completeness !== undefined ? p.completeness : 0,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const p = profile;
  const servicesCount = stats.activeServicesCount || (Array.isArray(p?.services) ? p.services.length : 0);
  const completeness = stats.completeness !== undefined ? stats.completeness : (p?.completeness || 0);

  const checklist = [
    { title: "Statutory Registration Details", done: Boolean(p?.registrationBody && p?.registrationNumber) },
    { title: "Headline & Practice Summary", done: Boolean(p?.headline && p?.summary) },
    { title: "In-Depth Bio / Practice Narrative", done: Boolean(p?.aboutMd && p.aboutMd.length > 50) },
    { title: "Practice Offerings & Services Added", done: servicesCount > 0 },
    { title: "Core Specializations Tagged", done: Array.isArray(p?.specializations) && p.specializations.length > 0 },
    { title: "Consultation Fee Specified", done: Boolean(p?.consultationFeeInr) },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0A1F66] via-[#0E2A8C] to-[#1E5BFF] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C8942C] bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Practitioner Portal</span>
            </div>
            {p?.status && (
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  p.status === "PUBLISHED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {p.status}
              </span>
            )}
            {p?.verificationStatus && (
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  p.verificationStatus === "VERIFIED"
                    ? "bg-blue-400/20 text-blue-200 border border-blue-400/30"
                    : "bg-white/10 text-white/80 border border-white/10"
                }`}
              >
                {p.verificationStatus}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {p?.fullName || "Professional"}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Manage your public profile, update practice fees, publish legal &amp; taxation articles, and respond to corporate client consultation inquiries in real-time.
          </p>
        </div>
      </div>

      {/* 4 Real Metric Cards from MongoDB */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            {stats.enquiriesCount}
          </div>
          <p className="text-[11px] text-slate-400">Total consultation leads in DB</p>
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
              Published Articles
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A1F66]">
            {stats.articlesCount}
          </div>
          <p className="text-[11px] text-slate-400">Articles &amp; thought leadership</p>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completeness
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C8942C] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A1F66]">
            {completeness}%
          </div>
          <p className="text-[11px] text-slate-400">Calculated directly from profile</p>
        </div>
      </div>

      {/* Completeness Checklist & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checklist */}
        <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#0A1F66]">
              Profile Completeness Checklist
            </h2>
            <span className="text-xs font-bold text-[#1E5BFF]">
              {checklist.filter((c) => c.done).length} of {checklist.length} Completed
            </span>
          </div>
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
                <span className="font-bold text-slate-700">Update Profile Bio, Credentials &amp; Vault</span>
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
              href="/dashboard/professional/blogs"
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-700">Write &amp; Publish Articles</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#1E5BFF] transition-all" />
            </Link>

            <Link
              href="/dashboard/professional/enquiries"
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-xs"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8942C]" />
                <span className="font-bold text-slate-700">Open Client Enquiries Inbox ({stats.enquiriesCount})</span>
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
                  <ExternalLink className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-700">Preview Live Public Profile</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#1E5BFF] transition-all" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Client Enquiries Feed (Dynamic from DB) */}
      <div className="rounded-2xl bg-white border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#0A1F66]">
              Recent Consultation Inquiries
            </h2>
            <p className="text-xs text-slate-500">
              Live leads submitted by clients directly from your profile.
            </p>
          </div>
          <Link
            href="/dashboard/professional/enquiries"
            className="text-xs font-bold text-[#1E5BFF] hover:underline inline-flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {recentEnquiries.map((enq) => (
              <div key={enq._id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E5BFF] flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{enq.name || "Client"}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{enq.email || enq.phone}</span>
                      <span>•</span>
                      <span>
                        {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                      enq.status === "NEW"
                        ? "bg-blue-50 text-[#1E5BFF] border border-blue-200"
                        : enq.status === "CONTACTED"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : enq.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {enq.status}
                  </span>
                  <Link
                    href="/dashboard/professional/enquiries"
                    className="text-slate-400 hover:text-[#1E5BFF] p-1"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No consultation inquiries received yet. When clients book or enquire via your public page, they appear here instantly.
          </div>
        )}
      </div>
    </div>
  );
}
