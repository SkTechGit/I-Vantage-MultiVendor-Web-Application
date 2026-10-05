"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  ShieldCheck,
  Scale,
  Briefcase,
  MonitorCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Container from "@/components/common/Container";
import { Service } from "@/modules/service/service.types";
import { Category } from "@/modules/category/category.types";

interface Props {
  categories?: Category[];
  services?: Service[];
}

interface SolutionCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: React.ElementType;
  href: string;
  highlights: string[];
}

const SOLUTIONS: SolutionCard[] = [
  {
    id: "managed-office",
    title: "Managed Enterprise Offices",
    subtitle: "Turnkey Headquarter Solutions",
    description:
      "Custom-built, fully serviced private enterprise floors for teams of 20 to 500+ with dedicated branding, CXO suites, and private IT infrastructure.",
    badge: "Enterprise HQ",
    icon: Building2,
    href: "/services#managed-office",
    highlights: ["Custom layout & fitouts", "Dedicated leased line", "Private reception"],
  },
  {
    id: "private-cabins",
    title: "Executive Private Cabins",
    subtitle: "Acoustic Privacy & Prestige",
    description:
      "Soundproofed, lockable private offices for startups and leadership teams requiring confidentiality, executive prestige, and 24/7 keycard access.",
    badge: "High Privacy",
    icon: ShieldCheck,
    href: "/gurugram?category=private-cabin",
    highlights: ["Ergonomic executive chairs", "24/7 biometric security", "Meeting room credits"],
  },
  {
    id: "dedicated-desks",
    title: "Dedicated Coworking Desks",
    subtitle: "Your Reserved Daily Workstation",
    description:
      "Fixed ergonomic desks in prime Grade-A tech parks with high-speed fiber internet, storage lockers, and a vibrant community of founders.",
    badge: "Most Popular",
    icon: Briefcase,
    href: "/gurugram?category=dedicated-desk",
    highlights: ["Reserved desk & locker", "Unlimited artisanal coffee", "Zero lock-in flexibility"],
  },
  {
    id: "meeting-rooms",
    title: "Meeting & Boardroom Suites",
    subtitle: "High-Tech Collaboration Spaces",
    description:
      "High-tech meeting rooms equipped with 4K video conferencing, smart boards, and white-glove hospitality bookable on flexible hourly rates.",
    badge: "By The Hour",
    icon: MonitorCheck,
    href: "/gurugram?category=meeting-room",
    highlights: ["4K VC & audio systems", "Digital smart board", "Dedicated pantry service"],
  },
  {
    id: "virtual-office",
    title: "Virtual Office & GST Registration",
    subtitle: "Prime Business Address",
    description:
      "Prime commercial business address for company incorporation, GST registrations, professional mail handling, and government ROC compliance.",
    badge: "Pan-India",
    icon: Scale,
    href: "/services#virtual-office",
    highlights: ["Authorized NOC & utility bill", "Courier & mail handling", "Signage display"],
  },
  {
    id: "business-support",
    title: "Corporate Legal & Tax Advisory",
    subtitle: "Full-Spectrum Compliance",
    description:
      "End-to-end legal drafting, taxation, regulatory compliance, and strategic business consulting to scale your enterprise without operational friction.",
    badge: "Business Hub",
    icon: Users,
    href: "/services#business-support",
    highlights: ["Direct CA/CS consultation", "Company filings & audit", "Contract review"],
  },
];

export default function ServicesSection({}: Props) {
  return (
    <section
      id="serviceSection"
      className="relative py-20 sm:py-28 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 overflow-hidden"
    >
      {/* Subtle Background Glows */}
      <div className="absolute left-1/4 top-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-[#F4A900]/5 rounded-full blur-3xl pointer-events-none" />

      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-blue-50 border border-blue-100 text-[#0A1F66] uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
            <span>Tailored Workspace Solutions</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0A1F66] tracking-tight leading-tight">
            Flexible Workspaces Built For{" "}
            <span className="bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#1E5BFF] bg-clip-text text-transparent">
              Every Stage of Growth
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From single dedicated desks to custom-built 200-seat enterprise headquarters, explore curated office solutions with transparent commercial terms and enterprise support.
          </p>
        </div>

        {/* Ultra-Premium Solution Cards Grid: 2-columns on mobile, 3-columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-7">
          {SOLUTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-3.5 sm:p-7 text-left shadow-[0_2px_12px_rgba(10,31,102,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#1E5BFF]/50 hover:shadow-[0_20px_40px_rgba(30,91,255,0.09)]"
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-5">
                    <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-50 text-[#1E5BFF] border border-blue-100/70 transition-all duration-300 group-hover:bg-[#0A1F66] group-hover:text-white group-hover:border-[#0A1F66]">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
                    </div>

                    <span className="inline-flex items-center px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#1E5BFF] transition-colors border border-slate-200/70 group-hover:border-blue-200">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-[#1E5BFF]">
                    {item.subtitle}
                  </p>
                  <h3 className="text-xs sm:text-lg font-bold text-[#0A1F66] transition-colors group-hover:text-[#1E5BFF] mt-0.5 line-clamp-1 sm:line-clamp-none">
                    {item.title}
                  </h3>

                  <p className="mt-1 sm:mt-2.5 text-[10px] sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Highlights Bullet List: Hidden on mobile to keep cards delightfully compact */}
                  <div className="hidden sm:block mt-5 space-y-1.5 pt-4 border-t border-slate-100">
                    {item.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs font-medium text-slate-600"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#1E5BFF]">
                  <span className="truncate">Explore Solutions</span>
                  <div className="flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-blue-50 group-hover:bg-[#1E5BFF] group-hover:text-white transition-all duration-300">
                    <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Banner Linking Exclusively to /services */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-50/90 via-white to-blue-50/90 border border-blue-200/80 p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-black text-[#0A1F66]">
              Looking for Corporate Infrastructure, Taxation & Legal Support?
            </h4>
            <p className="text-xs text-slate-500 max-w-xl">
              Access company registration, CA/CS advisory, HR recruitment, and full business infrastructure under our dedicated Business Hub.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0A1F66] hover:bg-[#12319A] text-white text-xs font-bold shadow-md shadow-blue-950/15 transition-all shrink-0 active:scale-95"
          >
            <span>Explore Full Business Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
