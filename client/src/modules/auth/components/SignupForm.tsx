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
} from "lucide-react";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signupSchema, SignupFormData } from "../auth.schema";
import { signup, validateInvitation } from "../auth.api";

interface InviteData {
  valid: boolean;
  email: string;
  role: string;
  expiresAt: string;
  invitedBy?: string;
}

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite") || "";

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        const res = await signup(values);

        toast.success(
          res.message || "Admin account created successfully! Welcome to i-VANTAGE."
        );
        router.refresh();
        router.push("/admin/dashboard");
      } catch (error: unknown) {
        toast.error(
          (axios.isAxiosError(error) && error.response?.data?.message) ||
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow text-center space-y-4">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#1E5BFF]" />
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
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow text-center space-y-6">
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
  /*                     3. REQUEST SUBMITTED SUCCESS STATE                     */
  /* -------------------------------------------------------------------------- */
  if (requestSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow text-center space-y-6">
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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow"
      >
        {/* Brand & Heading */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-bold tracking-widest uppercase text-[#C8942C]">
              i-VANTAGE Enterprise
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1F66]">
            {inviteData ? "Admin Account Setup" : "Create Admin Account"}
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {inviteData
              ? "Complete your authorized administrator profile."
              : "Create your administrative account to manage the i-VANTAGE portal."}
          </p>
        </div>

        {/* Invitation Role Banner (if invited) */}
        {inviteData && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 px-4 py-3">
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

        <div className="space-y-4 sm:space-y-5">
          {/* Full Name */}
          <Input
            id="fullName"
            label="Full Name"
            placeholder="e.g. John Doe"
            autoComplete="name"
            {...register("fullName")}
            error={errors.fullName?.message}
          />

          {/* Work Email */}
          <Input
            id="email"
            type="email"
            label="Work Email"
            placeholder="name@company.com"
            autoComplete="email"
            disabled={!!inviteData}
            {...register("email")}
            error={errors.email?.message}
          />

          {/* Password with Show/Hide */}
          <div className="min-w-0 w-full">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-[#0A1F66]"
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
                className={`w-full min-w-0 rounded-xl border bg-white border-gray-300 outline-none text-sm text-gray-900 transition-all duration-200 h-11 px-3.5 pr-11 sm:h-12 sm:px-4 sm:pr-11 placeholder:text-gray-400 focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100 ${
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
              <p className="mt-1.5 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}

            {/* Password Strength Meter */}
            {passwordValue.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Password strength:</span>
                  <span
                    className={`font-semibold ${
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
              className="mb-1.5 block text-sm font-medium text-[#0A1F66]"
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
                className={`w-full min-w-0 rounded-xl border bg-white border-gray-300 outline-none text-sm text-gray-900 transition-all duration-200 h-11 px-3.5 pr-11 sm:h-12 sm:px-4 sm:pr-11 placeholder:text-gray-400 focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100 ${
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
              <p className="mt-1.5 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}

            {/* Real-time Match Indicator */}
            {confirmPasswordValue.length > 0 && !errors.confirmPassword && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
                <Check size={14} /> Passwords match
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-500">
            {inviteData
              ? "By creating this account, you confirm authorized access to manage i-VANTAGE administrative services."
              : "This account grants full administrative access to manage blogs, leads, categories, and business desks."}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            loading={isPending}
          >
            {isPending
              ? "Creating Account..."
              : "Create Admin Account"}
          </Button>

          {/* Back to Login Link */}
          <div className="pt-2 text-center text-sm text-slate-600">
            Already have an admin account?{" "}
            <Link
              href="/admin/login"
              className="font-semibold text-[#1E5BFF] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
