"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Loader2,
  Trash2,
  MapPin,
  Award,
  UploadCloud,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { professionalsApi, ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  profile: ProfessionalProfileItem;
  onProfileUpdated?: (updated: ProfessionalProfileItem) => void;
}

export default function ProfessionalProfileHeroCard({
  profile,
  onProfileUpdated,
}: Props) {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const categoryName =
    profile.categoryId?.label || profile.categoryId?.name || "Verified Professional";

  const broadcastUpdate = (updated: ProfessionalProfileItem) => {
    if (onProfileUpdated) {
      onProfileUpdated(updated);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("professional-profile-updated", { detail: updated })
      );
    }
  };

  const handlePhotoFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be less than 10MB.");
      return;
    }

    setIsUploadingPhoto(true);
    const toastId = toast.loading("Uploading high-resolution profile photo...");

    try {
      const res = await professionalsApi.uploadPhoto(file);
      const updatedProfile = res?.data || res?.profile || res;
      if (updatedProfile && (updatedProfile._id || updatedProfile.fullName)) {
        broadcastUpdate(updatedProfile);
        toast.success("Profile photo updated successfully!", { id: toastId });
      } else {
        toast.success("Profile photo uploaded!", { id: toastId });
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Photo upload error:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload profile photo. Please try again.",
        { id: toastId }
      );
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleCoverFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Cover file size must be less than 10MB.");
      return;
    }

    setIsUploadingCover(true);
    const toastId = toast.loading("Uploading cover banner...");

    try {
      const res = await professionalsApi.uploadCover(file);
      const updatedProfile = res?.data || res?.profile || res;
      if (updatedProfile && (updatedProfile._id || updatedProfile.fullName)) {
        broadcastUpdate(updatedProfile);
        toast.success("Cover banner updated successfully!", { id: toastId });
      } else {
        toast.success("Cover banner uploaded!", { id: toastId });
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Cover upload error:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload cover banner.",
        { id: toastId }
      );
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile.photoUrl) return;

    if (!confirm("Are you sure you want to remove your profile photo?")) return;

    setIsRemovingPhoto(true);
    const toastId = toast.loading("Removing profile photo...");

    try {
      const res = await professionalsApi.removePhoto();
      const updatedProfile = res?.data || res?.profile || res;
      if (updatedProfile) {
        broadcastUpdate(updatedProfile);
        toast.success("Profile photo removed.", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Failed to remove profile photo.", { id: toastId });
    } finally {
      setIsRemovingPhoto(false);
    }
  };

  const handleRemoveCover = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile.coverUrl) return;

    if (!confirm("Are you sure you want to remove your cover photo?")) return;

    const toastId = toast.loading("Removing cover banner...");
    try {
      const res = await professionalsApi.removeCover();
      const updatedProfile = res?.data || res?.profile || res;
      if (updatedProfile) {
        broadcastUpdate(updatedProfile);
        toast.success("Cover banner removed.", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Failed to remove cover banner.", { id: toastId });
    }
  };

  const completeness = profile.completeness || 75;

  return (
    <div className="relative rounded-3xl bg-white border border-[#DCE5F5] shadow-sm overflow-hidden transition-all duration-300">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={photoInputRef}
        accept="image/png,image/jpeg,image/webp,image/jpg,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePhotoFile(file);
        }}
      />
      <input
        type="file"
        ref={coverInputRef}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleCoverFile(file);
        }}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* 1. Cover Photo Banner Section                                          */}
      {/* ---------------------------------------------------------------------- */}
      <div className="relative h-44 sm:h-52 md:h-60 lg:h-64 w-full overflow-hidden group/cover">
        {profile.coverUrl ? (
          <Image
            src={profile.coverUrl}
            alt={`${profile.fullName} Cover Banner`}
            fill
            sizes="100vw"
            priority
            className="object-cover transition-transform duration-500 group-hover/cover:scale-105"
          />
        ) : (
          /* Ultra-Luxurious Royal Sapphire Mesh Banner */
          <div className="w-full h-full relative bg-gradient-to-r from-[#06112E] via-[#0A1F66] to-[#123888] overflow-hidden">
            {/* Ambient Radial Lights for Depth */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-80 h-80 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.08] [background-size:24px_24px] pointer-events-none" />
          </div>
        )}

        {/* Ambient Dark Gradient Scrim for Controls Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25 pointer-events-none" />

        {/* Top Floating Badge & Cover Controls */}
        <div className="absolute top-3.5 sm:top-4 left-3.5 sm:left-5 right-3.5 sm:right-5 flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Professional Verified Portal</span>
          </div>

          <div className="flex items-center gap-2">
            {profile.coverUrl && (
              <button
                type="button"
                onClick={handleRemoveCover}
                title="Remove cover photo"
                className="p-2 rounded-xl bg-black/45 hover:bg-rose-600/90 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/45 hover:bg-black/70 active:scale-95 backdrop-blur-md border border-white/25 text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:border-white/50"
            >
              {isUploadingCover ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {profile.coverUrl ? "Change Cover" : "Add Cover Banner"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. Avatar & Professional Details Section (Crystal Clear on White)     */}
      {/* ---------------------------------------------------------------------- */}
      <div className="px-4 sm:px-7 lg:px-8 pb-6 sm:pb-7">
        
        {/* Main Row: Avatar + Details on Left, Action CTAs on Right */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 relative z-20">
          
          {/* Left Block: Floating Avatar + Professional Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            
            {/* The Luxury Avatar Circle (Floats gracefully over banner edge) */}
            <div
              className={`relative -mt-16 sm:-mt-20 md:-mt-22 shrink-0 group/avatar cursor-pointer select-none rounded-full transition-transform duration-200 active:scale-95 ${
                isDraggingPhoto ? "ring-4 ring-[#1E5BFF] scale-105" : ""
              }`}
              onClick={() => photoInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingPhoto(true);
              }}
              onDragLeave={() => setIsDraggingPhoto(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingPhoto(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handlePhotoFile(file);
              }}
              title="Click or drag an image here to update profile photo"
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-white border-[4px] sm:border-[5px] border-white shadow-[0_12px_36px_rgba(10,31,102,0.20)] ring-1 ring-slate-200/80">
                {profile.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt={profile.photoAlt || profile.fullName}
                    fill
                    sizes="144px"
                    priority
                    className="object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                  />
                ) : (
                  /* Initial Avatar fallback */
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1F66] via-[#1034A6] to-[#1E5BFF] text-white">
                    <span className="font-black text-3xl sm:text-4xl tracking-wider">
                      {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "P"}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-100 uppercase tracking-wider mt-0.5 opacity-80">
                      Upload
                    </span>
                  </div>
                )}

                {/* Hover Backdrop Overlay */}
                <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 z-10">
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md text-white" />
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white">
                    {profile.photoUrl ? "Change Photo" : "Upload Photo"}
                  </span>
                </div>

                {/* Uploading Spinner Overlay */}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-1.5 z-20">
                    <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-[#1E5BFF]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Uploading...
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Camera Button Badge (Bottom-Right of Avatar) */}
              <div
                className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1E5BFF] hover:bg-[#0A1F66] text-white border-2 border-white shadow-lg flex items-center justify-center transition-all duration-200 group-hover/avatar:scale-110 active:scale-90"
                title="Upload Profile Photo"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Camera className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                )}
              </div>

              {/* Remove Photo quick trigger button if photo exists */}
              {profile.photoUrl && !isUploadingPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={isRemovingPhoto}
                  title="Remove Profile Photo"
                  className="absolute -top-1 -right-1 z-20 w-6 h-6 rounded-full bg-white text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 shadow-md flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Professional Identity: Placed 100% on White Background with Zero Overlap */}
            <div className="text-center sm:text-left space-y-1.5 pt-2 sm:pt-3">
              
              {/* Row 1: Full Name + Active Beacon + Verified Badge */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 flex-wrap">
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#0A1F66] tracking-tight leading-tight">
                  {profile.fullName}
                </h2>

                {/* Glowing Online / Active Dot Beacon with Pulsing Ping */}
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 shadow-2xs transition-all hover:bg-emerald-100/70"
                  title="Active Practitioner on i-VANTAGE Network"
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                    Active
                  </span>
                </div>

                {/* Official Verified Badge */}
                {profile.verificationStatus === "VERIFIED" ? (
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-emerald-800 text-xs font-black shadow-2xs"
                    title="Credentials officially audited & Bar Council / ICAI verified"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                    <span>Verified</span>
                  </div>
                ) : (
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-2xs"
                    title="Identity verification in progress"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Verification In Progress</span>
                  </div>
                )}
              </div>

              {/* Row 2: Professional Headline */}
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl line-clamp-2">
                {profile.headline || "Complete your headline and practice narrative below."}
              </p>

              {/* Row 3: Category, Location, Experience Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-500 font-semibold">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-[#1E5BFF] border border-blue-200/90 font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{categoryName}</span>
                </span>

                {profile.city && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/80">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.city}{profile.state ? `, ${profile.state}` : ""}</span>
                  </span>
                )}

                {profile.yearsExperience ? (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/80">
                    {profile.yearsExperience}+ Years Practice
                  </span>
                ) : null}
              </div>

            </div>

          </div>

          {/* Right Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:items-center justify-center sm:justify-end gap-2.5 pt-3 lg:pt-0 w-full sm:w-auto">
            {/* Quick Upload Photo Action */}
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1E5BFF] text-xs font-bold border border-slate-200 hover:border-blue-200 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              {isUploadingPhoto ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5 text-[#1E5BFF]" />
              )}
              <span>{profile.photoUrl ? "Update Photo" : "Upload Photo"}</span>
            </button>

            {/* View Live Profile Button */}
            {profile.slug && (
              <Link
                href={`/professionals/${profile.slug}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A1F66] hover:bg-[#1E5BFF] text-white text-xs font-bold shadow-sm transition-all hover:shadow-md cursor-pointer active:scale-95"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Quick Completeness Hint Pill                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Profile Quality:</span>
              <span className="text-[#1E5BFF] font-black">{completeness}%</span>
            </div>
            <div className="w-28 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-[#1E5BFF] rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            {profile.photoUrl ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                <Check className="w-3.5 h-3.5" /> Profile headshot verified (+10% completeness)
              </span>
            ) : (
              <span className="text-amber-700 font-medium">
                Tip: Upload your professional headshot to earn +10% completeness
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
