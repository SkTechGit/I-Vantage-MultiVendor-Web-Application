"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building,
  PlusCircle,
  ListFilter,
  Layers,
  BarChart3,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { marketplaceApi } from "@/lib/marketplace.api";
import Logo from "@/components/common/Logo";
import { useRealtime } from "@/context/RealtimeContext";

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar Content (shared between mobile drawer & desktop fixed sidebar)
// ─────────────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

function VendorSidebarContent({
  vendor,
  navItems,
  pathname,
  onNavigate,
  onLogout,
}: {
  vendor: any;
  navItems: NavItem[];
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  return (
    <aside className="flex h-full flex-col justify-between bg-[#0A1F66] text-white">
      {/* Top */}
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/vendor" className="flex items-center gap-3" onClick={onNavigate}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md shadow-blue-950/30 shrink-0 p-1.5">
              <Logo href={null} width={45} height={36} className="h-7 w-auto object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
                i-VANTAGE
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#D99000] font-semibold block mt-0.5">
                Vendor Partner Portal
              </span>
            </div>
          </Link>
          {/* Close button — only shown on mobile slide-over */}
          {onNavigate && (
            <button
              type="button"
              onClick={onNavigate}
              aria-label="Close sidebar"
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Business Card Pill */}
        {vendor && (
          <div className="mx-4 my-4 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E5BFF]/20 text-[#60A5FA] flex items-center justify-center font-bold shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {vendor.businessName || vendor.name}
              </p>
              <p className="text-[11px] text-white/60 truncate">{vendor.email}</p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="px-3 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/vendor"
                ? pathname === "/vendor"
                : item.href === "/vendor/listings/new"
                ? pathname === "/vendor/listings/new"
                : item.href === "/vendor/listings"
                ? pathname === "/vendor/listings" ||
                  (pathname.startsWith("/vendor/listings/") &&
                    pathname !== "/vendor/listings/new")
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? "bg-[#1E5BFF] text-white shadow-md shadow-blue-900/30 font-bold"
                    : "text-white/70 hover:bg-white/10 hover:text-white font-medium"
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/90" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-1.5 pb-6">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </span>
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">Live</span>
        </Link>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition text-left"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Vendor Layout
// ─────────────────────────────────────────────────────────────────────────────
export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isConnected } = useRealtime();
  const [vendor, setVendor] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    marketplaceApi
      .me("vendor")
      .then((user) => {
        setVendor(user);
      })
      .catch(() => {
        router.push("/vendor/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await marketplaceApi.logout("vendor");
    router.push("/vendor/login");
  };

  const navItems: NavItem[] = [
    { label: "Dashboard Overview", href: "/vendor", icon: BarChart3 },
    { label: "Add New Property", href: "/vendor/listings/new", icon: PlusCircle },
    { label: "My Listings", href: "/vendor/listings", icon: ListFilter },
    { label: "Custom Services", href: "/vendor/services", icon: Layers },
    { label: "Performance Analytics", href: "/vendor/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* ── MOBILE BACKDROP ─────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MOBILE SLIDE-OVER SIDEBAR ─────────────────────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <VendorSidebarContent
          vendor={vendor}
          navItems={navItems}
          pathname={pathname}
          onNavigate={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* ── DESKTOP FIXED SIDEBAR ─────────────────────────────── */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-30 w-72">
        <VendorSidebarContent
          vendor={vendor}
          navItems={navItems}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </div>

      {/* ── MAIN CONTENT (pushed right on desktop) ────────────── */}
      <div className="flex flex-col min-h-screen lg:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Hamburger – visible on mobile/tablet only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#0A1F66] leading-tight">
                Coworking Partner Center
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Manage your workspaces, pricing, inventory &amp; listing status.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Sync Indicator */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors duration-300 ${
                isConnected
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                  : "bg-amber-50 text-amber-700 border border-amber-200/80"
              }`}
              title={
                isConnected
                  ? "Real-time connection active. Instant cross-device sync enabled."
                  : "Reconnecting real-time stream..."
              }
            >
              <span className="relative flex h-2 w-2">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isConnected ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  }`}
                />
              </span>
              <span>{isConnected ? "Live Sync" : "Syncing..."}</span>
            </div>

            <Link
              href="/vendor/listings/new"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[#1E5BFF] text-white hover:bg-blue-700 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Add Property
            </Link>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0A1F66]">
                {vendor?.name?.charAt(0) || "V"}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-800 block">
                  {vendor?.name || "Partner"}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Partner
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
