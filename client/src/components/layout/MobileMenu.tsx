"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  House,
  Users,
  BriefcaseBusiness,
  PhoneCall,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Building2,
  LogIn,
  UserPlus,
  Phone,
} from "lucide-react";

import Logo from "../common/Logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  {
    num: "01",
    label: "Home",
    href: "/",
    icon: House,
    description: "Welcome to i-VANTAGE Hub",
  },
  {
    num: "02",
    label: "Coworking Spaces",
    href: "/gurugram",
    icon: Building2,
    description: "Explore verified desks & cabins",
  },
  {
    num: "03",
    label: "List Your Space",
    href: "/list-your-space",
    icon: Sparkles,
    description: "Partner with us & list your workspace",
  },
  {
    num: "04",
    label: "About",
    href: "/about",
    icon: Users,
    description: "Who we are & our story",
  },
  {
    num: "05",
    label: "Services",
    href: "/services",
    icon: BriefcaseBusiness,
    description: "Workspaces & business solutions",
  },
  {
    num: "06",
    label: "Blogs",
    href: "/blogs",
    icon: BookOpen,
    description: "Insights, guides & updates",
  },
  {
    num: "07",
    label: "Contact",
    href: "/contact",
    icon: PhoneCall,
    description: "Visit us at Welldone Tech Park",
  },
];

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!open) return;

    // Add scroll-lock class to body
    document.body.classList.add("mobile-menu-open");

    // Focus the close button when drawer opens
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 150);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      // Simple focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("mobile-menu-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-navigation-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className={`fixed inset-0 z-[10000] lg:hidden transition-visibility duration-300 ${
        open ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-[#050F23]/45 backdrop-blur-md transition-opacity duration-300 ease-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Right-Side Off-Canvas Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 bottom-0 z-[10001] flex h-full w-[86vw] max-w-[400px] flex-col justify-between border-l border-slate-200/80 bg-white shadow-[-20px_0_60px_rgba(10,31,102,0.14)] transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top))",
          paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* Top Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 pb-4 sm:px-6">
          <div>
            <Logo width={65} height={52} className="h-10 w-auto" />
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="group flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-[#1E5BFF] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]"
          >
            <X
              size={20}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:rotate-90"
            />
          </button>
        </div>

        {/* Navigation Items (Scrollable Body) */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {/* Quick Connect: Phone & WhatsApp */}
          <div className="mb-5 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-3 shadow-xs">
            <div className="flex items-center justify-between px-1 mb-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Direct Connect
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Now
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Call Us */}
              <a
                href="tel:+919907800600"
                className="flex items-center gap-2.5 p-2 rounded-xl border border-blue-200/80 bg-white text-[#0A1F66] hover:bg-[#0A1F66] hover:text-white transition shadow-2xs group active:scale-95"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF] group-hover:bg-white/20 group-hover:text-white transition shadow-2xs">
                  <Phone size={14} strokeWidth={2.3} />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-white/80">Call Us</p>
                  <p className="text-[11px] font-bold truncate">+91 99078...</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919907800600?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20your%20i-VANTAGE%20Coworking%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl border border-emerald-500/25 bg-emerald-50/70 text-emerald-700 hover:bg-[#25D366] hover:text-white transition shadow-2xs group active:scale-95"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#25D366] group-hover:bg-white/20 group-hover:text-white transition shadow-2xs relative">
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M19.11 17.21c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.33-1.56-1.49-1.83-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26s.97 2.62 1.11 2.8c.14.18 1.91 2.92 4.63 4.1.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
                    <path d="M16.02 3C8.84 3 3 8.84 3 16.02c0 2.3.6 4.46 1.65 6.34L3 29l6.8-1.61a12.96 12.96 0 0 0 6.22 1.58h.01C23.2 28.97 29 23.13 29 16.02 29 8.84 23.2 3 16.02 3zm0 23.67h-.01c-2.02 0-4-.54-5.72-1.57l-.41-.24-4.04.96.96-3.94-.27-.41a10.96 10.96 0 1 1 9.49 5.2z" />
                  </svg>
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-white/80">WhatsApp</p>
                  <p className="text-[11px] font-bold truncate">Live Chat</p>
                </div>
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Menu Navigation
            </p>

            <nav className="mt-3 flex flex-col gap-1.5">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    style={{
                      transitionDelay: open ? `${80 + index * 45}ms` : "0ms",
                    }}
                    className={`group relative flex items-center justify-between rounded-xl px-3.5 py-3 transition-all duration-200 ease-out ${
                      open
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-4"
                    } ${
                      isActive
                        ? "bg-blue-50/80 border border-[#1E5BFF]/30 shadow-2xs"
                        : "border border-transparent hover:border-blue-200/60 hover:bg-slate-50 active:border-[#1E5BFF] active:bg-blue-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Subtle number */}
                      <span
                        className={`text-xs font-mono font-semibold transition-colors ${
                          isActive
                            ? "text-[#1E5BFF] font-bold"
                            : "text-slate-400 group-hover:text-[#1E5BFF] group-active:text-[#1E5BFF]"
                        }`}
                      >
                        {item.num}
                      </span>

                      {/* Small restrained icon */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? "bg-[#0A1F66] text-white"
                            : "bg-slate-100/80 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#1E5BFF] group-active:bg-[#0A1F66] group-active:text-white"
                        }`}
                      >
                        <Icon size={18} strokeWidth={1.85} />
                      </div>

                      {/* Label and description */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-base font-bold tracking-tight transition-colors ${
                              isActive
                                ? "text-[#0A1F66]"
                                : "text-slate-800 group-hover:text-[#1E5BFF] group-active:text-[#1E5BFF]"
                            }`}
                          >
                            {item.label}
                          </span>

                          {isActive && (
                            <span className="flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-[10px] font-bold text-[#1E5BFF]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#C8942C]" />
                              Active
                            </span>
                          )}
                        </div>

                        <p className="truncate text-xs text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Chevron */}
                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform duration-200 ${
                        isActive
                          ? "text-[#1E5BFF] translate-x-0.5"
                          : "text-slate-300 group-hover:text-[#1E5BFF] group-hover:translate-x-1 group-active:text-[#1E5BFF]"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Secondary CTA Card (Filling unused space) */}
          <div
            style={{
              transitionDelay: open ? "280ms" : "0ms",
            }}
            className={`mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-[#F5F9FF] via-[#EDF4FF] to-blue-50/50 p-4.5 shadow-xs transition-all duration-300 ease-out ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1E5BFF]">
              <Sparkles size={13} className="text-[#F4A900]" />
              <span>Workspace Solutions</span>
            </div>

            <h4 className="mt-1.5 text-sm font-bold text-[#0A1F66]">
              Looking for the Right Space?
            </h4>

            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Explore managed offices, dedicated desks, or partner with us to list your property.
            </p>

            <div className="mt-3.5 flex gap-2">
              <Link
                href="/contact"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A1F66] px-3.5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#1E5BFF] active:scale-[0.98]"
              >
                <span>Book a Visit</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/list-your-space"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#1E5BFF]/30 bg-white px-3.5 py-2.5 text-xs font-bold text-[#1E5BFF] shadow-xs transition-all hover:bg-blue-50 active:scale-[0.98]"
              >
                <Sparkles size={13} className="text-[#F4A900]" />
                <span>List Space</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Account Access</span>
            <span className="text-[#1E5BFF]">i-VANTAGE Hub</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-blue-200/80 bg-blue-50/70 text-[#1E5BFF] text-xs font-bold transition hover:bg-[#1E5BFF] hover:text-white"
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </Link>

            <Link
              href="/signup"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold transition hover:border-[#0A1F66] hover:text-[#0A1F66]"
            >
              <UserPlus size={14} />
              <span>Register</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Have a space to monetize?</span>
            <Link
              href="/list-your-space"
              onClick={onClose}
              className="font-bold text-[#1E5BFF] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>List Your Space</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}