"use client";

import { useState, useTransition, useEffect, KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Server,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

import Logo from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, LoginFormData } from "../auth.schema";
import { marketplaceApi } from "@/lib/marketplace.api";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason");
  const { user, setUser, refreshUser, logoutUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [accountLockedMessage, setAccountLockedMessage] = useState<string | null>(null);
  const [roleMismatch, setRoleMismatch] = useState<{
    currentRole?: string;
    requiredRole?: string;
    correctPortalUrl?: string;
    message?: string;
  } | null>(null);

  // Check if an existing admin session is already active
  useEffect(() => {
    marketplaceApi
      .me("admin")
      .then((u) => {
        if (u && (u.email || u.name)) {
          setCurrentSession(u);
        } else {
          setCurrentSession(null);
        }
      })
      .catch(() => {
        setCurrentSession(null);
      });
  }, [user]);

  const handleLogoutCurrent = async () => {
    try {
      await marketplaceApi.logout("admin");
      if (logoutUser) await logoutUser();
      setCurrentSession(null);
      router.refresh();
      toast.success("Signed out successfully.");
    } catch {
      toast.error("Sign out failed.");
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
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
        setAccountLockedMessage(null);

        const res = await marketplaceApi.login({
          email: values.email.trim().toLowerCase(),
          password: values.password,
          requiredRole: "superadmin",
        });

        const userData = res?.user || res?.data || res;
        const role = (userData?.role || "").toLowerCase();

        if (userData && (userData.email || userData.fullName || userData.name)) {
          setUser(userData);
        }

        try {
          await refreshUser();
        } catch {}

        if (role === "superadmin" || role === "super_admin") {
          toast.success("Identity verified. Welcome to the i-VANTAGE Command Console.");
          router.refresh();
          router.push("/admin/dashboard");
        } else {
          toast.success("Identity verified. Redirecting...");
          router.refresh();
          router.push("/admin/dashboard");
        }
      } catch (error: unknown) {
        let errorMsg = "Invalid email or password. Please verify your credentials.";

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const errData = error.response?.data;
          const msg = errData?.message || errData?.error;

          // 1. Account Locked out / Rate Limited
          if (errData?.code === "ACCOUNT_LOCKED" || status === 429) {
            setAccountLockedMessage(
              msg || "Too many failed attempts detected. Access is temporarily restricted for 15 minutes."
            );
            toast.error(msg || "Account temporarily locked.");
            return;
          }

          // 2. Role Mismatch (Vendor or standard user logging into Admin Console)
          if (errData?.code === "ROLE_MISMATCH" || (status === 403 && errData?.currentRole)) {
            setRoleMismatch({
              currentRole: errData.currentRole,
              requiredRole: errData.requiredRole,
              correctPortalUrl: errData.correctPortalUrl || "/vendor/login",
              message:
                errData.error ||
                errData.message ||
                "This account is configured for Coworking Partners. Please use the Partner Portal.",
            });
            return;
          } else if (status === 401 && msg) {
            errorMsg = msg;
          } else if (status === 404 && msg) {
            errorMsg = msg;
          } else if (msg && !msg.toLowerCase().includes("status code")) {
            errorMsg = msg;
          } else if (!status || status >= 500) {
            errorMsg = "Unable to connect to the authentication server. Please check your network connection.";
          }
        }
        toast.error(errorMsg);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 text-slate-900 relative overflow-hidden flex flex-col justify-between selection:bg-[#1E5BFF] selection:text-white">
      {/* -------------------------------------------------------------------- */}
      {/* AMBIENT LIGHTING & ARCHITECTURAL GRID                               */}
      {/* -------------------------------------------------------------------- */}
      <div className="absolute top-[-12%] left-[-8%] w-[600px] h-[600px] bg-[#1E5BFF]/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[650px] h-[650px] bg-[#F4A900]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-[#0A1F66]/4 rounded-full blur-[180px] pointer-events-none" />

      {/* Subtle Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A1F6608_1px,transparent_1px),linear-gradient(to_bottom,#0A1F6608_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_65%,transparent_100%)] pointer-events-none" />

      {/* -------------------------------------------------------------------- */}
      {/* 1. TOP EXECUTIVE NAVBAR                                               */}
      {/* -------------------------------------------------------------------- */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 hover:bg-blue-50 border border-slate-200 text-xs font-semibold text-[#0A1F66] hover:text-[#1E5BFF] hover:border-blue-200 transition-all shadow-2xs active:scale-95"
            title="Return to i-VANTAGE Public Marketplace"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#1E5BFF] transition-transform group-hover:-translate-x-0.5" />
            <span>Main Marketplace</span>
          </Link>

          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/60 border border-slate-200 text-[11px] font-medium text-slate-600">
            <MapPin className="w-3 h-3 text-[#F4A900]" />
            <span>Welldone Tech Park, Sec 48, Gurugram</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/vendor/login"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-[11px] font-semibold text-amber-900 transition-colors shadow-2xs"
            title="Go to Coworking Partner Portal"
          >
            <Building2 className="w-3 h-3 text-amber-600" />
            <span className="hidden sm:inline">Partner Sign In</span>
            <span className="sm:hidden">Partner</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>256-Bit SSL Protected</span>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* 2. DUAL-COLUMN LAYOUT                                                */}
      {/* -------------------------------------------------------------------- */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
          {/* LEFT COLUMN: Clean Executive Presentation (Desktop) */}
          <div className="hidden lg:block lg:col-span-7 space-y-7">
            {/* Brand Card */}
            <div className="inline-flex items-center gap-4 bg-white/95 border border-slate-200/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xs">
              <Logo href="/" width={85} height={68} className="h-12 w-auto" />
              <div className="h-8 w-[1px] bg-slate-200" />
              <div>
                <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#F4A900]" /> i-VANTAGE Enterprise
                </div>
                <p className="text-xs font-bold text-[#0A1F66] tracking-wide">
                  Central Operations & Administration Hub
                </p>
              </div>
            </div>

            {/* Portal Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200 text-[#0A1F66] text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-[#1E5BFF]" />
              <span>ADMINISTRATIVE COMMAND CONSOLE • SUPERVISORY ACCESS</span>
            </div>

            {/* Clear, High-Impact Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl xl:text-5xl font-black tracking-tight text-[#0A1F66] leading-[1.15]">
                Unified Commercial{" "}
                <span className="bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#1E5BFF] bg-clip-text text-transparent">
                  Workspace Management.
                </span>
              </h1>
              <p className="text-sm xl:text-base text-slate-600 max-w-xl leading-relaxed">
                Centralized platform controls to oversee verified coworking spaces, review corporate lead transactions, manage space partner approvals, and track real-time platform metrics.
              </p>
            </div>

            {/* 3 Value Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1E5BFF]/30 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E5BFF] mb-2.5 group-hover:bg-[#0A1F66] group-hover:text-white transition-all shadow-2xs">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#0A1F66]">Hub Governance</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Approve workspace centers, private cabins, and dynamic pricing matrices.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1E5BFF]/30 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#0A1F66] mb-2.5 group-hover:bg-[#1E5BFF] group-hover:text-white transition-all shadow-2xs">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#0A1F66]">Lead Pipeline</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Manage high-value enterprise leads with zero leakage and real-time CRM updates.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#1E5BFF]/30 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] mb-2.5 group-hover:bg-[#0A1F66] group-hover:text-white transition-all shadow-2xs">
                  <Server className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-[#0A1F66]">Security & Audit</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Role-isolated access controls, audit logs, and brute-force protection.
                </p>
              </div>
            </div>

            {/* Compliance & Trust Markers */}
            <div className="pt-2 flex items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ISO 27001 Controls</span>
              </span>
              <span className="h-3 w-[1px] bg-slate-300" />
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SOC-2 Aligned</span>
              </span>
              <span className="h-3 w-[1px] bg-slate-300" />
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Rate-Limit Shield Active</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: The Modernized Admin Sign-In Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative w-full max-w-md mx-auto">
              {/* Premium Card Surface */}
              <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-9 shadow-[0_20px_60px_rgba(10,31,102,0.07)] space-y-6">
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0A1F66] to-[#1E5BFF] flex items-center justify-center text-white shadow-2xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0A1F66] tracking-tight">Admin Console</p>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        SuperAdmin Authentication
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>SECURE ACCESS</span>
                  </div>
                </div>

                {/* Mobile Brand Identifier */}
                <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-100">
                  <Logo href="/" width={70} height={56} className="h-10 w-auto" />
                  <span className="text-[11px] font-bold text-[#1E5BFF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    Administrator Access
                  </span>
                </div>

                {/* Form Title & Context */}
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-black text-[#0A1F66] tracking-tight">
                    Sign In
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Enter your administrative credentials to manage commercial spaces, leads, and platform operations.
                  </p>
                </div>

                {/* Active Session Notice */}
                {currentSession && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs text-slate-700 space-y-2">
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
                      Currently signed in as <strong>{currentSession.name || currentSession.fullName || currentSession.email}</strong>.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={
                          currentSession.role === "superadmin" || currentSession.role === "super_admin"
                            ? "/admin/dashboard"
                            : "/vendor"
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#1E5BFF] text-white text-[11px] font-bold hover:bg-blue-700 transition"
                      >
                        Open Dashboard &rarr;
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

                {/* Account Locked Out Alert */}
                {accountLockedMessage && (
                  <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 text-xs space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm text-rose-900">Account Temporarily Locked</p>
                        <p className="text-rose-800 text-[11px] leading-relaxed">
                          {accountLockedMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Role Mismatch Alert */}
                {roleMismatch && (
                  <div className="p-4 rounded-2xl bg-amber-50/95 border-2 border-amber-300 text-amber-950 text-xs space-y-3 shadow-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-extrabold text-sm text-amber-900">
                          {roleMismatch.currentRole === "vendor"
                            ? "Coworking Space Partner Account"
                            : "Administrator Privileges Required"}
                        </p>
                        <p className="text-amber-800 leading-relaxed text-[11px]">
                          {roleMismatch.message}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-amber-200">
                      <Link
                        href={roleMismatch.correctPortalUrl || "/vendor/login"}
                        className="block w-full py-2 px-3 rounded-xl bg-[#0A1F66] text-white text-center text-[11px] font-bold hover:bg-blue-950 transition shadow-2xs"
                      >
                        Open Coworking Partner Portal &rarr;
                      </Link>
                    </div>
                  </div>
                )}

                {/* Session Demoted Notice */}
                {reason === "demoted" && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 text-xs space-y-1.5 animate-in fade-in duration-150">
                    <p className="font-extrabold flex items-center gap-1.5 text-rose-900 text-sm">
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      SuperAdmin Privileges Modified
                    </p>
                    <p className="text-[11px] text-rose-800 leading-relaxed">
                      Your permissions were updated. If your role changed to Partner, please log in via the Coworking Partner Portal.
                    </p>
                    <div className="pt-1">
                      <Link
                        href="/vendor/login"
                        className="inline-block px-3 py-1.5 rounded-lg bg-rose-700 text-white text-[11px] font-bold hover:bg-rose-800 transition"
                      >
                        Partner Portal &rarr;
                      </Link>
                    </div>
                  </div>
                )}

                {/* Session Invalidation Notice */}
                {reason === "session_invalidated" && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs space-y-1 animate-in fade-in duration-150">
                    <p className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      Session Expired for Security
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Your security credentials changed or timed out. Please sign in again to continue.
                    </p>
                  </div>
                )}

                {/* Sign-In Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" suppressHydrationWarning>
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Administrator Email
                    </label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E5BFF] transition-colors" />
                      <input
                        type="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        suppressHydrationWarning
                        placeholder="admin@i-vantage.in"
                        {...register("email")}
                        className={`w-full text-sm pl-10 pr-4 py-3 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                          errors.email
                            ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-200 hover:border-slate-300 focus:border-[#1E5BFF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                        <span>•</span> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                      <Link
                        href="/admin/signup"
                        className="text-[11px] text-[#1E5BFF] hover:underline font-semibold"
                      >
                        Need Help?
                      </Link>
                    </div>

                    <div className="relative group">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E5BFF] transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        suppressHydrationWarning
                        placeholder="Enter your password"
                        onKeyUp={handleKeyUp}
                        {...register("password")}
                        className={`w-full text-sm pl-10 pr-11 py-3 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                          errors.password
                            ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-200 hover:border-slate-300 focus:border-[#1E5BFF] focus:bg-white focus:ring-4 focus:ring-blue-100"
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

                    {/* Caps Lock Indicator */}
                    {capsLockActive && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-1 rounded-md">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Caps Lock is ON</span>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                        <span>•</span> {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Device Preferences */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900 transition font-medium">
                      <input
                        type="checkbox"
                        checked={rememberSession}
                        onChange={(e) => setRememberSession(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-[#1E5BFF] focus:ring-[#1E5BFF]"
                      />
                      <span>Keep me signed in on this device</span>
                    </label>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] hover:brightness-110 text-white font-bold text-sm py-3.5 px-5 shadow-md shadow-blue-900/15 transition-all active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying Access...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-blue-200" />
                        <span>Sign In to Admin Console</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Alternate Portals Navigation (Crystal clear UX) */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-center">
                  <p className="text-xs text-slate-600">
                    Are you a Coworking Space Partner?{" "}
                    <Link
                      href="/vendor/login"
                      className="font-bold text-[#1E5BFF] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Sign In to Partner Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </p>

                  <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
                    <Link
                      href="/admin/signup"
                      className="hover:text-[#1E5BFF] transition"
                    >
                      Redeem Invitation Token
                    </Link>
                    <span>•</span>
                    <Link
                      href="/"
                      className="hover:text-[#1E5BFF] transition"
                    >
                      Browse Coworking Spaces
                    </Link>
                  </div>
                </div>

                {/* Micro Security Trust Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hardware-level 256-bit TLS • Anti-Brute-Force Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* 3. FOOTER                                                            */}
      {/* -------------------------------------------------------------------- */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-3.5 border-t border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p suppressHydrationWarning>
            &copy; {new Date().getFullYear()} <strong className="text-[#0A1F66]">i-VANTAGE Business Hub Pvt. Ltd.</strong> Welldone Tech Park, Sector 48, Gurugram.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>SOC-2 Type II Controls</span>
            <span>•</span>
            <span>ISO 27001 Certified Infrastructure</span>
            <span>•</span>
            <span className="font-semibold text-slate-600">Enterprise Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}