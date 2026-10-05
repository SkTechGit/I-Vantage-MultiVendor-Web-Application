"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  isValidIndianPhone,
  isValidEmail,
  normalizeIndianPhone,
  checkPasswordCriteria,
  STRONG_PASSWORD_MESSAGE,
} from "@/modules/auth/auth.schema";

export default function VendorSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get("email");
      if (emailParam) setEmail(emailParam);
    }
  }, []);

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Full name is required.";
    } else if (name.trim().length < 2) {
      errors.name = "Full name must be at least 2 characters.";
    }

    if (!businessName.trim()) {
      errors.businessName = "Coworking brand or company name is required.";
    } else if (businessName.trim().length < 2) {
      errors.businessName = "Brand name must be at least 2 characters.";
    }

    if (!email.trim()) {
      errors.email = "Official email address is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid official email address (e.g. partner@brand.com).";
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required for account verification.";
    } else if (!isValidIndianPhone(phone)) {
      errors.phone = "Please enter a valid 10-digit mobile number (e.g. 9876543210).";
    }

    const passCheck = checkPasswordCriteria(password);
    if (!password) {
      errors.password = "Password is required.";
    } else if (!passCheck.isStrong) {
      errors.password = STRONG_PASSWORD_MESSAGE;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateAll()) {
      setError("Please resolve the highlighted validation errors before continuing.");
      return;
    }

    setLoading(true);

    try {
      await marketplaceApi.register({
        name: name.trim(),
        businessName: businessName.trim(),
        email: email.trim().toLowerCase(),
        phone: normalizeIndianPhone(phone),
        password,
        role: "vendor",
      });
      router.push("/vendor");
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      const errorMsg =
        serverMsg && !serverMsg.toLowerCase().includes("status code")
          ? serverMsg
          : "Registration failed. Please check your information and try again.";
      setError(errorMsg);
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
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.name;
                        return next;
                      });
                    }
                  }}
                  className={`w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition ${
                    fieldErrors.name
                      ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100"
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Coworking Brand Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Coworking Brand / Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  autoComplete="organization"
                  placeholder="e.g. Horizon Workspaces Pvt Ltd"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (fieldErrors.businessName) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.businessName;
                        return next;
                      });
                    }
                  }}
                  className={`w-full text-sm pl-10 pr-4 py-2.5 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition ${
                    fieldErrors.businessName
                      ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100"
                  }`}
                />
              </div>
              {fieldErrors.businessName && (
                <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.businessName}
                </p>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Official Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="partner@brand.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.email;
                          return next;
                        });
                      }
                    }}
                    className={`w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition ${
                      fieldErrors.email
                        ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100"
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                    <span>•</span> {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.phone;
                          return next;
                        });
                      }
                    }}
                    className={`w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition ${
                      fieldErrors.phone
                        ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100"
                    }`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                    <span>•</span> {fieldErrors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Create Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Create Strong Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="At least 8 chars with uppercase, number & symbol"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.password;
                        return next;
                      });
                    }
                  }}
                  className={`w-full text-sm pl-10 pr-11 py-2.5 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition ${
                    fieldErrors.password
                      ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100"
                  }`}
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

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <PasswordStrengthMeter password={password} className="mt-2.5" />
              )}

              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Re-type your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.confirmPassword;
                        return next;
                      });
                    }
                  }}
                  className={`w-full text-sm pl-10 pr-11 py-2.5 bg-slate-50/80 border rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition ${
                    fieldErrors.confirmPassword
                      ? "border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 focus:border-[#1E5BFF] focus:bg-white focus:ring-3 focus:ring-blue-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.confirmPassword}
                </p>
              )}
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
