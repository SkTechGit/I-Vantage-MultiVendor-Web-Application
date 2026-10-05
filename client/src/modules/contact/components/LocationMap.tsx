"use client";

import React from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Building,
} from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import { contactConfig } from "../constants/contactConfig";

export default function LocationMap() {
  return (
    <section id="location" className="scroll-mt-20 border-t border-slate-200/80 bg-gradient-to-b from-[#FDFEFF] via-white to-slate-50/70 py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/70 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1E5BFF] shadow-2xs">
            <MapPin size={13} className="text-[#1E5BFF]" />
            <span>Our Location</span>
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
            Strategically Located in Gurgaon
          </h2>

          <p className="mt-3.5 text-xs sm:text-base leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Situated on Sohna Road in Sector 48, Welldone Tech Park offers
            seamless connectivity across Gurugram, Golf Course Extension, NH-48,
            and Cyber City.
          </p>
        </div>

        {/* 2-Column: Info Cards & Interactive Map */}
        <div className="mt-10 sm:mt-14 grid gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          
          {/* =========================================================
              LEFT COLUMN: 3 Location Details Cards
          ========================================================= */}
          <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
            
            {/* Card 1: Welldone Tech Park Address */}
            <div className="group rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-5 sm:p-7 shadow-xs transition-all duration-300 hover:border-blue-200 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] transition-colors group-hover:bg-[#0A1F66] group-hover:text-white shadow-2xs">
                  <MapPin size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#0A1F66]">
                    Welldone Tech Park
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    Unit No. 213–14, 2nd Floor
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Sector 48, Sohna Road, Gurgaon, Haryana – 122001, India
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      ASW (Asset Sense Workspaces)
                    </span>
                    <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#1E5BFF]">
                      Subhash Chowk Hub
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Operating Hours */}
            <div className="group rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-5 sm:p-7 shadow-xs transition-all duration-300 hover:border-blue-200 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] transition-colors group-hover:bg-[#0A1F66] group-hover:text-white shadow-2xs">
                  <Clock size={22} />
                </div>
                <div className="space-y-2 min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#0A1F66]">
                    Operating Hours
                  </h3>
                  <div>
                    <span className="text-xs font-semibold text-[#1E5BFF]">
                      Member Access:
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      24/7 Access (All Days)
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500">
                      Support &amp; Desk Hours:
                    </span>
                    <p className="text-sm font-medium text-slate-700">
                      Monday–Saturday, 10:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Direct Contact & Driving Directions */}
            <div className="group rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-5 sm:p-7 shadow-xs transition-all duration-300 hover:border-blue-200 hover:shadow-md">
              <h3 className="text-sm font-bold text-[#0A1F66]">
                Direct Contact &amp; Enquiries
              </h3>
              <div className="mt-3 space-y-2.5">
                <a
                  href={`tel:${contactConfig.phone}`}
                  className="flex items-center gap-3 text-xs font-semibold text-slate-700 transition hover:text-[#1E5BFF] sm:text-sm"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                    <Phone size={14} />
                  </div>
                  <span>{contactConfig.displayPhone}</span>
                </a>
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="flex items-center gap-3 text-xs font-semibold text-slate-700 transition hover:text-[#1E5BFF] sm:text-sm"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                    <Mail size={14} />
                  </div>
                  <span>{contactConfig.email}</span>
                </a>
              </div>

              {/* Get Driving Directions CTA */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <a
                  href={contactConfig.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center gap-2 py-2.5 text-xs font-bold shadow-md shadow-blue-500/15 hover:shadow-blue-500/25 transition-all"
                  >
                    <Navigation size={14} />
                    <span>Get Driving Directions</span>
                    <ExternalLink size={12} className="opacity-70" />
                  </Button>
                </a>
              </div>
            </div>

          </div>

          {/* =========================================================
              RIGHT COLUMN: Interactive Google Maps Embed
          ========================================================= */}
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl bg-slate-100 lg:col-span-7 relative group min-h-[380px] sm:min-h-[460px] lg:min-h-[500px]">
            {/* Floating Top Header Overlay Badge */}
            <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between gap-2 rounded-xl bg-white/95 px-3.5 py-2 shadow-md border border-slate-200/80 backdrop-blur-md">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-xs font-bold text-[#0A1F66] truncate">
                  Welldone Tech Park
                </span>
                <span className="hidden sm:inline text-[11px] text-slate-500 font-medium">
                  • Sector 48, Sohna Road
                </span>
              </div>
              <a
                href={contactConfig.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E5BFF] hover:underline shrink-0"
              >
                <span>Open in Maps</span>
                <ExternalLink size={11} />
              </a>
            </div>

            {/* Google Maps Iframe Embed */}
            <iframe
              title="i-VANTAGE Business Hub Location at Welldone Tech Park, Sector 48, Gurgaon"
              src={contactConfig.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
            />
          </div>

        </div>
      </Container>
    </section>
  );
}
