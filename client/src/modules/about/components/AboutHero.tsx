"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Zap, ShieldCheck } from "lucide-react";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F9FF] via-white to-white pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-18">
      {/* Decorative ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-96 w-full max-w-7xl rounded-full bg-gradient-to-tr from-blue-200/40 via-blue-100/30 to-transparent blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Content */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-3.5 py-1.5 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#1E5BFF]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0A1F66] sm:text-xs">
                About i-VANTAGE
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight text-[#0A1F66] sm:mt-6 sm:text-4xl md:text-5xl lg:text-[2.85rem] xl:text-[3.25rem]">
              A Professional Business Hub{" "}
              <span className="bg-gradient-to-r from-[#0A1F66] via-[#1E5BFF] to-[#2D7CFF] bg-clip-text text-transparent">
                Designed Around the Way You Work
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
              i-VANTAGE brings together flexible workspace solutions and
              business-support infrastructure for professionals, entrepreneurs,
              startups, and growing teams. From dedicated workstations and
              private cabins to managed office solutions, virtual office
              services, and meeting spaces, the focus is on giving businesses a
              professional environment without unnecessary complexity.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-3.5 sm:mt-10 sm:flex-row sm:justify-center lg:justify-start">
              <a href="#spaces" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Our Spaces
                  <ArrowRight size={17} />
                </Button>
              </a>

              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Talk to Our Team
                </Button>
              </Link>
            </div>

            {/* Quick highlights bar */}
            <div className="mt-10 grid grid-cols-3 gap-2 border-t border-slate-200/80 pt-6 text-left sm:gap-4 sm:pt-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF] sm:h-10 sm:w-10">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A1F66] sm:text-sm">24/7</p>
                  <p className="text-[11px] text-slate-500 sm:text-xs">Member Access</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF] sm:h-10 sm:w-10">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A1F66] sm:text-sm">100% Backup</p>
                  <p className="text-[11px] text-slate-500 sm:text-xs">Full-load Power</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF] sm:h-10 sm:w-10">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0A1F66] sm:text-sm">Sohna Road</p>
                  <p className="text-[11px] text-slate-500 sm:text-xs">Gurgaon Sec 48</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Back card decorative ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#0A1F66]/15 via-[#1E5BFF]/20 to-[#C8942C]/20 blur-lg" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-2xl sm:rounded-3xl sm:p-3">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl">
                  <Image
                    src="/images/workspace/reception1.webp"
                    alt="i-VANTAGE Business Hub Reception at Welldone Tech Park, Gurgaon"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F66]/65 via-transparent to-transparent" />

                  {/* Floating caption pill */}
                  <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/95 p-3 backdrop-blur-md shadow-lg sm:bottom-4 sm:left-4 sm:right-4 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#1E5BFF] sm:text-xs">
                          Welldone Tech Park
                        </p>
                        <p className="text-xs font-bold text-[#0A1F66] sm:text-sm">
                          Unit 213–14, 2nd Floor, Sohna Rd
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 sm:text-xs">
                        <ShieldCheck size={12} /> Active Hub
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
