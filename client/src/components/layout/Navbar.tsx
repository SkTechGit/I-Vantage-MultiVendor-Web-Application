"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

import Logo from "../common/Logo";
import Container from "../common/Container";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import HamburgerButton from "./HamburgerButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-md shadow-xs">
        <Container className="flex h-17 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 lg:flex">
            <NavLinks />
          </nav>

          {/* Desktop Action CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Admin Portal — icon button matching CTA height */}
            <Link
              href="/admin/login"
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition-all duration-300 hover:border-[#1E5BFF]/30 hover:bg-[#F0F5FF] hover:text-[#1E5BFF] hover:shadow-md active:scale-95"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <ShieldCheck size={20} strokeWidth={1.8} className="transition-transform duration-300 group-hover:scale-110" />
            </Link>

            {/* Book a Visit — ultra-premium CTA */}
            <Link href="/contact" className="group relative">
              <span className="relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0A1F66] via-[#1E5BFF] to-[#0A1F66] bg-[length:200%_100%] px-6 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(10,31,102,0.3)] transition-all duration-500 hover:bg-right hover:shadow-[0_6px_28px_rgba(30,91,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Book a Visit</span>
                <ArrowRight size={16} strokeWidth={2.2} className="relative transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/admin/login"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-400 shadow-xs transition-all hover:border-[#1E5BFF]/30 hover:bg-[#F0F5FF] hover:text-[#1E5BFF] active:scale-95"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <ShieldCheck size={18} strokeWidth={1.8} />
            </Link>

            <HamburgerButton
              open={open}
              onClick={() => setOpen(!open)}
            />
          </div>
        </Container>
      </header>

      {/* Ultra-Premium Mobile Navigation Drawer */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}