"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { marketplaceApi } from "@/lib/marketplace.api";
import { Building2, Lock, Mail, ArrowRight, ArrowLeft, Loader2, Sparkles, MapPin, Eye, EyeOff, AlertTriangle } from "lucide-react";
import Logo from "@/components/common/Logo";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [roleMismatch, setRoleMismatch] = useState<{
    currentRole?: string;
    requiredRole?: string;
    correctPortalUrl?: string;
    signupUrl?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    marketplaceApi
      .me()
      .then((user) => {
        if (user && (user.email || user.name)) {
          setCurrentSession(user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogoutCurrent = async () => {
    try {
      await marketplaceApi.logout();
      setCurrentSession(null);
      router.refresh();
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoleMismatch(null);

    try {
      const res = await marketplaceApi.login({
        email,
        password,
        requiredRole: "vendor",
      });
      router.refresh();
      if (res?.user?.role === "vendor") {
        router.push("/vendor");
      } else {
        router.push("/vendor");
      }
    } catch (err: any) {
      const errData = err.response?.data;
      if (errData?.code === "ROLE_MISMATCH") {
        setRoleMismatch({
          currentRole: errData.currentRole,
          requiredRole: errData.requiredRole,
          correctPortalUrl: errData.correctPortalUrl || "/admin/login",
          signupUrl: errData.signupUrl || "/vendor/signup",
          message: errData.error || "This account does not have vendor partner access.",
        });
      } else {
        setError(errData?.error || err.message || "Invalid partner credentials. Please check your email and password.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 relative overflow-hidden flex flex-col justify-between selection:bg-[#1E5BFF] selection:text-white">
      {/* Background Lighting & Matrix Grid */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1E5BFF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F4A900]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A1F6608_1px,transparent_1px),linear-gradient(to_bottom,#0A1F6608_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-4.5 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 border border-slate-200/90 text-xs font-bold text-[#0A1F66] hover:text-[#1E5BFF] hover:border-blue-200 transition-all shadow-2xs active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#1E5BFF] transition-transform group-hover:-translate-x-1" />
          <span>Back to i-VANTAGE Hub</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          <MapPin className="w-3.5 h-3.5 text-[#F4A900]" />
          <span>Partner Network • NCR</span>
        </div>
      </header>

      {/* Center Form Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(10,31,102,0.08)] border border-slate-200/90 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center pb-1">
              <Logo href="/" width={75} height={60} className="h-12 w-auto" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200/80 text-[#B45309] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#F4A900]" />
              <span>Verified Partner Portal</span>
            </div>

            <h1 className="text-2xl font-black text-[#0A1F66] tracking-tight">
              Coworking Vendor Sign In
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sign in to manage your spaces, cabins, pricing, and prospective client inquiries.
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

          {roleMismatch && (
            <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 text-xs space-y-3 shadow-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-sm text-amber-900">
                    {roleMismatch.currentRole === "superadmin" || roleMismatch.currentRole === "admin"
                      ? "Enterprise Administrator Account Detected"
                      : "Non-Partner Account Detected"}
                  </p>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    {roleMismatch.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-amber-200/80">
                {roleMismatch.correctPortalUrl && (
                  <Link
                    href={roleMismatch.correctPortalUrl}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#0A1F66] text-white text-center text-[11px] font-bold hover:bg-blue-950 transition shadow-2xs"
                  >
                    Go to {roleMismatch.currentRole === "superadmin" || roleMismatch.currentRole === "admin" ? "Admin Portal" : "Client Portal"} &rarr;
                  </Link>
                )}
                <Link
                  href={roleMismatch.signupUrl || "/vendor/signup"}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-center text-[11px] font-bold transition"
                >
                  Register as Coworking Partner &rarr;
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Partner Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="partner@coworking.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link
                  href="/contact"
                  className="text-[11px] text-slate-500 hover:text-[#1E5BFF] transition"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-11 py-3 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-blue-900/15 transition flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Partner Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-center text-xs text-slate-500">
            <p>
              Want to list your coworking space on i-VANTAGE?{" "}
              <Link
                href="/vendor/signup"
                className="font-bold text-[#1E5BFF] hover:underline"
              >
                Register as Partner &rarr;
              </Link>
            </p>
            <p>
              Are you an administrator?{" "}
              <Link
                href="/admin/login"
                className="font-bold text-[#0A1F66] hover:text-[#1E5BFF] transition"
              >
                Enterprise Admin Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full px-4 sm:px-8 py-4 border-t border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} <strong className="text-[#0A1F66]">i-VANTAGE Business Hub Pvt. Ltd.</strong> All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Verified Workspace Partner Network</span>
            <span>•</span>
            <span>Direct Commercial Inventory</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
