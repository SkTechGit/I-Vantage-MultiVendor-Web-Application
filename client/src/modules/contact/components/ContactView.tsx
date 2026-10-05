"use client";

import React from "react";
import Image from "next/image";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import Container from "@/components/common/Container";
import ContactForm from "./ContactForm";
import LocationMap from "./LocationMap";
import { contactConfig } from "../constants/contactConfig";

export default function ContactView() {
  const addressText =
    typeof contactConfig.address === "object"
      ? (contactConfig.address as any).full
      : contactConfig.address;

  return (
    <div className="flex flex-col bg-white">
      {/* =========================================================
          1. HERO SPLIT-CARD SECTION (Corporate Command Center)
      ========================================================= */}
      <section className="relative min-h-[calc(100vh-5rem)] bg-[#070D1E] py-8 sm:py-12 lg:py-16 flex items-center justify-center overflow-hidden">
        {/* 1. Atmospheric Ambient Glows (Reference 1 Aesthetic) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-blue-600/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-indigo-500/15 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-sky-400/8 blur-[100px]"
      />

      {/* 2. Architectural Grid Pattern Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      <Container className="relative z-10 max-w-7xl">
        {/* 3. Master Split-Card Container (Hybrid of Reference 1 & Reference 2) */}
        <div className="overflow-hidden rounded-[32px] sm:rounded-[40px] border border-white/10 bg-[#0C152B]/85 backdrop-blur-2xl shadow-[0_32px_90px_rgba(0,0,0,0.65)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* =========================================================
                LEFT COLUMN: 3D Architectural Showcase & Direct Reach
            ========================================================= */}
            <div className="lg:col-span-6 p-6 sm:p-9 lg:p-11 flex flex-col justify-between space-y-7 relative overflow-hidden">
              {/* Subtle localized glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-[#1E5BFF]/20 rounded-full blur-3xl"
              />

              {/* A. Top: Headline & Intro (Preserving exact requested title) */}
              <div className="space-y-3.5 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-[#1E5BFF] animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">
                    i-VANTAGE Business Hub • Gurugram
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-[1.12] tracking-tight text-white">
                  Let&apos;s Build Your{" "}
                  <span className="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
                    Business Together
                  </span>
                </h1>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-xl">
                  Whether you need an executive private cabin, flexible desk, enterprise managed floor, or corporate business advisory, our Gurugram relationship desk is ready to assist.
                </p>
              </div>

              {/* B. Center: 3D Isometric Architectural Workspace Model (Reference 2 Inspiration) */}
              <div className="relative group rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-gradient-to-b from-white/10 to-white/0">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/images/contact/isometric-office.jpg"
                    alt="i-VANTAGE Luxury Corporate Workspace & Architectural Hub, Welldone Tech Park, Gurgaon"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C152B]/90 via-[#0C152B]/20 to-black/10" />

                  {/* Floating Verified Hub & Location Map Anchor */}
                  <a
                    href="#location"
                    className="absolute bottom-3 left-3 right-3 rounded-2xl bg-[#0A1633]/92 backdrop-blur-md border border-white/15 p-3 flex items-center justify-between gap-3 shadow-lg hover:border-blue-400/50 hover:bg-[#0E1E45]/95 transition-all group/loc cursor-pointer"
                    title="Click to view interactive Google Map below"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-[#60A5FA] border border-blue-400/30 shadow-2xs group-hover/loc:bg-[#1E5BFF] group-hover/loc:text-white transition">
                        <Building2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-300">
                          Flagship Location
                        </p>
                        <p className="text-xs font-bold text-white truncate">
                          Welldone Tech Park, Sohna Road, Gurgaon
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold shrink-0 group-hover/loc:bg-[#1E5BFF] group-hover/loc:text-white transition">
                      <MapPin size={11} />
                      <span className="hidden sm:inline">View Map ↓</span>
                      <span className="sm:hidden">Map ↓</span>
                    </span>
                  </a>
                </div>
              </div>

              {/* C. Bottom: Direct Contact Channels & Quick Response */}
              <div className="space-y-3 pt-1 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${contactConfig.phone}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 group-hover:bg-[#1E5BFF] group-hover:text-white transition">
                      <Phone size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Direct Telephone
                      </p>
                      <p className="text-xs font-bold text-white group-hover:text-blue-300 transition truncate">
                        {contactConfig.displayPhone}
                      </p>
                    </div>
                    <ArrowUpRight size={13} className="ml-auto text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </a>

                  <a
                    href={`mailto:${contactConfig.email}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 group-hover:bg-[#1E5BFF] group-hover:text-white transition">
                      <Mail size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Email Desk
                      </p>
                      <p className="text-xs font-bold text-white group-hover:text-blue-300 transition truncate">
                        {contactConfig.email}
                      </p>
                    </div>
                    <ArrowUpRight size={13} className="ml-auto text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                  </a>
                </div>

                {/* Instant Response Strip */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/60 to-indigo-950/70 border border-blue-500/25">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#F4A900] shrink-0" />
                    <div>
                      <span className="block text-[11px] font-bold text-blue-100">
                        Need an immediate callback?
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Connect instantly with our on-duty manager
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <a
                      href={`tel:${contactConfig.phone}`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition active:scale-95"
                    >
                      <Phone size={12} />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={contactConfig.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition active:scale-95 shadow-sm"
                    >
                      <MessageCircle size={12} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================
                RIGHT COLUMN: Pure White Form Card (Reference 1 Style)
            ========================================================= */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-9 lg:p-11 flex flex-col justify-between m-2 sm:m-3 lg:m-3.5 rounded-[26px] sm:rounded-[32px] shadow-2xl border border-slate-100">
              <div>
                {/* Form Header */}
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#1E5BFF]">
                    <Sparkles size={12} className="text-[#F4A900]" />
                    Send a Request / Get In Touch
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0A1F66] mt-1">
                    How Can We Help You?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Share your space requirements and receive an immediate tailored proposal.
                  </p>
                </div>

                {/* Form Component */}
                <ContactForm isCardOnly={true} />
              </div>

              {/* Form Trust Micro-Footer */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  100% Confidential Guarantee
                </span>
                <span className="font-semibold text-slate-500">
                  Avg. response: &lt; 15 mins
                </span>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>

    {/* =========================================================
        2. STRATEGIC LOCATION & INTERACTIVE GOOGLE MAP SECTION
    ========================================================= */}
    <LocationMap />
  </div>
);
}
