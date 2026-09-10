"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, Building2, MapPin, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

export default function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F9FF] via-white to-white pb-14 pt-10 sm:pb-18 sm:pt-14 lg:pb-20 lg:pt-16">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-96 w-full max-w-7xl rounded-full bg-gradient-to-tr from-blue-200/40 via-blue-100/30 to-transparent blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-3.5 py-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#1E5BFF]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0A1F66] sm:text-xs">
              Our Services
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-5 text-3xl font-bold leading-[1.18] tracking-tight text-[#0A1F66] sm:mt-6 sm:text-4xl md:text-5xl lg:text-[3rem]">
            Business Solutions Built{" "}
            <span className="bg-gradient-to-r from-[#0A1F66] via-[#1E5BFF] to-[#2D7CFF] bg-clip-text text-transparent">
              Around Your Needs
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            From flexible workspaces to business support services, i-VANTAGE
            brings essential solutions together under one roof. Whether you need
            a dedicated workstation, private cabin, managed office, virtual
            office or support for running and growing your business, our
            solutions are designed to reduce operational complexity and help you
            focus on what matters.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:mt-10 sm:flex-row sm:gap-4">
            <a href="#workspace-solutions" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                <span>Explore Services</span>
                <ArrowRight size={17} />
              </Button>
            </a>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Talk to Us
              </Button>
            </Link>
          </div>

          {/* Quick value indicators */}
          <div className="mt-10 grid grid-cols-1 gap-3 border-t border-slate-200/80 pt-6 text-left sm:grid-cols-3 sm:gap-4 sm:pt-8">
            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 border border-slate-100 shadow-2xs sm:bg-transparent sm:border-0 sm:shadow-none sm:p-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1F66] sm:text-sm">
                  Workspace Solutions
                </p>
                <p className="text-[11px] text-slate-500">
                  Managed, Cabins &amp; Desks
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 border border-slate-100 shadow-2xs sm:bg-transparent sm:border-0 sm:shadow-none sm:p-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1F66] sm:text-sm">
                  Business Support
                </p>
                <p className="text-[11px] text-slate-500">
                  Legal, Tax, HR &amp; Growth
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 border border-slate-100 shadow-2xs sm:bg-transparent sm:border-0 sm:shadow-none sm:p-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A1F66] sm:text-sm">
                  Welldone Tech Park
                </p>
                <p className="text-[11px] text-slate-500">
                  Sohna Road, Gurgaon
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
