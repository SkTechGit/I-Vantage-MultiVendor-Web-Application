"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogIn,
  ArrowRight,
  Building2,
  Lock,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  X,
  Phone,
  PhoneCall,
} from "lucide-react";

import Logo from "../common/Logo";
import Container from "../common/Container";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import HamburgerButton from "./HamburgerButton";

const CONTACT_PHONE = "9907800600";
const CONTACT_PHONE_DISPLAY = "+91 99078 00600";
const WHATSAPP_URL = `https://wa.me/91${CONTACT_PHONE}?text=${encodeURIComponent(
  "Hi, I would like to know more about your i-VANTAGE Coworking services."
)}`;

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.11 17.21c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.33-1.56-1.49-1.83-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26s.97 2.62 1.11 2.8c.14.18 1.91 2.92 4.63 4.1.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
      <path d="M16.02 3C8.84 3 3 8.84 3 16.02c0 2.3.6 4.46 1.65 6.34L3 29l6.8-1.61a12.96 12.96 0 0 0 6.22 1.58h.01C23.2 28.97 29 23.13 29 16.02 29 8.84 23.2 3 16.02 3zm0 23.67h-.01c-2.02 0-4-.54-5.72-1.57l-.41-.24-4.04.96.96-3.94-.27-.41a10.96 10.96 0 1 1 9.49 5.2z" />
    </svg>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);
  const mobilePortalRef = useRef<HTMLDivElement>(null);
  const mobilePopoverRef = useRef<HTMLDivElement>(null);

  // Close login dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isDesktopInside = portalRef.current && portalRef.current.contains(target);
      const isMobileInside = mobilePortalRef.current && mobilePortalRef.current.contains(target);
      const isPopoverInside = mobilePopoverRef.current && mobilePopoverRef.current.contains(target);
      if (!isDesktopInside && !isMobileInside && !isPopoverInside) {
        setPortalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    setPortalOpen(false);
    router.push(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(10,31,102,0.03)]">
        <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-17 items-center justify-between">
            {/* Left: Brand Logo & Desktop Navigation */}
            <div className="flex items-center gap-8 xl:gap-11 2xl:gap-14">
              <Logo />

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-4.5 xl:gap-6 2xl:gap-7.5 lg:flex">
                <NavLinks />
              </nav>
            </div>

            {/* Desktop Action CTA */}
            <div className="hidden items-center gap-2 xl:gap-2.5 lg:flex shrink-0 ml-auto" ref={portalRef}>
              {/* Quick Contact: Phone Call Icon Button */}
              <a
                href={`tel:+91${CONTACT_PHONE}`}
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200/80 bg-blue-50/70 text-[#1E5BFF] transition-all duration-300 hover:border-[#1E5BFF] hover:bg-gradient-to-r hover:from-[#0A1F66] hover:to-[#1E5BFF] hover:text-white hover:shadow-[0_4px_18px_rgba(30,91,255,0.32)] active:scale-95 shrink-0"
                title={`Call us at ${CONTACT_PHONE_DISPLAY}`}
                aria-label={`Call us at ${CONTACT_PHONE_DISPLAY}`}
              >
                <PhoneCall
                  size={16}
                  strokeWidth={2.2}
                  className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 shrink-0"
                />

                {/* Live Online Ring Indicator */}
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#1E5BFF] border-2 border-white group-hover:bg-cyan-300 transition-colors" />
                </span>

                {/* Luxury Hover Tooltip */}
                <span className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#0A1F66] px-2.5 py-1 text-[11px] font-bold text-white shadow-xl opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-bottom-9 z-50">
                  {CONTACT_PHONE_DISPLAY}
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#0A1F66]" />
                </span>
              </a>

              {/* Quick Contact: WhatsApp with live online pulse indicator */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex h-10 items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50/80 px-2.5 xl:px-3 text-xs font-bold text-emerald-700 transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white hover:shadow-[0_4px_16px_rgba(37,211,102,0.32)] active:scale-95 shrink-0"
                title="Chat with us on WhatsApp"
                aria-label="Chat with us on WhatsApp"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 group-hover:bg-white transition-colors" />
                </span>
                <WhatsAppIcon className="h-4 w-4 fill-current transition-transform duration-300 group-hover:scale-110 shrink-0" />
                <span className="hidden xl:inline tracking-tight font-bold whitespace-nowrap">
                  WhatsApp
                </span>
              </a>

              {/* Divider */}
              <div className="hidden xl:block h-5 w-px bg-slate-200/90 mx-0.5" />

            {/* List Your Space — Partner CTA */}
            <Link
              href="/list-your-space"
              className="inline-flex h-10 items-center gap-1.5 px-3 rounded-xl text-xs font-bold text-[#1E5BFF] bg-[#F0F5FF] border border-[#1E5BFF]/20 hover:bg-[#1E5BFF] hover:text-white transition-all shadow-xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4A900] shrink-0" />
              <span className="hidden xl:inline whitespace-nowrap">List Your Space</span>
              <span className="xl:hidden whitespace-nowrap">List Space</span>
            </Link>

            {/* Login Dropdown Button (Portal Selector) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setPortalOpen(!portalOpen)}
                className={`flex h-10 items-center gap-1.5 px-3 rounded-xl border text-xs font-bold transition-all duration-300 shadow-xs active:scale-95 ${
                  portalOpen
                    ? "border-[#1E5BFF] bg-[#F0F5FF] text-[#1E5BFF]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#1E5BFF]/30 hover:bg-[#F0F5FF] hover:text-[#1E5BFF]"
                }`}
                aria-expanded={portalOpen}
                aria-label="Login Options"
              >
                <LogIn size={15} strokeWidth={2.2} className="text-[#1E5BFF]" />
                <span>Login</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${portalOpen ? "rotate-180 text-[#1E5BFF]" : "text-slate-400"}`}
                />
              </button>

              {/* Desktop Login Portal Dropdown */}
              {portalOpen && (
                <div className="absolute right-0 top-full mt-2.5 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl ring-1 ring-black/10 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-2 py-1 mb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Select Login Portal
                    </p>
                    <button
                      type="button"
                      onClick={() => setPortalOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition active:scale-95"
                      aria-label="Close login menu"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* Vendor / Coworking Partner Option */}
                  <button
                    type="button"
                    onClick={() => handleNavigate("/vendor/login")}
                    className="w-full flex items-start gap-3.5 rounded-xl p-3 transition active:bg-blue-50 hover:bg-blue-50/70 group text-left cursor-pointer border border-transparent hover:border-blue-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A1F66] to-[#1E5BFF] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#0A1F66] group-hover:text-[#1E5BFF]">
                          Coworking Partner
                        </p>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E5BFF]" />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        Manage listings, inventory & leads
                      </p>
                    </div>
                  </button>

                  {/* Enterprise Admin Option */}
                  <button
                    type="button"
                    onClick={() => handleNavigate("/admin/login")}
                    className="w-full flex items-start gap-3.5 rounded-xl p-3 transition active:bg-slate-100 hover:bg-slate-50 group mt-1.5 text-left cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0A1F66] shrink-0 group-hover:bg-[#0A1F66] group-hover:text-white transition">
                      <Lock className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#0A1F66]">
                          Enterprise Admin
                        </p>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A1F66]" />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        Approvals, catalog & platform CMS
                      </p>
                    </div>
                  </button>

                  {/* Register / List Space shortcut */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 px-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Have a workspace?</span>
                    <button
                      type="button"
                      onClick={() => handleNavigate("/vendor/signup")}
                      className="font-bold text-[#1E5BFF] hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
                      <span>List Your Space &rarr;</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Book a Visit — ultra-premium CTA */}
            <Link href="/contact" className="group relative shrink-0">
              <span className="relative inline-flex h-10 items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#0A1F66] via-[#1E5BFF] to-[#0A1F66] bg-[length:200%_100%] px-4 text-xs font-bold text-white shadow-[0_4px_16px_rgba(10,31,102,0.25)] transition-all duration-500 hover:bg-right hover:shadow-[0_6px_24px_rgba(30,91,255,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 whitespace-nowrap">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Book a Visit</span>
                <ArrowRight size={14} strokeWidth={2.2} className="relative transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden" ref={mobilePortalRef}>
            {/* Phone quick button */}
            <a
              href={`tel:+91${CONTACT_PHONE}`}
              className="group flex h-9.5 w-9.5 items-center justify-center rounded-xl border border-blue-200/80 bg-blue-50/80 text-[#0A1F66] transition-all hover:bg-[#0A1F66] hover:text-white active:scale-95 shadow-xs"
              title={`Call us at ${CONTACT_PHONE_DISPLAY}`}
              aria-label={`Call us at ${CONTACT_PHONE_DISPLAY}`}
            >
              <Phone
                size={15}
                strokeWidth={2.3}
                className="text-[#1E5BFF] group-hover:text-white transition-colors"
              />
            </a>

            {/* WhatsApp quick button */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-9.5 w-9.5 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-50/90 text-emerald-600 transition-all hover:bg-[#25D366] hover:text-white active:scale-95 shadow-xs"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 group-hover:bg-white" />
              </span>
              <WhatsAppIcon className="h-4.5 w-4.5 fill-current transition-transform duration-200 group-hover:scale-110" />
            </a>

            {/* Tablet/Large Phone quick List Space link */}
            <Link
              href="/list-your-space"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#1E5BFF] bg-[#F0F5FF] border border-[#1E5BFF]/20 hover:bg-[#1E5BFF] hover:text-white transition-all shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
              <span>List Space</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setPortalOpen(!portalOpen);
                if (open) setOpen(false);
              }}
              className={`flex h-10 px-3 items-center gap-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs active:scale-95 ${
                portalOpen
                  ? "border-[#1E5BFF] bg-[#F0F5FF] text-[#1E5BFF]"
                  : "border-slate-200/80 bg-white text-slate-700 hover:border-[#1E5BFF]/30 hover:bg-[#F0F5FF] hover:text-[#1E5BFF]"
              }`}
              title="Login"
              aria-label="Login Options"
              aria-expanded={portalOpen}
            >
              <LogIn size={15} strokeWidth={2.2} className="text-[#1E5BFF]" />
              <span>Login</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${portalOpen ? "rotate-180 text-[#1E5BFF]" : "text-slate-400"}`}
              />
            </button>

            <HamburgerButton
              open={open}
              onClick={() => {
                setOpen(!open);
                if (portalOpen) setPortalOpen(false);
              }}
            />
          </div>
        </div>
      </div>

        {/* Mobile Login Dropdown / Popover (Anchored right below navbar on phone) */}
        {portalOpen && (
          <div className="lg:hidden">
            {/* Backdrop overlay for tap-outside */}
            <div
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
              onClick={() => setPortalOpen(false)}
            />

            {/* Floating Selection Card */}
            <div
              ref={mobilePopoverRef}
              className="fixed left-3.5 right-3.5 top-18 z-50 mx-auto max-w-sm rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl ring-1 ring-black/10 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-2 py-1 mb-2.5 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Select Login Portal
                </p>
                <button
                  type="button"
                  onClick={() => setPortalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition active:scale-95"
                  aria-label="Close login menu"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Vendor / Coworking Partner Option */}
              <button
                type="button"
                onClick={() => handleNavigate("/vendor/login")}
                className="w-full flex items-start gap-3.5 rounded-xl p-3 transition active:bg-blue-50 hover:bg-blue-50/70 group text-left cursor-pointer border border-transparent hover:border-blue-100"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A1F66] to-[#1E5BFF] flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#0A1F66] group-hover:text-[#1E5BFF]">
                      Coworking Partner
                    </p>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E5BFF]" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    Manage listings, inventory & leads
                  </p>
                </div>
              </button>


              {/* Enterprise Admin Option */}
              <button
                type="button"
                onClick={() => handleNavigate("/admin/login")}
                className="w-full flex items-start gap-3.5 rounded-xl p-3 transition active:bg-slate-100 hover:bg-slate-50 group mt-1.5 text-left cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0A1F66] shrink-0 group-hover:bg-[#0A1F66] group-hover:text-white transition">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-[#0A1F66]">
                      Enterprise Admin
                    </p>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0A1F66]" />
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    Approvals, catalog & platform CMS
                  </p>
                </div>
              </button>

              {/* Register / List Space shortcut */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 px-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Have a workspace?</span>
                <button
                  type="button"
                  onClick={() => handleNavigate("/vendor/signup")}
                  className="font-bold text-[#1E5BFF] hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
                  <span>List Your Space &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Ultra-Premium Mobile Navigation Drawer */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}