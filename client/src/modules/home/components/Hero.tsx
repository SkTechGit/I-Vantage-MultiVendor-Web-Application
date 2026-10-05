"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  LineChart,
  MapPin,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  Laptop,
  Sparkles,
  Zap,
} from "lucide-react";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import { Service } from "@/modules/service/service.types";
import LeadForm from "./LeadForm";

const serviceHighlights = [
  {
    title: "Work Smart",
    description: "Coworking, Private Suites & Boardrooms",
    image: "/images/workspace/conf3.webp",
    icon: Laptop,
  },
  {
    title: "Start Right",
    description: "Virtual Office, GST & Company Setup",
    image: "/images/workspace/conf4.webp",
    icon: BriefcaseBusiness,
  },
  {
    title: "Stay Compliant",
    description: "Legal, Tax, Audit & Corporate Services",
    image: "/images/workspace/openseat1.webp",
    icon: FileCheck2,
  },
  {
    title: "Grow Faster",
    description: "Tech Desks, Growth Ops & Mentorship",
    image: "/images/workspace/reception1.webp",
    icon: LineChart,
  },
];

const trustPoints = [
  "Welldone Tech Park Flagship",
  "100+ Enterprise Support Services",
  "Zero Brokerage Direct Network",
  "Rapid 1-Hour Dedicated Response",
];

