"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  Mail,
  BookOpen,
  ExternalLink,
  LogOut,
  ShieldCheck,
  AlertCircle,
  Menu,
  X,
  User,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { professionalsApi, ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  children: React.ReactNode;
}

export default function ProfessionalDashboardLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfessionalProfileItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await professionalsApi.getMyProfile();
        const p = res?.profile || res;
        if (p && (p._id || p.fullName)) {
          setProfile(p);
        }
      } catch (err) {
        console.error("Failed to load professional self profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const navItems = [
    {
      title: "Overview",
      href: "/dashboard/professional",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Profile Editor",
      href: "/dashboard/professional/profile",
      icon: UserCheck,
    },
    {
      title: "Articles & Blogs",
      href: "/dashboard/professional/blogs",
      icon: BookOpen,
    },
    {
      title: "Services & Fees",
      href: "/dashboard/professional/services",
      icon: Briefcase,
    },
    {
      title: "Client Enquiries",
      href: "/dashboard/professional/enquiries",
      icon: Mail,
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout?portal=professional", {
        method: "POST",
        headers: { "x-portal": "professional" },
      });
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem("iv_pro_user");
    } catch {}
    router.push("/professional/login");
  };

  const completeness = profile?.completeness || 75;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo width={130} height={40} className="h-8 w-auto" />
            <span className="hidden sm:inline-block text-[11px] font-black uppercase tracking-wider text-[#1E5BFF] bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full">
              Professional Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {profile?.slug && (
              <Link
                href={`/professionals/${profile.slug}`}
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#1E5BFF] bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
              >
                <span>View Live Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* User Pill */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0A1F66] text-white flex items-center justify-center font-bold text-xs">
                {profile?.fullName ? profile.fullName.charAt(0) : <User className="w-4 h-4" />}
              </div>
              <span className="hidden md:inline-block text-xs font-bold text-slate-800">
                {profile?.fullName || "Professional"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar (Span 3) */}
          <aside className={`md:col-span-3 space-y-4 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
            {/* Profile Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Profile Status
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    profile?.status === "PUBLISHED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {profile?.status || "ACTIVE"}
                </span>
              </div>

              {/* Completeness bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Completeness</span>
                  <span className="font-black text-[#1E5BFF]">{completeness}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#1E5BFF] h-full rounded-full transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>

              {profile?.verificationStatus === "VERIFIED" ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Credentials Verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50/70 p-2 rounded-xl border border-amber-100">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Verification in progress</span>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#0A1F66] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Pane (Span 9) */}
          <main className="md:col-span-9 min-w-0">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
