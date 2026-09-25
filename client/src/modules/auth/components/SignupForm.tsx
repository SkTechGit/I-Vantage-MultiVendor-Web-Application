"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Building2,
  User,
  Sparkles,
} from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Logo from "@/components/common/Logo";
import { signupSchema, SignupFormData } from "../auth.schema";
import { signup, validateInvitation } from "../auth.api";
import { marketplaceApi } from "@/lib/marketplace.api";

interface InviteData {
  valid: boolean;
  email: string;
  role: string;
  expiresAt: string;
  invitedBy?: string;
}

type AccountType = "vendor" | "user" | "admin";

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite") || "";
  const initialRoleParam = searchParams.get("role");

  const [accountType, setAccountType] = useState<AccountType>(
    inviteToken ? "admin" : initialRoleParam === "user" ? "user" : "vendor"
  );

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Vendor / User custom fields
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");

  // Invite state
  const [checkingInvite, setCheckingInvite] = useState(!!inviteToken);
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Success state for access requests (without invite)
  const [requestSubmitted, setRequestSubmitted] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      inviteToken: inviteToken || undefined,
    },
  });

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");

  // Password requirements calculation
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasLowercase = /[a-z]/.test(passwordValue);
  const hasNumber = /\d/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);

  const passedCount = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  let strengthLabel = "Weak";
  let strengthColor = "bg-red-500";
  let strengthWidth = "w-1/3";

  if (passedCount >= 4) {
    strengthLabel = "Strong";
    strengthColor = "bg-emerald-500";
    strengthWidth = "w-full";
  } else if (passedCount >= 3) {
    strengthLabel = "Fair";
    strengthColor = "bg-amber-500";
    strengthWidth = "w-2/3";
  }

  // Validate invitation token on mount
  useEffect(() => {
    if (!inviteToken) return;

    let isMounted = true;
    setCheckingInvite(true);

    validateInvitation(inviteToken)
      .then((data: InviteData) => {
        if (!isMounted) return;
        setInviteData(data);
        setValue("email", data.email);
        setValue("inviteToken", inviteToken);
        setAccountType("admin");
        setInviteError(null);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg =
          (axios.isAxiosError(err) && err.response?.data?.message) ||
          "This invitation is invalid, expired, or has already been used.";
        setInviteError(msg);
      })
      .finally(() => {
        if (isMounted) setCheckingInvite(false);
      });

    return () => {
      isMounted = false;
    };
  }, [inviteToken, setValue]);

  const onSubmit = (values: SignupFormData) => {
    startTransition(async () => {
      try {
        if (accountType === "vendor") {
          if (!businessName.trim()) {
            toast.error("Please enter your Coworking Space / Business name");
            return;
          }
          await marketplaceApi.register({
            name: values.fullName,
            email: values.email,
            password: values.password,
            phone: phone.trim() || undefined,
            businessName: businessName.trim(),
            role: "vendor",
          });

          toast.success("Welcome! Your Coworking Partner account has been registered.");
          router.push("/vendor");
          return;
        }

        if (accountType === "user") {
          await marketplaceApi.register({
            name: values.fullName,
            email: values.email,
            password: values.password,
            phone: phone.trim() || undefined,
            role: "user",
          });

          toast.success("Account created successfully! Welcome to i-VANTAGE.");
          router.push("/");
          return;
        }

        // Default: Admin registration
        const res = await signup(values);
        toast.success(
          res.message || "Admin account created successfully! Welcome to i-VANTAGE."
        );
        router.refresh();
        router.push("/admin/dashboard");
      } catch (error: unknown) {
        toast.error(
          (axios.isAxiosError(error) && (error.response?.data?.error || error.response?.data?.message)) ||
            "Unable to complete registration. Please check your information."
        );
      }
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                       1. TOKEN VALIDATION LOADING                          */
  /* -------------------------------------------------------------------------- */
  if (checkingInvite) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(10,31,102,0.08)] border border-slate-200/90 text-center space-y-4">
          <div className="flex justify-center mb-1">
            <Logo href="/" width={70} height={56} className="h-11 w-auto" />
          </div>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#1E5BFF]" />
          <h2 className="text-xl font-bold text-[#0A1F66]">
            Verifying Invitation...
          </h2>
          <p className="text-sm text-slate-500">
            Validating your single-use administrative invitation token.
          </p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                       2. INVALID / EXPIRED TOKEN                           */
  /* -------------------------------------------------------------------------- */
  if (inviteToken && inviteError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(10,31,102,0.08)] border border-slate-200/90 text-center space-y-6">
          <div className="flex justify-center">
            <Logo href="/" width={70} height={56} className="h-11 w-auto" />
          </div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A1F66]">
              Invitation Invalid
            </h2>
            <p className="mt-2 text-sm text-slate-600">{inviteError}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 text-left">
            Admin invitation tokens are cryptographically secure, time-limited,
            and single-use. If this invitation has expired, please request a new
            invitation from a system administrator.
          </div>

          <div className="space-y-2">
            <Link
              href="/admin/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1F66] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E5BFF]"
            >
              Back to Admin Login
            </Link>

            <Link
              href="/admin/signup"
              className="inline-block text-xs text-slate-500 hover:text-[#1E5BFF] transition"
            >
              Or request access without invitation →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                      3. ACCESS REQUEST SUBMITTED                           */
  /* -------------------------------------------------------------------------- */
  if (requestSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(10,31,102,0.08)] border border-slate-200/90 text-center space-y-6">
          <div className="flex justify-center">
            <Logo href="/" width={70} height={56} className="h-11 w-auto" />
          </div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#1E5BFF]">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#0A1F66]">
              Access Request Submitted
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Thank you, <strong className="text-slate-800">{requestSubmitted}</strong>.
              Your request for an i-VANTAGE administration account has been registered.
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-600 text-left space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#0A1F66]">
              <ShieldCheck size={16} className="text-[#1E5BFF]" />
              Account Status: Pending Approval
            </div>
            <p className="text-slate-500">
              To protect administrative operations, your account remains
              deactivated until an authorized Super Administrator reviews and
              approves your access. You can log in once approved.
            </p>
          </div>

          <Link
            href="/admin/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            Back to Admin Login
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                           4. MAIN SIGNUP FORM                              */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4 relative overflow-hidden selection:bg-[#1E5BFF] selection:text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A1F6608_1px,transparent_1px),linear-gradient(to_bottom,#0A1F6608_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-9 shadow-[0_20px_60px_rgba(10,31,102,0.08)] border border-slate-200/90"
      >
        {/* Brand & Heading */}
        <div className="mb-5 text-center">
          <div className="flex justify-center mb-2">
            <Logo href="/" width={75} height={60} className="h-12 w-auto" />
          </div>
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-[#B45309] bg-amber-50 border border-amber-200/80 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" /> i-VANTAGE Onboarding
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1F66] tracking-tight">
            {accountType === "vendor"
              ? "Join as Space Partner"
              : accountType === "user"
              ? "Create User Account"
              : "Create Admin Account"}
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            {accountType === "vendor"
              ? "List your coworking spaces, desks, cabins & receive verified tenant leads."
              : accountType === "user"
              ? "Book workspace visits, request quotes & manage desk bookings."
              : "Authorized administrator account for i-VANTAGE platform operations."}
          </p>
        </div>

        {/* Role Selector Tabs (Only if not invited via admin invite token) */}
        {!inviteToken && (
          <div className="mb-5 grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setAccountType("vendor")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition ${
                accountType === "vendor"
                  ? "bg-white text-[#0A1F66] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Building2 className={`w-4 h-4 mb-0.5 ${accountType === "vendor" ? "text-[#1E5BFF]" : ""}`} />
              <span>Partner</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("user")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition ${
                accountType === "user"
                  ? "bg-white text-[#0A1F66] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <User className={`w-4 h-4 mb-0.5 ${accountType === "user" ? "text-[#1E5BFF]" : ""}`} />
              <span>User</span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("admin")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-bold transition ${
                accountType === "admin"
                  ? "bg-white text-[#0A1F66] shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className={`w-4 h-4 mb-0.5 ${accountType === "admin" ? "text-[#1E5BFF]" : ""}`} />
              <span>Admin</span>
            </button>
          </div>
        )}

        {/* Invitation Role Banner (if invited) */}
        {inviteData && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={20} className="text-[#1E5BFF] shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Authorized Role
                </p>
                <p className="text-sm font-bold text-[#0A1F66] capitalize">
                  {inviteData.role === "super_admin"
                    ? "Super Administrator"
                    : inviteData.role === "editor"
                    ? "Content Editor"
                    : "Administrator"}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              Verified Invite
            </span>
          </div>
        )}

        <div className="space-y-4">
          {/* Vendor Specific: Business/Brand Name */}
          {accountType === "vendor" && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Coworking Space / Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Horizon Workspaces"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
              />
            </div>
          )}

          {/* Full Name */}
          <Input
            id="fullName"
            label={accountType === "vendor" ? "Contact Person Name" : "Full Name"}
            placeholder="e.g. John Doe"
            autoComplete="name"
            {...register("fullName")}
            error={errors.fullName?.message}
          />

          {/* Work Email */}
          <Input
            id="email"
            type="email"
            label={accountType === "vendor" ? "Business Email" : "Email Address"}
            placeholder="name@company.com"
            autoComplete="email"
            disabled={!!inviteData}
            {...register("email")}
            error={errors.email?.message}
          />

          {/* Phone (for Vendor & User) */}
          {accountType !== "admin" && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Mobile Number {accountType === "vendor" ? <span className="text-red-500">*</span> : "(Optional)"}
              </label>
              <input
                type="tel"
                required={accountType === "vendor"}
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
              />
            </div>
          )}

          {/* Password with Show/Hide */}
          <div className="min-w-0 w-full">
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a strong password"
                {...register("password")}
                className={`w-full min-w-0 rounded-xl border bg-white border-gray-300 outline-none text-sm text-gray-900 transition-all duration-200 h-11 px-3.5 pr-11 placeholder:text-gray-400 focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-100 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}

            {/* Password Strength Meter */}
            {passwordValue.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Password strength:</span>
                  <span
                    className={`font-bold text-[11px] ${
                      strengthLabel === "Strong"
                        ? "text-emerald-600"
                        : strengthLabel === "Fair"
                        ? "text-amber-600"
                        : "text-red-500"
                    }`}
                  >
                    {strengthLabel}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthWidth} ${strengthColor}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password with Show/Hide */}
          <div className="min-w-0 w-full">
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={`w-full min-w-0 rounded-xl border bg-white border-gray-300 outline-none text-sm text-gray-900 transition-all duration-200 h-11 px-3.5 pr-11 placeholder:text-gray-400 focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-100 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}

            {/* Real-time Match Indicator */}
            {confirmPasswordValue.length > 0 && !errors.confirmPassword && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <Check size={13} /> Passwords match
              </p>
            )}
          </div>

          {/* Notice info */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-500">
            {accountType === "vendor"
              ? "As a partner, you can add multiple coworking locations, create desk packages, and manage prospective tenant inquiries."
              : accountType === "user"
              ? "As a user, you get zero-brokerage workspace access with direct partner-verified rates."
              : "This account grants administrative access to manage blogs, leads, categories, and business desks."}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3"
            disabled={isPending}
            loading={isPending}
          >
            {isPending
              ? "Registering Account..."
              : accountType === "vendor"
              ? "Register as Space Partner"
              : accountType === "user"
              ? "Create User Account"
              : "Create Admin Account"}
          </Button>

          {/* Back to Login Links */}
          <div className="pt-2 text-center text-xs text-slate-600 space-y-1">
            <p>
              Already have an account?{" "}
              {accountType === "vendor" ? (
                <Link href="/vendor/login" className="font-bold text-[#1E5BFF] hover:underline">
                  Partner Sign In
                </Link>
              ) : (
                <Link href="/admin/login" className="font-bold text-[#1E5BFF] hover:underline">
                  Admin Sign In
                </Link>
              )}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

