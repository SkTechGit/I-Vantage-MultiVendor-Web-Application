"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { marketplaceApi } from "@/lib/marketplace.api";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  AlertTriangle,
  Award,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { isValidEmail } from "@/lib/validation";

export default function ProfessionalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notRegisteredEmail, setNotRegisteredEmail] = useState<string | null>(null);
  const [roleMismatch, setRoleMismatch] = useState<{
    currentRole?: string;
    requiredRole?: string;
    correctPortalUrl?: string;
    signupUrl?: string;
    message?: string;
  } | null>(null);

  const validateForm = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setEmailError("Email address is required.");
      isValid = false;
    } else if (!isValidEmail(cleanEmail)) {
      setEmailError("Please enter a valid email address (e.g. rahul@gmail.com).");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setNotRegisteredEmail(null);
    setRoleMismatch(null);

    try {
      const res = await marketplaceApi.login({
        email: email.trim().toLowerCase(),
        password,
        requiredRole: "professional",
      });
      const proUser = res?.user || res?.data || res;
      if (typeof window !== "undefined" && proUser) {
        try {
          localStorage.setItem("iv_pro_user", JSON.stringify(proUser));
        } catch {}
      }
      router.push("/dashboard/professional");
    } catch (err: any) {
      const errData = err.response?.data;
      if (errData?.code === "ROLE_MISMATCH") {
        setRoleMismatch({
          currentRole: errData.currentRole,
          requiredRole: errData.requiredRole,
          correctPortalUrl: errData.correctPortalUrl || "/admin/login",
          signupUrl: errData.signupUrl || "/contact?intent=join_professionals_network",
          message:
            errData.error ||
            errData.message ||
            "This account does not have verified professional partner access.",
        });
      } else if (
        errData?.code === "EMAIL_NOT_REGISTERED" ||
        err.response?.status === 404 ||
        errData?.message?.toLowerCase().includes("not registered")
      ) {
        setNotRegisteredEmail(email);
      } else {
        const statusCode = err.response?.status;
        const serverMsg = errData?.message || errData?.error;

        if (
          statusCode === 401 &&
          (errData?.code === "INVALID_PASSWORD" ||
            serverMsg?.toLowerCase().includes("password"))
        ) {
          setError("Invalid password. Please check your credentials.");
        } else if (serverMsg && !serverMsg.toLowerCase().includes("status code")) {
          setError(serverMsg);
        } else if (!statusCode || statusCode >= 500) {
          setError("Unable to connect to authentication server. Please ensure backend is running.");
        } else {
          setError("Invalid email or password.");
        }
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 relative overflow-hidden flex flex-col justify-between selection:bg-[#1E5BFF] selection:text-white">
      {/* Background Lighting & Matrix Grid */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1E5BFF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C8942C]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A1F6608_1px,transparent_1px),linear-gradient(to_bottom,#0A1F6608_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between">
        <Logo
          href="/"
          width={150}
          height={48}
          className="h-10 sm:h-12 w-auto transition-transform hover:scale-[1.02]"
        />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0A1F66] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Site</span>
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(10,31,102,0.08)] p-6 sm:p-10 space-y-6">
          {/* Brand & Persona Badge */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#1E5BFF] shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#C8942C]" />
              <span>Verified Professionals Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1F66] tracking-tight">
              Sign In to Your Practice
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Manage client consultation leads, advisory practice profile, services and fees.
            </p>
          </div>

          {/* Role Mismatch Alert */}
          {roleMismatch && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Account Role Notice</span>
              </div>
              <p>{roleMismatch.message}</p>
              {roleMismatch.correctPortalUrl && (
                <Link
                  href={roleMismatch.correctPortalUrl}
                  className="inline-flex items-center gap-1 font-bold text-[#1E5BFF] hover:underline pt-1"
                >
                  <span>Go to your designated portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}

          {/* Not Registered Alert */}
          {notRegisteredEmail && (
            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-[#1E5BFF] shrink-0" />
                <span>New Professional?</span>
              </div>
              <p>
                We could not find a verified practitioner account for <strong>{notRegisteredEmail}</strong>.
              </p>
              <Link
                href={`/professional/signup?email=${encodeURIComponent(notRegisteredEmail)}`}
                className="inline-flex items-center gap-1 font-bold text-[#1E5BFF] hover:underline pt-1"
              >
                <span>Register as Professional Partner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Generic Error */}
          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address (Gmail / Professional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@gmail.com or ca.rahul@firm.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs text-slate-800 placeholder-slate-400 outline-none transition ${
                    emailError
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-slate-200 focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10"
                  }`}
                />
              </div>
              {emailError && <p className="text-[11px] text-rose-600 font-medium pl-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs text-slate-800 placeholder-slate-400 outline-none transition ${
                    passwordError
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-slate-200 focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[11px] text-rose-600 font-medium pl-1">{passwordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0A1F66] text-white text-xs font-black shadow-md hover:bg-[#1E5BFF] active:scale-95 disabled:opacity-60 transition-all duration-200 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Join Network link */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-1">
            <p className="text-xs text-slate-500">
              Not registered as a professional partner yet?
            </p>
            <Link
              href="/professional/signup"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] hover:underline"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Create Professional Partner Account &rarr;</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} i-VANTAGE Business Hub Private Limited. All rights reserved.
      </footer>
    </div>
  );
}
