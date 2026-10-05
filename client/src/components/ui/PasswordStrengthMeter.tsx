"use client";

import React from "react";
import { Check, X, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { checkPasswordCriteria } from "@/modules/auth/auth.schema";

interface PasswordStrengthMeterProps {
  password?: string;
  className?: string;
}

export default function PasswordStrengthMeter({
  password = "",
  className = "",
}: PasswordStrengthMeterProps) {
  if (!password) return null;

  const criteria = checkPasswordCriteria(password);
  const {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    hasNoSpaces,
    passedCount,
    strengthLabel,
    isStrong,
  } = criteria;

  // 4 visual segments
  const activeSegments = Math.min(4, Math.max(1, Math.ceil((passedCount / 5) * 4)));

  const getSegmentColor = (index: number) => {
    if (index >= activeSegments) return "bg-slate-200";
    if (isStrong) return "bg-emerald-500";
    if (passedCount >= 4) return "bg-blue-500";
    if (passedCount >= 3) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getBadgeStyle = () => {
    if (isStrong) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (passedCount >= 4) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (passedCount >= 3) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const requirements = [
    { label: "8+ characters", met: hasMinLength },
    { label: "One uppercase letter (A-Z)", met: hasUppercase },
    { label: "One lowercase letter (a-z)", met: hasLowercase },
    { label: "One number (0-9)", met: hasNumber },
    { label: "One special character (!@#$)", met: hasSpecial },
  ];

  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-slate-50/80 p-3 space-y-2.5 text-xs animate-in fade-in duration-200 ${className}`}
    >
      {/* Header with Strength Meter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
          {isStrong ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>Password Strength:</span>
        </div>

        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getBadgeStyle()}`}
        >
          {strengthLabel}
        </span>
      </div>

      {/* 4-Step Progress Bars */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-full rounded-full transition-all duration-300 ${getSegmentColor(
              index
            )}`}
          />
        ))}
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 border-t border-slate-200/60">
        {requirements.map((req, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 text-[11px] transition-colors ${
              req.met ? "text-emerald-700 font-semibold" : "text-slate-400"
            }`}
          >
            {req.met ? (
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
              </span>
            ) : (
              <span className="w-3.5 h-3.5 rounded-full bg-slate-200/80 flex items-center justify-center shrink-0">
                <span className="w-1 h-1 rounded-full bg-slate-400" />
              </span>
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>

      {!hasNoSpaces && (
        <div className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
          <X className="w-3 h-3" /> Password cannot contain spaces.
        </div>
      )}
    </div>
  );
}
