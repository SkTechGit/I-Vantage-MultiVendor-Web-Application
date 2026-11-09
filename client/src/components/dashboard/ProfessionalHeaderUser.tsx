"use client";

import Image from "next/image";
import Link from "next/link";
import { User, CheckCircle2 } from "lucide-react";
import { ProfessionalProfileItem } from "@/lib/professionals.api";
import { User as AuthUser } from "@/context/AuthContext";

export function ProfessionalHeaderUserPill({
  profile,
  user,
}: {
  profile: ProfessionalProfileItem | null;
  user: AuthUser | null;
}) {
  const displayName = profile?.fullName || user?.fullName || user?.name || "Professional";
  const initial = displayName.charAt(0).toUpperCase() || "P";
  const photo = profile?.photoUrl;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#0A1F66] text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 shrink-0">
        {photo ? (
          <Image
            src={photo}
            alt={displayName}
            fill
            sizes="32px"
            className="object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      <span className="hidden md:inline-block text-xs font-bold text-slate-800 max-w-[150px] truncate">
        {displayName}
      </span>
    </div>
  );
}

export function ProfessionalSidebarUserCard({
  profile,
  user,
}: {
  profile: ProfessionalProfileItem | null;
  user: AuthUser | null;
}) {
  const displayName = profile?.fullName || user?.fullName || user?.name || "Professional";
  const initial = displayName.charAt(0).toUpperCase() || "P";
  const photo = profile?.photoUrl;
  const headline = profile?.headline || "Verified Member";
  const isVerified = profile?.verificationStatus === "VERIFIED";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/professional/profile"
          className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-xs ring-1 ring-slate-200 shrink-0 group block"
          title="Edit Profile Photo"
        >
          {photo ? (
            <Image
              src={photo}
              alt={displayName}
              fill
              sizes="48px"
              className="object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0A1F66] to-[#1E5BFF] text-white flex items-center justify-center font-black text-sm">
              <span>{initial}</span>
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-black text-slate-900 truncate">
              {displayName}
            </p>
            {isVerified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            )}
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {headline}
          </p>
          <Link
            href="/dashboard/professional/profile"
            className="text-[10px] font-bold text-[#1E5BFF] hover:underline inline-block mt-0.5"
          >
            Edit Photo &amp; Bio &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
