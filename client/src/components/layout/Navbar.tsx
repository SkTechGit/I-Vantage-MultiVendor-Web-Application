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
} from "lucide-react";

import Logo from "../common/Logo";
import Container from "../common/Container";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import HamburgerButton from "./HamburgerButton";

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
      <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-white/95 backdrop-blur-md shadow-xs">
        <Container className="flex h-17 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <NavLinks />
          </nav>

          {/* Desktop Action CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* List Your Space — Partner CTA */}
            <Link
              href="/vendor/signup"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1E5BFF] bg-[#F0F5FF] border border-[#1E5BFF]/20 hover:bg-[#1E5BFF] hover:text-white transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
              <span>List Your Space</span>
            </Link>

            {/* Login Access Dropdown (Vendor + Admin) */}
            <div className="relative" ref={portalRef}>
              <button
                type="button"
                onClick={() => setPortalOpen(!portalOpen)}
                className={`group flex h-11 items-center gap-1.5 px-3.5 rounded-xl border transition-all duration-300 shadow-sm active:scale-95 ${
                  portalOpen
                    ? "border-[#1E5BFF] bg-[#F0F5FF] text-[#1E5BFF]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#1E5BFF]/30 hover:bg-[#F0F5FF] hover:text-[#1E5BFF]"
                }`}
                title="Login to Partner or Admin Portal"
                aria-label="Login Options"
                aria-expanded={portalOpen}
              >
                <LogIn size={17} strokeWidth={2.2} className="text-[#1E5BFF]" />
                <span className="text-xs font-bold">Login</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${portalOpen ? "rotate-180 text-[#1E5BFF]" : "text-slate-400"}`}
                />
              </button>

              {/* Portal Dropdown Menu */}
              {portalOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-2 py-1.5 mb-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Select Login Portal
                    </p>
                  </div>

                  {/* Vendor / Partner Option */}
                  <button
                    type="button"
                    onClick={() => handleNavigate("/vendor/login")}
                    className="w-full flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-blue-50/70 group text-left cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0A1F66] to-[#1E5BFF] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#0A1F66] group-hover:text-[#1E5BFF]">
                          Coworking Partner
                        </p>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1E5BFF]" />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Manage listings, inventory & leads
                      </p>
                    </div>
                  </button>


                  {/* Admin Option */}
                  <button
                    type="button"
                    onClick={() => handleNavigate("/admin/login")}
                    className="w-full flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 group mt-1 text-left cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#0A1F66] shrink-0 group-hover:bg-[#0A1F66] group-hover:text-white transition">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#0A1F66]">
                          Enterprise Admin
                        </p>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0A1F66]" />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Approvals, catalog & platform CMS
                      </p>
                    </div>
                  </button>

                  {/* Register shortcut */}
                  <div className="mt-2 pt-2 border-t border-slate-100 px-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">New space partner?</span>
                    <button
                      type="button"
                      onClick={() => handleNavigate("/vendor/signup")}
                      className="font-bold text-[#1E5BFF] hover:underline cursor-pointer"
                    >
                      Register Space &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Book a Visit — ultra-premium CTA */}
            <Link href="/contact" className="group relative">
              <span className="relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0A1F66] via-[#1E5BFF] to-[#0A1F66] bg-[length:200%_100%] px-5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(10,31,102,0.3)] transition-all duration-500 hover:bg-right hover:shadow-[0_6px_28px_rgba(30,91,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Book a Visit</span>
                <ArrowRight size={16} strokeWidth={2.2} className="relative transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2 lg:hidden" ref={mobilePortalRef}>
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
        </Container>

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

              {/* Register shortcut */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 px-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">New space partner?</span>
                <button
                  type="button"
                  onClick={() => handleNavigate("/vendor/signup")}
                  className="font-bold text-[#1E5BFF] hover:underline cursor-pointer"
                >
                  Register Space &rarr;
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