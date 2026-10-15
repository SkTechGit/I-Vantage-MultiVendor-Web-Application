"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Send,
  Loader2,
  Info,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

import Logo from "../common/Logo";

// Curated Workspace Solutions (Clean, single-line labels)
const WORKSPACES = [
  { label: "Dedicated Workstations", href: "/gurugram" },
  { label: "Private Executive Cabins", href: "/gurugram" },
  { label: "Managed Enterprise Suites", href: "/gurugram" },
  { label: "Meeting & AV Boardrooms", href: "/gurugram" },
  { label: "Virtual Office (GST & ROC)", href: "/services" },
  { label: "Open Flexi Day Pass", href: "/gurugram" },
  { label: "Event & Workshop Spaces", href: "/contact" },
];

// Curated Business & Legal Services (Single-line, punchy labels)
const BUSINESS_SERVICES = [
  { label: "Company Incorporation", href: "/services" },
  { label: "GST & ROC Filings", href: "/services" },
  { label: "Trademark & IP Protection", href: "/services" },
  { label: "Accounting & Auditing", href: "/services" },
  { label: "Startup India Advisory", href: "/services" },
  { label: "Enterprise Tech & Cloud", href: "/services" },
];

// Prime NCR Business Hubs (Single-line labels)
const TOP_HUBS = [
  { label: "DLF Cyber City", href: "/gurugram" },
  { label: "Golf Course Road", href: "/gurugram" },
  { label: "Sohna Road (Tech Park)", href: "/gurugram" },
  { label: "Golf Course Extension", href: "/gurugram" },
  { label: "Udyog Vihar (Phases 1-5)", href: "/gurugram" },
  { label: "Sector 44 Institutional", href: "/gurugram" },
];

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "info" | "error";
    message: string;
  } | null>(null);

  // Scroll listener for floating Back-To-Top button above the bot
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setShowBackToTop(window.scrollY > 280);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/v1/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.alreadySubscribed) {
          setStatus({
            type: "info",
            message: "You're already subscribed to priority updates!",
          });
        } else {
          setStatus({
            type: "success",
            message: "Subscribed! Welcome email has been sent.",
          });
        }
        setTimeout(() => {
          setNewsletterEmail("");
        }, 2500);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Could not subscribe. Please check email.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setStatus(null);
      }, 6000);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <footer className="relative bg-white text-slate-700 border-t border-slate-200/80 selection:bg-[#1E5BFF] selection:text-white">
        {/* Subtle ambient gradient overlay for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50/70 to-transparent"
        />

        <div className="relative pt-12 pb-10 sm:pt-14 sm:pb-12 lg:pt-16 lg:pb-12">
          <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
            {/* Main 5-Column Responsive Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-7 lg:gap-6 xl:gap-8">
              
              {/* Column 1: Brand & Value Proposition & Newsletter (Span 3) */}
              <div className="sm:col-span-2 lg:col-span-3 space-y-4">
                {/* Brand Logo */}
                <div className="inline-flex items-center">
                  <Logo width={140} height={44} className="h-10 sm:h-11 w-auto" />
                </div>

                {/* Refined Pitch */}
                <p className="text-[13px] leading-relaxed text-slate-500 max-w-sm">
                  India&apos;s premier commercial workspace ecosystem. Curating Grade A coworking spaces, custom enterprise suites, and 100+ business solutions.
                </p>

                {/* Trust Verification Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/70 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#1E5BFF]" />
                  <span>DPIIT Recognized</span>
                  <span className="text-slate-300">•</span>
                  <span>MCA Verified</span>
                  <span className="text-slate-300">•</span>
                  <span>Zero Brokerage</span>
                </div>

                {/* Integrated Sleek Newsletter Box */}
                <div className="pt-1 max-w-sm">
                  <p className="text-xs font-semibold text-slate-800 mb-1.5">
                    Priority Dispatch & Center Drops
                  </p>
                  {status ? (
                    <div
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                        status.type === "success"
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                          : status.type === "info"
                          ? "bg-blue-50 border border-blue-200 text-blue-800"
                          : "bg-rose-50 border border-rose-200 text-rose-800"
                      }`}
                    >
                      {status.type === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      )}
                      {status.type === "info" && (
                        <Info className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                      {status.type === "error" && (
                        <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                      )}
                      <span>{status.message}</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="relative flex items-center">
                      <input
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter corporate email..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-22 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#1E5BFF] focus:bg-white focus:ring-2 focus:ring-[#1E5BFF]/10 disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="absolute right-1 inline-flex items-center gap-1 rounded-lg bg-[#0A1F66] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all duration-200 hover:bg-[#1E5BFF] active:scale-95 disabled:opacity-60 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Sending</span>
                          </>
                        ) : (
                          <>
                            <span>Join</span>
                            <Send className="h-2.5 w-2.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                {/* Social Network Links */}
                <div className="pt-1 flex items-center gap-2">
                  <Link
                    href="https://linkedin.com/company/i-vantage-business-hub"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-500 transition-all duration-200 hover:border-[#1E5BFF] hover:bg-blue-50/60 hover:text-[#1E5BFF] hover:-translate-y-0.5"
                  >
                    <FaLinkedinIn className="text-xs" />
                  </Link>

                  <Link
                    href="https://www.instagram.com/i_vantage_business_hub/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-500 transition-all duration-200 hover:border-[#E1306C] hover:bg-pink-50/60 hover:text-[#E1306C] hover:-translate-y-0.5"
                  >
                    <FaInstagram className="text-xs" />
                  </Link>

                  <Link
                    href="https://www.facebook.com/iVANTAGEBusinessHub"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-500 transition-all duration-200 hover:border-[#1877F2] hover:bg-blue-50/60 hover:text-[#1877F2] hover:-translate-y-0.5"
                  >
                    <FaFacebookF className="text-xs" />
                  </Link>

                  <Link
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-500 transition-all duration-200 hover:border-red-500 hover:bg-red-50/60 hover:text-red-500 hover:-translate-y-0.5"
                  >
                    <FaYoutube className="text-xs" />
                  </Link>

                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X / Twitter"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 bg-white text-slate-500 transition-all duration-200 hover:border-slate-800 hover:bg-slate-100 hover:text-slate-900 hover:-translate-y-0.5"
                  >
                    <FaXTwitter className="text-xs" />
                  </Link>
                </div>

                {/* Minimalist Live Concierge Status */}
                <div className="pt-0.5 flex items-center gap-2 text-xs text-slate-500">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-medium text-slate-600">Enterprise Concierge Online</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">Response &lt; 5 mins</span>
                </div>
              </div>

              {/* Column 2: Workspaces (Span 2) */}
              <div className="lg:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F66] mb-3.5">
                  Workspaces
                </h3>
                <ul className="space-y-1.5">
                  {WORKSPACES.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 bg-slate-50/70 hover:bg-white hover:text-[#1E5BFF] border border-slate-200/60 hover:border-blue-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_rgba(30,91,255,0.08)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                      >
                        <span className="truncate whitespace-nowrap">{item.label}</span>
                        <ChevronRight className="h-3 w-3 text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#1E5BFF] transition-all duration-150 shrink-0 ml-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Business & Legal (Span 3) */}
              <div className="lg:col-span-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F66] mb-3.5">
                  Business & Legal
                </h3>
                <ul className="space-y-1.5">
                  {BUSINESS_SERVICES.map((service) => (
                    <li key={service.label}>
                      <Link
                        href={service.href}
                        className="group flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 bg-slate-50/70 hover:bg-white hover:text-[#1E5BFF] border border-slate-200/60 hover:border-blue-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_rgba(30,91,255,0.08)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                      >
                        <span className="truncate whitespace-nowrap">{service.label}</span>
                        <ChevronRight className="h-3 w-3 text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#1E5BFF] transition-all duration-150 shrink-0 ml-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-2.5">
                  <Link
                    href="/services"
                    className="group flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#1E5BFF] bg-blue-50/60 hover:bg-[#1E5BFF] hover:text-white border border-blue-200/70 hover:border-[#1E5BFF] shadow-2xs hover:shadow-[0_2px_10px_rgba(30,91,255,0.25)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                  >
                    <span className="whitespace-nowrap">Explore 100+ services</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 shrink-0 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Column 4: Prime Locations (Span 2) */}
              <div className="lg:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F66] mb-3.5">
                  Top Hubs
                </h3>
                <ul className="space-y-1.5">
                  {TOP_HUBS.map((hub) => (
                    <li key={hub.label}>
                      <Link
                        href={hub.href}
                        className="group flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-600 bg-slate-50/70 hover:bg-white hover:text-[#1E5BFF] border border-slate-200/60 hover:border-blue-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_rgba(30,91,255,0.08)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                      >
                        <span className="truncate whitespace-nowrap">{hub.label}</span>
                        <ChevronRight className="h-3 w-3 text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#1E5BFF] transition-all duration-150 shrink-0 ml-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 5: Headquarters & Direct Contact (Span 2) */}
              <div className="lg:col-span-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A1F66] mb-3.5">
                  Headquarters
                </h3>
                
                <div className="space-y-2 text-xs">
                  {/* Physical Location Card */}
                  <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/60 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[12.5px] whitespace-nowrap">
                      <MapPin className="h-3.5 w-3.5 text-[#1E5BFF] shrink-0" />
                      <span className="truncate">Welldone Tech Park</span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Unit 213-214, 2nd Floor, Sec 48, Sohna Rd, Gurugram 122018
                    </p>
                    <a
                      href="https://maps.google.com/?q=Welldone+Tech+Park+Sector+48+Sohna+Road+Gurugram"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E5BFF] hover:underline pt-0.5"
                    >
                      <span>View Directions</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>

                  {/* Direct Contact Button Links */}
                  <a
                    href="tel:+919907800600"
                    className="group flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-[12px] font-semibold text-slate-700 bg-slate-50/70 hover:bg-white hover:text-[#1E5BFF] border border-slate-200/60 hover:border-blue-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                  >
                    <Phone className="h-3 w-3 text-slate-400 group-hover:text-[#1E5BFF] shrink-0" />
                    <span className="truncate whitespace-nowrap">+91 99078 00600</span>
                  </a>

                  <a
                    href="mailto:info@i-vantage.in"
                    className="group flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-[12px] font-medium text-slate-700 bg-slate-50/70 hover:bg-white hover:text-[#1E5BFF] border border-slate-200/60 hover:border-blue-200 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                  >
                    <Mail className="h-3 w-3 text-slate-400 group-hover:text-[#1E5BFF] shrink-0" />
                    <span className="truncate whitespace-nowrap">info@i-vantage.in</span>
                  </a>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 text-slate-400 text-[10.5px] whitespace-nowrap">
                    <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">Mon–Sat: 10 AM – 7 PM (24/7)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Copyright & Legal Links Bar (Back to Top removed from here) */}
            <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 lg:pr-24">
              <p className="text-center sm:text-left">
                © {new Date().getFullYear()}{" "}
                <span className="font-semibold text-slate-700">
                  i-VANTAGE Business Hub Private Limited
                </span>
                . All rights reserved.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs">
                <Link
                  href="/privacy-policy"
                  className="hover:text-slate-700 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="text-slate-200">•</span>
                <Link
                  href="/terms-of-use"
                  className="hover:text-slate-700 transition-colors"
                >
                  Terms of Use
                </Link>
                <span className="text-slate-200">•</span>
                <Link
                  href="/refund-policy"
                  className="hover:text-slate-700 transition-colors"
                >
                  Refund Policy
                </Link>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Floating Rounded Arrow 'Back to Top' Button (Positioned cleanly on the right edge in the middle, above the bot) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        title="Scroll to Top"
        className={`fixed right-3.5 sm:right-5 top-1/2 -translate-y-1/2 z-[9999] flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-700 shadow-[0_6px_24px_rgba(10,31,102,0.18)] hover:bg-[#1E5BFF] hover:border-[#1E5BFF] hover:text-white hover:shadow-[0_8px_28px_rgba(30,91,255,0.45)] hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer group ${
          showBackToTop
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-75 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-5 w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      </button>
    </>
  );
}