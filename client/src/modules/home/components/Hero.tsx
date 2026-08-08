"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  LineChart,
  MapPin,
  Users,
  Trophy,
  BriefcaseBusiness,
  Laptop,
} from "lucide-react";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

const serviceHighlights = [
  {
    title: "Work Smart",
    description: "Coworking, Managed Offices & Meeting Rooms",
    image: "/images/workspace/conf3.webp",
    icon: Laptop,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Start Right",
    description: "Virtual Office, GST & Company Registration",
    image: "/images/workspace/conf4.webp",
    icon: BriefcaseBusiness,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    title: "Stay Compliant",
    description: "Compliance, Legal, Accounting & HR Support",
    image: "/images/workspace/openseat1.webp",
    icon: FileCheck2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Grow Faster",
    description: "Marketing, Technology, Mentorship & More",
    image: "/images/workspace/reception1.webp",
    icon: LineChart,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

const trustPoints = [
  "Professional Spaces",
  "Expert Support",
  "End to End Solutions",
  "Grow with Confidence",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft Background */}
      <div className="pointer-events-none absolute left-0 top-20 -z-0 h-[420px] w-[420px] rounded-full bg-blue-50/80 blur-3xl" />

      <Container>
        <div className="relative z-10 grid items-start gap-10 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:py-16 xl:grid-cols-[0.86fr_1.14fr]">
          {/* =========================================================
              LEFT CONTENT
          ========================================================= */}
          <div className="flex min-w-0 flex-col">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#1E5BFF] sm:px-4 sm:text-xs">
              <Building2 size={14} strokeWidth={2.5} />

              <span>More Than Coworking</span>
            </div>

            {/* Heading */}
            <h1 className="mt-5 max-w-2xl text-[27px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#0A1F66] sm:mt-7 sm:text-3xl md:text-[45px] lg:text-[45px] xl:text-[50px]">
              Everything Your{" "}
              <span className="text-[#1E5BFF]">
                Business Needs
              </span>{" "}
              to Grow
              <span className="text-[#F4A900]">.</span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-base sm:leading-7 lg:text-[15px] xl:text-base">
              i-VANTAGE is a complete business hub combining workspace,
              business setup, compliance and growth support — all under one
              roof.
            </p>

            {/* =========================================================
                BUSINESS STATS CARD
            ========================================================= */}
            <div className="mt-6 grid w-full max-w-[520px] grid-cols-2 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm sm:mt-7 sm:rounded-2xl">
              {/* Stat 1 */}
              <div className="flex min-w-0 items-center gap-3 border-r border-blue-100 px-3 py-4 sm:px-5 sm:py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1E5BFF] sm:h-10 sm:w-10">
                  <Users size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-base font-extrabold leading-none text-[#1E5BFF] sm:text-lg">
                    100+
                  </p>

                  <p className="mt-1 truncate text-[9px] font-medium text-slate-600 sm:text-[11px]">
                    Business Support Services
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex min-w-0 items-center gap-3 px-3 py-4 sm:px-5 sm:py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1E5BFF] sm:h-10 sm:w-10">
                  <Building2 size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-base font-extrabold leading-none text-[#0A1F66] sm:text-lg">
                    One
                  </p>

                  <p className="mt-1 truncate text-[9px] font-medium text-slate-600 sm:text-[11px]">
                    Business Ecosystem
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================
                BUTTONS
            ========================================================= */}
            <div className="mt-6 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row">
              <Link href="/services" className="w-full sm:w-auto">
                <Button className="flex h-12 w-full items-center justify-center gap-2 px-6 sm:w-auto">
                  Explore Services
                  <ArrowRight size={17} />
                </Button>
              </Link>

              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-12 w-full px-6 sm:w-auto"
                >
                  Book a Visit
                </Button>
              </Link>
            </div>

            {/* =========================================================
                TRUST POINTS
            ========================================================= */}
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 sm:mt-7 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="flex min-w-0 items-center gap-1.5"
                >
                  <CheckCircle2
                    size={13}
                    className="shrink-0 text-[#1E5BFF]"
                    fill="currentColor"
                    strokeWidth={2}
                  />

                  <span className="truncate text-[9px] font-medium text-slate-600 sm:text-[10px]">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================
              RIGHT CONTENT
          ========================================================= */}
          <div className="relative min-w-0 lg:-mt-6 xl:-mt-10">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-10 top-5 h-40 w-40 rounded-full bg-blue-100 blur-3xl sm:h-56 sm:w-56" />

            <div className="relative">
              {/* =====================================================
                  MAIN IMAGE
              ===================================================== */}
              <div className="relative ml-auto w-full overflow-hidden rounded-[28px] sm:rounded-[38px] lg:rounded-l-[100px] lg:rounded-r-none xl:rounded-l-[130px]">
                <Image
                  src="/images/workspace/reception1.webp"
                  alt="i-VANTAGE Business Hub"
                  width={900}
                  height={650}
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 55vw"
                  className="h-[320px] w-full object-cover sm:h-[420px] md:h-[500px] lg:h-[500px] xl:h-[540px]"
                />

                {/* Soft image overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07194d]/10 via-transparent to-white/5" />
              </div>

              {/* =====================================================
                  SERVICE HIGHLIGHTS
              ===================================================== */}
              <div className="relative z-20 mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-4 sm:gap-2.5">
                {serviceHighlights.map((service) => {
                  const Icon = service.icon;

                  return (
                    <div
                      key={service.title}
                      className="group min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-2xl"
                    >
                      {/* Small Image */}
                      <div className="relative h-[72px] w-full overflow-hidden sm:h-[82px]">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Slight overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="p-2.5 sm:p-3">
                        {/* Icon */}
                        <div
                          className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 ${service.iconBg} ${service.iconColor}`}
                        >
                          <Icon size={14} strokeWidth={2.2} />
                        </div>

                        {/* Title */}
                        <h3 className="text-[10px] font-bold leading-4 text-[#0A1F66] sm:text-[11px]">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-1 line-clamp-2 text-[8px] leading-3.5 text-slate-500 sm:text-[9px] sm:leading-4">
                          {service.description}
                        </p>
                      </div>
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
        <div className="relative z-20 mb-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:mb-10 sm:rounded-3xl lg:mb-14">
          <div className="grid grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr]">
            {/* Intro */}
            <div className="col-span-2 flex items-center px-5 py-5 sm:px-7 sm:py-6 lg:col-span-1">
              <p className="max-w-md text-xs font-medium leading-5 text-slate-700 sm:text-sm sm:leading-6">
                A complete business ecosystem for founders, startups,
                professionals and growing businesses.
              </p>
            </div>

            {/* Business Services */}
            <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-5 sm:px-7 lg:border-l lg:border-t-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1E5BFF] sm:h-10 sm:w-10">
                <Users size={19} />
              </div>

              <div>
                <p className="text-lg font-extrabold leading-none text-[#1E5BFF] sm:text-xl">
                  100+
                </p>

                <p className="mt-1 text-[9px] font-medium text-slate-500 sm:text-[10px]">
                  Business Services
                </p>
              </div>
            </div>

            {/* Hub */}
            <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-5 sm:px-7 lg:border-l">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1E5BFF] sm:h-10 sm:w-10">
                <MapPin size={19} />
              </div>

              <div>
                <p className="text-lg font-extrabold leading-none text-[#0A1F66] sm:text-xl">
                  1 Hub
                </p>

                <p className="mt-1 text-[9px] font-medium text-slate-500 sm:text-[10px]">
                  Multiple Solutions
                </p>
              </div>
            </div>

            {/* Growth */}
            <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-5 sm:px-7 lg:border-l">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500 sm:h-10 sm:w-10">
                <Trophy size={19} />
              </div>

              <div>
                <p className="text-sm font-extrabold leading-none text-[#0A1F66] sm:text-base">
                  Your Growth
                </p>

                <p className="mt-1 text-[9px] font-medium text-slate-500 sm:text-[10px]">
                  Our Mission
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}