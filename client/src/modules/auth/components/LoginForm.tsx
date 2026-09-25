"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  Building2,
  CheckCircle2,
  Activity,
  Globe,
  KeyRound,
  MapPin,
  AlertTriangle,
} from "lucide-react";

import Logo from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, LoginFormData } from "../auth.schema";
import { login } from "../auth.api";
import { marketplaceApi } from "@/lib/marketplace.api";

export default function LoginForm() {
  const router = useRouter();
  const { user, setUser, refreshUser, logoutUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [roleMismatch, setRoleMismatch] = useState<{
    currentRole?: string;
    requiredRole?: string;
    correctPortalUrl?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    marketplaceApi
      .me()
      .then((u) => {
        if (u && (u.email || u.name)) {
          setCurrentSession(u);
        }
      })
      .catch(() => {});
  }, [user]);

  const handleLogoutCurrent = async () => {
    try {
      await marketplaceApi.logout();
      if (logoutUser) await logoutUser();
      setCurrentSession(null);
      router.refresh();
      toast.success("Signed out successfully.");
    } catch {
      toast.error("Sign out failed.");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormData) => {
    startTransition(async () => {
      try {
        setRoleMismatch(null);
        let userData: any = null;

        // 1. Authenticate with Next.js Marketplace API with requiredRole: "superadmin"
        try {
          const nextAuthRes = await marketplaceApi.login({
            email: values.email,
            password: values.password,
            requiredRole: "superadmin",
          });
          userData = nextAuthRes?.user;
        } catch (nextErr: any) {
          const errData = nextErr.response?.data;
          if (errData?.code === "ROLE_MISMATCH") {
            setRoleMismatch({
              currentRole: errData.currentRole,
              requiredRole: errData.requiredRole,
              correctPortalUrl: errData.correctPortalUrl || "/vendor/login",
              message: errData.error || "Administrative privileges required.",
            });
            return;
          }
          // If next auth fails for other reasons, attempt Express API
          const expressRes = await login(values);
          userData = expressRes?.data || expressRes?.user || expressRes;
        }

        // 2. Synchronize with Express backend if accessible
        try {
          await login(values);
        } catch {}

        if (userData && (userData.email || userData.fullName || userData.name)) {
          setUser(userData);
        }
        try {
          await refreshUser();
        } catch {}

        toast.success("Security authorization verified. Entering Command Console...");
        router.refresh();
        router.push("/admin/dashboard");
      } catch (error: unknown) {
        const errorMsg =
          (axios.isAxiosError(error) &&
            (error.response?.data?.error || error.response?.data?.message)) ||
          (error as any)?.message ||
          "Invalid administrator credentials or unauthorized access tier.";
        toast.error(errorMsg);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 text-slate-900 relative overflow-hidden flex flex-col justify-between selection:bg-[#1E5BFF] selection:text-white">
      {/* -------------------------------------------------------------------- */}
      {/* 1. ARCHITECTURAL LIGHTING & GEOMETRIC GRID MATRIX                     */}
      {/* -------------------------------------------------------------------- */}
      <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-[#1E5BFF]/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#F4A900]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0A1F66]/4 rounded-full blur-[180px] pointer-events-none" />

      {/* Precision Geometric Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A1F6608_1px,transparent_1px),linear-gradient(to_bottom,#0A1F6608_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* -------------------------------------------------------------------- */}
      {/* 2. TOP NAVIGATION BAR                                                 */}
      {/* -------------------------------------------------------------------- */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-4.5 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-2xs">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200/90 text-xs font-bold text-[#0A1F66] hover:text-[#1E5BFF] hover:border-blue-200 transition-all shadow-2xs active:scale-95"
          title="Return to Public Hub"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#1E5BFF] transition-transform group-hover:-translate-x-1" />
          <span>Back to i-VANTAGE Hub</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-[#0A1F66]">
            <MapPin className="w-3.5 h-3.5 text-[#F4A900]" />
            <span>Welldone Tech Park, Sec 48</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SOC-2 & 256-BIT ENCRYPTED</span>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* 3. DUAL-COLUMN EXECUTIVE COMMAND CONSOLE                             */}
      {/* -------------------------------------------------------------------- */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
          {/* LEFT COLUMN: Executive Briefing & Platform Telemetry (Desktop) */}
          <div className="hidden lg:block lg:col-span-7 space-y-7">
            {/* Logo Badge with Clean Luxury Styling */}
            <div className="relative inline-block">
              <div className="relative bg-white/95 border border-slate-200/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm flex items-center gap-4">
                <Logo href="/" width={85} height={68} className="h-13 w-auto" />
                <div className="h-9 w-[1px] bg-slate-200" />
                <div>
                  <div className="flex items-center gap-1.5 text-[#B45309] text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-3 h-3 text-[#F4A900]" /> Flagship Headquarters
                  </div>
                  <p className="text-xs font-bold text-[#0A1F66] tracking-wide">
                    Administration Infrastructure
                  </p>
                </div>
              </div>
            </div>

            {/* Privilege Level Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/90 text-[#0A1F66] text-xs font-bold tracking-wider uppercase shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#1E5BFF]" />
              <span>SUPERADMIN ACCESS CONSOLE • EXECUTIVE PRIVILEGE</span>
            </div>

            {/* High-Impact Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl xl:text-5xl font-black tracking-tight text-[#0A1F66] leading-[1.15]">
                Centralized Commercial{" "}
                <span className="bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#1E5BFF] bg-clip-text text-transparent">
                  Workspace Governance.
                </span>
              </h1>
              <p className="text-sm xl:text-base text-slate-600 max-w-xl leading-relaxed">
                Centralized platform governance, multi-vendor coworking catalog approvals, high-value corporate lead brokerage, and cryptographic audit telemetry under a unified executive command workstation.
              </p>
            </div>

            {/* 3 Executive Architecture Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1E5BFF]/40 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E5BFF] mb-2.5 group-hover:bg-[#0A1F66] group-hover:text-white transition-all shadow-2xs">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#0A1F66]">Hub Governance</h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Approve workspace centers, private cabins & seat pricing matrices.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1E5BFF]/40 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#0A1F66] mb-2.5 group-hover:bg-[#1E5BFF] group-hover:text-white transition-all shadow-2xs">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#0A1F66]">Leads Telemetry</h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Centralized tenant CRM with zero-leak brokerage & follow-up tracking.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1E5BFF]/40 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] mb-2.5 group-hover:bg-[#0A1F66] group-hover:text-white transition-all shadow-2xs">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#0A1F66]">VIKI AI Core</h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Unified AI concierge telemetry, insights & real-time query mapping.
                </p>
              </div>
            </div>

            {/* Compliance & Security Credentials */}
            <div className="pt-3 flex items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <strong className="text-slate-800">ISO 27001</strong> Aligned
              </span>
              <span className="h-3.5 w-[1px] bg-slate-300" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <strong className="text-slate-800">SOC-2 Type II</strong> Controls
              </span>
              <span className="h-3.5 w-[1px] bg-slate-300" />
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <strong className="text-slate-800">256-Bit TLS</strong> Encrypted
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: The Executive Sign-In Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative w-full max-w-md mx-auto">
              {/* Executive White Card */}
              <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_rgba(10,31,102,0.08)] space-y-6">
                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0A1F66] to-[#1E5BFF] flex items-center justify-center text-white shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0A1F66] tracking-wide">Privileged Access</p>
                      <p className="text-[10px] text-slate-500 font-semibold tracking-wider">
                        ENTERPRISE ADMINISTRATIVE CONSOLE
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>GATEWAY SECURE</span>
                  </div>
                </div>

                {/* Title & Mobile Brand */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between lg:hidden mb-2">
                    <Logo href="/" width={70} height={56} className="h-10 w-auto" />
                    <span className="text-[10px] font-bold text-[#B45309] tracking-wider uppercase">
                      Admin Portal
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-[#0A1F66] tracking-tight">
                    Administrator Sign In
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Authenticate your privileged credentials to access the central administration hub.
                  </p>
                </div>

                {/* Active Session Switch Notice */}
                {currentSession && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0A1F66] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active Session Detected
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-200 text-blue-900">
                        {currentSession.role}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      Signed in as <strong>{currentSession.name || currentSession.fullName || currentSession.email}</strong> ({currentSession.email}). Enter credentials below to switch accounts, or:
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={currentSession.role === "superadmin" ? "/admin/dashboard" : "/vendor"}
                        className="px-3 py-1.5 rounded-lg bg-[#1E5BFF] text-white text-[11px] font-bold hover:bg-blue-700 transition"
                      >
                        Go to {currentSession.role === "superadmin" ? "Admin Console" : "Vendor Center"} &rarr;
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogoutCurrent}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] font-semibold text-slate-600 hover:bg-white transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}

                {/* Role Mismatch Alert */}
                {roleMismatch && (
                  <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 text-xs space-y-3 shadow-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm text-amber-900">
                          {roleMismatch.currentRole === "vendor"
                            ? "Coworking Partner Account Detected"
                            : "Access Restricted: Administrator Privileges Required"}
                        </p>
                        <p className="text-amber-800 leading-relaxed text-[11px]">
                          {roleMismatch.message}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-amber-200/80">
                      <Link
                        href={roleMismatch.correctPortalUrl || "/vendor/login"}
                        className="block w-full py-2 px-3 rounded-xl bg-[#0A1F66] text-white text-center text-[11px] font-bold hover:bg-blue-950 transition shadow-2xs"
                      >
                        Go to {roleMismatch.currentRole === "vendor" ? "Coworking Partner Portal" : "Client Portal"} &rarr;
                      </Link>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" suppressHydrationWarning>
                  {/* Operator Email */}
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                      Work Email / Operator ID
                    </label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E5BFF] transition-colors" />
                      <input
                        type="email"
                        autoComplete="email"
                        suppressHydrationWarning
                        placeholder="admin@i-vantage.in"
                        {...register("email")}
                        className={`w-full text-sm pl-10 pr-4 py-3 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                          errors.email
                            ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-200 hover:border-slate-300 focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                        <span>•</span> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Authentication Key (Password) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                        Password / Access Key
                      </label>
                      <span className="text-[10px] text-slate-400 font-semibold">ENCRYPTED</span>
                    </div>

                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E5BFF] transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        suppressHydrationWarning
                        placeholder="••••••••••••"
                        {...register("password")}
                        className={`w-full text-sm pl-10 pr-11 py-3 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                          errors.password
                            ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-200 hover:border-slate-300 focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                        <span>•</span> {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Session Preferences */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900 transition">
                      <input
                        type="checkbox"
                        checked={rememberSession}
                        onChange={(e) => setRememberSession(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#1E5BFF] focus:ring-[#1E5BFF]"
                      />
                      <span>Trust this workstation</span>
                    </label>

                    <Link
                      href="/admin/signup"
                      className="text-slate-500 hover:text-[#1E5BFF] transition-colors text-[11px] font-semibold"
                    >
                      Request Support
                    </Link>
                  </div>

                  {/* Primary Submit CTA */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 shadow-md shadow-blue-900/15 transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying Administrative Credentials...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-blue-200" />
                        <span>Authenticate & Enter Console</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Alternate Access Portals Switcher */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="shrink-0 mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Alternate Access Tier
                    </span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>

                  {/* Quick Link to Vendor Portal */}
                  <Link
                    href="/vendor/login"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:bg-blue-50/70 hover:border-blue-200 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#1E5BFF]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-[#0A1F66] group-hover:text-[#1E5BFF]">
                          Coworking Space Partner?
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Sign in to Partner Portal & leads CRM
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#1E5BFF] group-hover:translate-x-0.5 transition-transform">
                      &rarr;
                    </span>
                  </Link>

                  {/* Invitation / Request Access */}
                  <div className="text-center pt-1">
                    <p className="text-[11px] text-slate-500">
                      Need administrative credentials or have an invite?{" "}
                      <Link
                        href="/admin/signup"
                        className="text-[#1E5BFF] font-bold hover:underline transition"
                      >
                        Sign Up / Request Access
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* 4. ENTERPRISE FOOTER & COMPLIANCE WATERMARK                          */}
      {/* -------------------------------------------------------------------- */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-4 border-t border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p suppressHydrationWarning>
            &copy; {new Date().getFullYear()} <strong className="text-[#0A1F66]">i-VANTAGE Business Hub Pvt. Ltd.</strong> Welldone Tech Park, Sector 48, Gurugram.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>SOC-2 Type II Aligned</span>
            <span>•</span>
            <span>256-Bit End-to-End SSL</span>
            <span>•</span>
            <span className="font-semibold text-slate-600">Enterprise Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}