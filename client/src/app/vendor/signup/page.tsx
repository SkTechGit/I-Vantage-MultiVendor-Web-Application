"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { marketplaceApi } from "@/lib/marketplace.api";
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Logo from "@/components/common/Logo";

export default function VendorSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await marketplaceApi.register({
        name,
        businessName,
        email,
        phone,
        password,
        role: "vendor",
      });
      router.push("/vendor");
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Registration failed. Please check your information and try again.");
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
          <span>Partner Network • Gurugram & NCR</span>
        </div>
      </header>

      {/* Center Form Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="max-w-lg w-full bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-[0_20px_60px_rgba(10,31,102,0.08)] border border-slate-200/90 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center pb-1">
              <Logo href="/" width={75} height={60} className="h-12 w-auto" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200/80 text-[#B45309] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#F4A900]" />
              <span>Join As Certified Space Partner</span>
            </div>

            <h1 className="text-2xl font-black text-[#0A1F66] tracking-tight">
              Partner Registration
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Showcase your commercial cabins, boardrooms, and open desks to verified enterprise tenants across Gurugram.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Coworking Brand / Company Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Horizon Workspaces Pvt Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Official Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="partner@brand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Create Password (min 8 chars) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-11 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100 transition"
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

            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-slate-600 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
              <span>
                By registering, you gain access to the i-VANTAGE inventory portal with verified corporate lead matching and direct client contact.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md shadow-blue-900/15 transition flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Partner Account...</span>
                </>
              ) : (
                <>
                  <span>Register Partner Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-center text-xs text-slate-500">
            <p>
              Already registered as partner?{" "}
              <Link
                href="/vendor/login"
                className="font-bold text-[#1E5BFF] hover:underline"
              >
                Sign In Here &rarr;
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
            <span>Welldone Tech Park, Sector 48, Gurugram</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
