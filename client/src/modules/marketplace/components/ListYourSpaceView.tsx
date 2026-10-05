"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from "lucide-react";
import Container from "@/components/common/Container";
import { createLead } from "@/modules/lead/lead.api";
import {
  isValidIndianPhone,
  isValidEmail,
  normalizeIndianPhone,
  VALIDATION_MESSAGES,
} from "@/lib/validation";

interface FormState {
  brandName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  address: string;
  spaceTypes: string[];
  totalSeats: string;
  priceEstimate: string;
  notes: string;
}

interface FormErrors {
  brandName?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  city?: string;
  area?: string;
  spaceTypes?: string;
}

const SPACE_OPTIONS = [
  "Private Executive Cabins",
  "Dedicated Desks",
  "Hot Desks / Flexi",
  "Meeting & Boardroom Suites",
  "Managed Enterprise Floors",
];

const INITIAL_FORM: FormState = {
  brandName: "",
  contactPerson: "",
  phone: "",
  email: "",
  city: "Gurugram",
  area: "Sohna Road",
  address: "",
  spaceTypes: ["Private Executive Cabins", "Dedicated Desks"],
  totalSeats: "",
  priceEstimate: "",
  notes: "",
};

export default function ListYourSpaceView() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSpaceType = (type: string) => {
    setFormData((prev) => {
      const exists = prev.spaceTypes.includes(type);
      return {
        ...prev,
        spaceTypes: exists
          ? prev.spaceTypes.filter((t) => t !== type)
          : [...prev.spaceTypes, type],
      };
    });
    if (errors.spaceTypes) {
      setErrors((prev) => ({ ...prev, spaceTypes: undefined }));
    }
  };

  const validate = (): { isValid: boolean; errs: FormErrors } => {
    const errs: FormErrors = {};

    if (!formData.brandName.trim()) {
      errs.brandName = "Center or brand name is required.";
    }

    if (!formData.contactPerson.trim()) {
      errs.contactPerson = "Contact person name is required.";
    }

    if (!formData.phone.trim()) {
      errs.phone = VALIDATION_MESSAGES.PHONE_REQUIRED;
    } else if (!isValidIndianPhone(formData.phone)) {
      errs.phone = VALIDATION_MESSAGES.PHONE_INVALID;
    }

    if (!formData.email.trim()) {
      errs.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
    } else if (!isValidEmail(formData.email)) {
      errs.email = VALIDATION_MESSAGES.EMAIL_INVALID;
    }

    if (!formData.area.trim()) {
      errs.area = "Micro-location / area is required.";
    }

    if (formData.spaceTypes.length === 0) {
      errs.spaceTypes = "Please select at least one space type available.";
    }

    setErrors(errs);
    return { isValid: Object.keys(errs).length === 0, errs };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const { isValid, errs } = validate();
    if (!isValid) {
      const firstKey = Object.keys(errs)[0];
      const targetElement =
        document.getElementById(`field-${firstKey}`) ||
        document.getElementById("operator-form-card");
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        (targetElement as HTMLElement).focus?.();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPhone = normalizeIndianPhone(formData.phone);
      const fullMessage = [
        `Operator / Brand Name: ${formData.brandName.trim()}`,
        `Contact Person: ${formData.contactPerson.trim()}`,
        `Location: ${formData.area.trim()}, ${formData.city}`,
        formData.address ? `Address: ${formData.address.trim()}` : "",
        `Available Space Types: ${formData.spaceTypes.join(", ")}`,
        formData.totalSeats ? `Total Available Seats: ${formData.totalSeats}` : "",
        formData.priceEstimate ? `Target Price: ₹${formData.priceEstimate}` : "",
        formData.notes ? `Additional Notes: ${formData.notes.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      await createLead({
        fullName: formData.contactPerson.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: cleanPhone,
        services: [],
        location: `Partner Onboarding: ${formData.city} - ${formData.area}`,
        message: fullMessage,
      });

      setIsSuccess(true);
      setFormData(INITIAL_FORM);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit space details. Please try again or reach out to our team."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-gradient-to-b from-[#F5F9FF] via-white to-slate-50/50 py-10 sm:py-16">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A1F6606_1px,transparent_1px),linear-gradient(to_bottom,#0A1F6606_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#B45309] shadow-2xs">
              <Sparkles size={13} className="text-[#F4A900]" />
              <span>Workspace Operator & Landlord Network</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0A1F66]">
              List Your Space on{" "}
              <span className="bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#1E5BFF] bg-clip-text text-transparent">
                i-VANTAGE Marketplace
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Showcase private cabins, dedicated desks, and enterprise boardrooms to verified corporate clients and venture-backed startups across Gurugram and Delhi NCR.
            </p>
          </div>

          {/* Value Propositions Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#1E5BFF] flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Zero Upfront Listing Fee</p>
                <p className="text-[11px] text-slate-500">Free to list and showcase hubs</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Verified Corporate Leads</p>
                <p className="text-[11px] text-slate-500">High-intent startup & enterprise teams</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Fast 24-Hr Verification</p>
                <p className="text-[11px] text-slate-500">Dedicated ops manager assigned</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_12px_40px_rgba(10,31,102,0.06)]">
            {isSuccess ? (
              <div className="py-10 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
                  <CheckCircle2 size={36} strokeWidth={2} />
                </div>

                <h3 className="text-2xl font-black text-[#0A1F66]">
                  Space Onboarding Request Received!
                </h3>

                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for submitting your workspace details. Our Partnerships & Operations team will review your property and reach out within 24 hours to schedule verification.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData(INITIAL_FORM);
                    }}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Submit Another Center
                  </button>
                  <Link
                    href="/gurugram"
                    className="px-6 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF] transition shadow-xs"
                  >
                    Browse Live Marketplace
                  </Link>
                </div>
              </div>
            ) : (
              <form id="operator-form-card" onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg sm:text-xl font-black text-[#0A1F66]">
                    Operator Onboarding & Property Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fill in your center information below to begin the partnership onboarding workflow.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Center / Brand Name & Contact Person */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Center / Brand Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-brandName"
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => {
                        setFormData({ ...formData, brandName: e.target.value });
                        if (errors.brandName) setErrors({ ...errors, brandName: undefined });
                      }}
                      placeholder="e.g. Horizon Workspaces DLF"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition outline-none focus:ring-2 ${
                        errors.brandName
                          ? "border-red-300 bg-red-50/40 focus:ring-red-200"
                          : "border-slate-200 bg-slate-50/60 focus:border-[#1E5BFF] focus:ring-blue-100"
                      }`}
                    />
                    {errors.brandName && (
                      <p className="text-[11px] font-semibold text-red-600">{errors.brandName}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Contact Person Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-contactPerson"
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => {
                        setFormData({ ...formData, contactPerson: e.target.value });
                        if (errors.contactPerson) setErrors({ ...errors, contactPerson: undefined });
                      }}
                      placeholder="e.g. Amit Verma"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition outline-none focus:ring-2 ${
                        errors.contactPerson
                          ? "border-red-300 bg-red-50/40 focus:ring-red-200"
                          : "border-slate-200 bg-slate-50/60 focus:border-[#1E5BFF] focus:ring-blue-100"
                      }`}
                    />
                    {errors.contactPerson && (
                      <p className="text-[11px] font-semibold text-red-600">{errors.contactPerson}</p>
                    )}
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="e.g. 9876543210"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition outline-none focus:ring-2 ${
                        errors.phone
                          ? "border-red-300 bg-red-50/40 focus:ring-red-200"
                          : "border-slate-200 bg-slate-50/60 focus:border-[#1E5BFF] focus:ring-blue-100"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] font-semibold text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Corporate Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="e.g. partnerships@horizon.com"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition outline-none focus:ring-2 ${
                        errors.email
                          ? "border-red-300 bg-red-50/40 focus:ring-red-200"
                          : "border-slate-200 bg-slate-50/60 focus:border-[#1E5BFF] focus:ring-blue-100"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] font-semibold text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* City & Micro-Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      City
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Gurugram">Gurugram (Gurgaon)</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Noida">Noida</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Micro-Location / Hub <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="field-area"
                      type="text"
                      value={formData.area}
                      onChange={(e) => {
                        setFormData({ ...formData, area: e.target.value });
                        if (errors.area) setErrors({ ...errors, area: undefined });
                      }}
                      placeholder="e.g. Sohna Road / Cyber City / Sec 48"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition outline-none focus:ring-2 ${
                        errors.area
                          ? "border-red-300 bg-red-50/40 focus:ring-red-200"
                          : "border-slate-200 bg-slate-50/60 focus:border-[#1E5BFF] focus:ring-blue-100"
                      }`}
                    />
                    {errors.area && (
                      <p className="text-[11px] font-semibold text-red-600">{errors.area}</p>
                    )}
                  </div>
                </div>

                {/* Available Space Types (Multi-Select Pills) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Space Categories Available <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SPACE_OPTIONS.map((type) => {
                      const selected = formData.spaceTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleSpaceType(type)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                            selected
                              ? "bg-[#0A1F66] text-white border-[#0A1F66] shadow-2xs"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              selected ? "bg-[#F4A900]" : "bg-slate-300"
                            }`}
                          />
                          <span>{type}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.spaceTypes && (
                    <p className="text-[11px] font-semibold text-red-600">{errors.spaceTypes}</p>
                  )}
                </div>

                {/* Capacity & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Available Seats / Capacity
                    </label>
                    <input
                      type="text"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                      placeholder="e.g. 50 Seats / 6 Cabins"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Approx. Starting Price (₹ / seat / mo)
                    </label>
                    <input
                      type="text"
                      value={formData.priceEstimate}
                      onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
                      placeholder="e.g. 7999"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Additional Details / Virtual Tour Link
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Mention any key amenities (metro connectivity, cafeteria, power backup) or paste a link to photos..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Inline Validation Warning near button */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2 animate-in fade-in">
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <span>Please fill in the required fields marked with * above before submitting.</span>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-slate-400">
                    Zero spam guarantee &bull; Assigned partner manager
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-900/15 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Space...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Center For Listing</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Already a Partner Callout */}
          <div className="mt-8 text-center text-xs text-slate-500">
            Already a verified partner operator?{" "}
            <Link
              href="/login"
              className="font-bold text-[#1E5BFF] hover:underline"
            >
              Sign In to Partner Portal &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
