"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, Building2, MapPin, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

export default function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F9FF] via-white to-white pb-8 pt-6 sm:pb-18 sm:pt-14 lg:pb-20 lg:pt-16">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-64 sm:h-96 w-full max-w-7xl rounded-full bg-gradient-to-tr from-blue-200/40 via-blue-100/30 to-transparent blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/70 bg-white px-3 py-1 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1E5BFF]" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#0A1F66]">
              Our Services
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-3 sm:mt-6 text-2xl sm:text-4xl md:text-5xl lg:text-[3rem] font-black leading-[1.18] tracking-tight text-[#0A1F66]">
            Business Solutions Built{" "}
            <span className="bg-gradient-to-r from-[#0A1F66] via-[#1E5BFF] to-[#2D7CFF] bg-clip-text text-transparent">
              Around Your Needs
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-2.5 sm:mt-6 text-xs sm:text-lg sm:leading-8 leading-relaxed text-slate-600 line-clamp-3 sm:line-clamp-none">
            From flexible workspaces to business support services, i-VANTAGE
            brings essential solutions together under one roof. Dedicated
            desks, private cabins, managed offices, virtual registration,
            and growth services engineered for your business.
          </p>

          {/* CTAs */}
          <div className="mt-5 sm:mt-10 flex gap-2.5 sm:gap-4 justify-center">
            <a href="#business-support" className="flex-1 sm:flex-initial">
              <Button size="sm" className="w-full sm:w-auto h-10 sm:h-12 text-xs sm:text-sm px-4 sm:px-6">
                <span>Explore Services</span>
                <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </Button>
            </a>

            <Link href="/contact" className="flex-1 sm:flex-initial">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto h-10 sm:h-12 text-xs sm:text-sm px-4 sm:px-6"
              >
                Talk to Us
              </Button>
            </Link>
          </div>

          {/* Quick value indicators: 3 compact columns on mobile */}
          <div className="mt-6 sm:mt-10 grid grid-cols-3 gap-2 border-t border-slate-200/80 pt-4 text-center sm:text-left sm:gap-4 sm:pt-8">
            <a href="#business-support" className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 rounded-xl bg-white/70 p-2 sm:p-0 border border-slate-100 shadow-2xs hover:border-blue-200 transition sm:bg-transparent sm:border-0 sm:shadow-none">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                <Briefcase size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm font-bold text-[#0A1F66] truncate">
                  Support Desks
                </p>
                <p className="text-[9.5px] sm:text-[11px] text-slate-500 hidden sm:block">
                  Legal, Tax &amp; Growth
                </p>
              </div>
            </a>

            <a href="#workspace-solutions" className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 rounded-xl bg-white/70 p-2 sm:p-0 border border-slate-100 shadow-2xs hover:border-blue-200 transition sm:bg-transparent sm:border-0 sm:shadow-none">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                <Building2 size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm font-bold text-[#0A1F66] truncate">
                  Workspaces
                </p>
                <p className="text-[9.5px] sm:text-[11px] text-slate-500 hidden sm:block">
                  Managed &amp; Cabins
                </p>
              </div>
            </a>

            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-3 rounded-xl bg-white/70 p-2 sm:p-0 border border-slate-100 shadow-2xs sm:bg-transparent sm:border-0 sm:shadow-none">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                <MapPin size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm font-bold text-[#0A1F66] truncate">
                  Welldone Park
                </p>
                <p className="text-[9.5px] sm:text-[11px] text-slate-500 hidden sm:block">
                  Sohna Rd, Gurgaon
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
