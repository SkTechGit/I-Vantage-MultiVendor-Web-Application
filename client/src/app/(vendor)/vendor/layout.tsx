"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building,
  PlusCircle,
  ListFilter,
  Layers,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Bell,
  Sparkles,
} from "lucide-react";
import { marketplaceApi } from "@/lib/marketplace.api";
import Logo from "@/components/common/Logo";
import { useRealtime } from "@/context/RealtimeContext";

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
      .me()
      .then((user) => {
        setVendor(user);
      })
      .catch(() => {
        // If unauthorized, redirect to login
        router.push("/vendor/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await marketplaceApi.logout();
    router.push("/vendor/login");
  };

  const navItems = [
    {
      label: "Dashboard Overview",
      href: "/vendor",
      icon: BarChart3,
    },
    {
      label: "Add New Property",
      href: "/vendor/listings/new",
      icon: PlusCircle,
    },
    {
      label: "My Listings",
      href: "/vendor/listings",
      icon: ListFilter,
    },
    {
      label: "Customer Leads",
      href: "/vendor/leads",
      icon: Users,
    },
    {
      label: "Custom Services",
      href: "/vendor/services",
      icon: Layers,
    },
    {
      label: "Performance Analytics",
      href: "/vendor/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1F66] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-0 max-lg:-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/vendor" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md shadow-blue-950/30 shrink-0 p-1.5">
                <Logo href={null} width={45} height={36} className="h-7 w-auto object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white block">
                  i-VANTAGE
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#D99000] font-semibold block">
                  Vendor Partner Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Business Card Pill */}
          {vendor && (
            <div className="mx-4 my-4 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#1E5BFF]/20 text-[#1E5BFF] flex items-center justify-center font-bold">
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
          <nav className="p-4 space-y-1.5">
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
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs transition-all ${
                    isActive
                      ? "bg-[#1E5BFF] text-white shadow-md shadow-blue-900/30 font-bold"
                      : "text-white/70 hover:bg-white/10 hover:text-white font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-white/60"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" /> View Public Site
            </span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#0A1F66]">
                Coworking Partner Center
              </h1>
              <p className="text-xs text-slate-500">
                Manage your workspaces, pricing, inventory & listing status.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Sync Status Indicator */}
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isConnected ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  }`}
                ></span>
              </span>
              <span>{isConnected ? "Live Sync" : "Syncing..."}</span>
            </div>

            <Link
              href="/vendor/listings/new"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#1E5BFF] text-white hover:bg-blue-700 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Add Property
            </Link>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0A1F66]">
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

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