export default function Hero() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
      {/* =========================================================
          1. AMBIENT CORPORATE LIGHTING & GRID OVERLAY
      ========================================================= */}
      <div className="pointer-events-none absolute -left-20 top-10 -z-0 h-[480px] w-[480px] rounded-full bg-[#1E5BFF]/08 blur-[130px]" />
      <div className="pointer-events-none absolute -right-20 top-40 -z-0 h-[450px] w-[450px] rounded-full bg-[#F4A900]/06 blur-[120px]" />

      {/* Subtle Precision Matrix */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0a1f6608_1px,transparent_1px),linear-gradient(to_bottom,#0a1f6608_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_35%,#000_65%,transparent_100%)]" />

      <Container>
        <div className="relative z-10 grid items-center gap-6 py-6 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:py-18 xl:grid-cols-[0.88fr_1.12fr]">
          {/* =========================================================
              LEFT COLUMN: Executive Headline & Value Propositions
          ========================================================= */}
          <div className="flex min-w-0 flex-col">
            {/* Luminous Brand Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/70 bg-white/90 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0A1F66] shadow-xs backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4A900] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F4A900]" />
              </span>
              <span>INDIA&apos;S PREMIER BUSINESS ECOSYSTEM</span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="mt-3 max-w-2xl text-[24px] font-black leading-[1.12] tracking-[-0.03em] text-[#0A1F66] sm:mt-6 sm:text-4xl md:text-[46px] lg:text-[46px] xl:text-[52px]">
              Everything Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E5BFF] via-[#2563EB] to-[#1E5BFF]">
                Business Needs
              </span>{" "}
              to Grow
              <span className="text-[#F4A900]">.</span>
            </h1>

            {/* Description */}
            <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-slate-600 sm:mt-6 sm:text-base sm:leading-7 lg:text-[15px] xl:text-base">
              i-VANTAGE unites luxury commercial workspaces, seamless corporate registrations,
              regulatory compliance, and 100+ business growth desks under one prestigious roof in Gurugram.
            </p>

            {/* =========================================================
                EXECUTIVE TELEMETRY BADGES
            ========================================================= */}
            <div className="mt-4 grid w-full max-w-[500px] grid-cols-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xs backdrop-blur-md sm:mt-7">
              {/* Stat 1 */}
              <div className="flex min-w-0 items-center gap-3 border-r border-slate-100 px-3.5 py-3.5 sm:px-5 sm:py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] border border-blue-100/60 shadow-2xs">
                  <Users size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-black leading-none text-[#1E5BFF] sm:text-xl">
                    100+
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-slate-600 sm:text-[11px]">
                    Enterprise Support Desks
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex min-w-0 items-center gap-3 px-3.5 py-3.5 sm:px-5 sm:py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50/80 text-[#D97706] border border-amber-100/60 shadow-2xs">
                  <Building2 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-black leading-none text-[#0A1F66] sm:text-xl">
                    One
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-slate-600 sm:text-[11px]">
                    Unified Business Hub
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================
                HIGH-CONVERSION CALL-TO-ACTIONS
            ========================================================= */}
            <div className="mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row">
              <Link href="#serviceSection" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] px-6 text-sm font-bold text-white shadow-md shadow-blue-900/15 hover:brightness-110 transition-all active:scale-95"
                >
                  <span>Explore All Services</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSelectedServices([]);
                  setIsLeadFormOpen(true);
                }}
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl border border-slate-200/90 bg-white px-6 text-sm font-bold text-[#0A1F66] shadow-xs hover:bg-slate-50 hover:border-slate-300 hover:text-[#1E5BFF] transition-all active:scale-95"
              >
                <Sparkles size={16} className="text-[#F4A900]" />
                <span>Book a VIP Tour</span>
              </button>
            </div>

            {/* =========================================================
                TRUST POINTS
            ========================================================= */}
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:mt-7 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-3">
              {trustPoints.map((point) => (
                <div key={point} className="flex min-w-0 items-center gap-2">
                  <CheckCircle2
                    size={14}
                    className="shrink-0 text-[#1E5BFF]"
                    fill="#1E5BFF"
                    color="#ffffff"
                    strokeWidth={2}
                  />
                  <span className="truncate text-xs font-semibold text-slate-700 sm:text-[13px]">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: Luxury Workspace Showcase & Pillars
          ========================================================= */}
          <div className="relative min-w-0">
            {/* Luminous Backing Aura */}
            <div className="pointer-events-none absolute -right-6 top-6 h-60 w-60 rounded-full bg-blue-100/60 blur-3xl" />

            <div className="relative space-y-3.5">
              {/* Main Architectural Showcase Card */}
              <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl ring-1 ring-slate-900/5 group">
                <Image
                  src="/images/workspace/reception1.webp"
                  alt="i-VANTAGE Welldone Tech Park Flagship Hub"
                  width={900}
                  height={600}
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 55vw"
                  className="h-[210px] w-full object-cover transition-transform duration-700 group-hover:scale-103 sm:h-[400px] md:h-[440px] lg:h-[420px] xl:h-[460px]"
                />

                {/* Subtle Cinematic Vignette */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A1F66]/50 via-transparent to-black/10" />

                {/* Floating Glassmorphic Location Badge */}
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-950/60 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-lg">
                  <MapPin size={13} className="text-[#F4A900]" />
                  <span>Welldone Tech Park, Sec 48 Gurugram</span>
                </div>

                {/* Floating Glassmorphic Facility Telemetry */}
                <div className="absolute bottom-4 left-4 right-4 hidden sm:flex items-center justify-between rounded-2xl border border-white/20 bg-slate-950/70 p-3 text-xs text-white backdrop-blur-md shadow-lg">
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-[#F4A900]" />
                    <span className="font-semibold">100% Leased Line & Power Backup</span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-300">24/7 BIOMETRIC SECURE</span>
                </div>
              </div>

              {/* 4 Pillars Micro-Grid */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
                {serviceHighlights.map((service) => {
                  const Icon = service.icon;

                  return (
                    <div
                      key={service.title}
                      className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#1E5BFF]/40 hover:shadow-md"
                    >
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] border border-blue-100/60 transition-colors group-hover:bg-[#1E5BFF] group-hover:text-white">
                        <Icon size={16} strokeWidth={2.2} />
                      </div>

                      <h3 className="text-xs font-bold leading-tight text-[#0A1F66]">
                        {service.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">
                        {service.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =============================================================
            BOTTOM BUSINESS ECOSYSTEM BAR
        ============================================================= */}
        <div className="relative z-20 mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm sm:mb-10 sm:rounded-3xl lg:mb-14 backdrop-blur-md">
          <div className="grid grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
            {/* Intro */}
            <div className="col-span-2 flex min-w-0 items-center px-5 py-5 sm:px-7 sm:py-6 lg:col-span-1">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1E5BFF]">
                  THE i-VANTAGE ADVANTAGE
                </p>
                <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-800 sm:text-sm">
                  Complete commercial ecosystem for startups, consultants & enterprises.
                </p>
              </div>
            </div>

            {/* Business Services */}
            <div className="flex min-w-0 items-center gap-3 border-t border-slate-100 px-4 py-4 sm:px-6 lg:border-l lg:border-t-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] border border-blue-100/60 shadow-2xs">
                <Users size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black leading-none text-[#1E5BFF]">
                  100+
                </p>
                <p className="mt-1 text-[10px] font-semibold leading-3 text-slate-600">
                  Business Desks
                </p>
              </div>
            </div>

            {/* Hub */}
            <div className="flex min-w-0 items-center gap-3 border-t border-slate-100 px-4 py-4 sm:px-6 lg:border-l lg:border-t-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] border border-blue-100/60 shadow-2xs">
                <MapPin size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black leading-none text-[#0A1F66]">
                  Welldone
                </p>
                <p className="mt-1 text-[10px] font-semibold leading-3 text-slate-600">
                  Sector 48 Flagship
                </p>
              </div>
            </div>

            {/* Growth */}
            <div className="flex min-w-0 items-center gap-3 border-t border-slate-100 px-4 py-4 sm:px-6 lg:border-l lg:border-t-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#D97706] border border-amber-100/60 shadow-2xs">
                <Sparkles size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black leading-none text-[#0A1F66]">
                  Zero
                </p>
                <p className="mt-1 text-[10px] font-semibold leading-3 text-slate-600">
                  Brokerage Direct
                </p>
              </div>
            </div>

            {/* Trusted */}
            <div className="flex min-w-0 items-center gap-3 border-t border-slate-100 px-4 py-4 sm:px-6 lg:border-l lg:border-t-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/60 shadow-2xs">
                <ShieldCheck size={19} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black leading-none text-emerald-600">
                  1-Hour
                </p>
                <p className="mt-1 text-[10px] font-semibold leading-3 text-slate-600">
                  Response SLA
                </p>
              </div>
            </div>
          </div>
        </div>
        <LeadForm
          open={isLeadFormOpen}
          services={selectedServices}
          onRemoveService={(serviceId) => {
            setSelectedServices((prev) =>
              prev.filter((service) => service._id !== serviceId),
            );
          }}
          onClose={() => {
            setIsLeadFormOpen(false);
          }}
          onSuccess={() => {
            setSelectedServices([]);
            setIsLeadFormOpen(false);
          }}
        />
      </Container>
    </section>
  );
}
