"use client";

import React, { useState } from "react";
import {
  Video,
  Building,
  Phone,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  User,
  Mail,
  Calendar,
  Clock,
  Briefcase,
} from "lucide-react";
import { professionalsApi, ProfessionalProfileItem } from "@/lib/professionals.api";

interface Props {
  professional: ProfessionalProfileItem;
  preselectedService?: string;
  compact?: boolean;
  formId?: string;
}

export default function ProfileConsultationForm({
  professional,
  preselectedService,
  compact = false,
  formId,
}: Props) {
  const p = professional;

  const [serviceTitle, setServiceTitle] = useState<string>(preselectedService || "");
  const [prevPreselected, setPrevPreselected] = useState(preselectedService);

  // Sync state when preselectedService prop changes (React recommended pattern)
  if (preselectedService !== prevPreselected) {
    setPrevPreselected(preselectedService);
    setServiceTitle(preselectedService || "");
  }

  const [mode, setMode] = useState<"ONLINE" | "IN_PERSON" | "AUDIO">("ONLINE");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [preferredSlot, setPreferredSlot] = useState<"MORNING" | "AFTERNOON" | "EVENING">("AFTERNOON");
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientCompany, setClientCompany] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ referenceNumber?: string; message: string } | null>(null);

  // Set default minimum date to tomorrow (pure initializer)
  const [tomorrowStr] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!clientName.trim() || clientName.trim().length < 2) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes("@")) {
      setErrorMsg("Please enter a valid business or personal email address.");
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim().replace(/\D/g, "").length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMsg("Please describe your query in at least 10 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        clientCompany: clientCompany.trim() || undefined,
        mode,
        serviceTitle: serviceTitle || "General Advisory Consultation",
        preferredDate: preferredDate || undefined,
        preferredSlot,
        message: message.trim(),
      };

      const res = await professionalsApi.submitEnquiry(p.slug, payload);

      if (res && res.success) {
        setSuccessData({
          referenceNumber: res.data?.referenceNumber,
          message:
            res.message ||
            `Consultation request successfully received! We have notified ${p.fullName}.`,
        });
      } else {
        setErrorMsg(res?.message || "Failed to submit enquiry. Please try again.");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        error?.response?.data?.message ||
          error?.message ||
          "Could not send enquiry due to a network or server issue. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setErrorMsg(null);
    setServiceTitle("");
    setMessage("");
  };

  const services = Array.isArray(p.services) && p.services.length > 0
    ? p.services.filter((s) => s.isActive !== false)
    : (p.specializations || []).map((spec) => ({ title: spec, priceInr: p.consultationFeeInr }));

  const defaultId = formId || (compact ? "consultation-section-desktop" : "consultation-section");

  return (
    <section id={defaultId} className={compact ? "" : "pt-6 border-t border-slate-200"}>
      <div
        className={
          compact
            ? "p-5 sm:p-6 bg-white space-y-4"
            : "rounded-3xl bg-white border border-[#DCE5F5] p-6 sm:p-8 shadow-[0_8px_30px_rgba(10,31,102,0.08)]"
        }
      >
        {successData ? (
          /* Success Screen */
          <div className="text-center py-6 sm:py-8 space-y-3 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-2xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-[#0A1F66]">
              Consultation Request Received!
            </h3>

            {successData.referenceNumber && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                Ref: {successData.referenceNumber}
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              We have forwarded your consultation request directly to{" "}
              <strong>{p.fullName}</strong>. A confirmation has been sent to <strong>{clientEmail}</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 space-y-1 text-left">
              <div className="font-bold text-slate-700">Next Steps:</div>
              <div>• Direct review within SLA response time.</div>
              <div>• Calendar invite and meeting link will be dispatched.</div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-2 px-5 py-2 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF] transition-colors cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "space-y-6"}>
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1E5BFF]">
                  Direct Client Intake
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  NDA Protected
                </span>
              </div>
              <h2
                className={
                  compact
                    ? "text-base sm:text-lg font-black text-[#0A1F66] tracking-tight leading-snug"
                    : "text-xl sm:text-2xl font-black text-[#0A1F66] tracking-tight"
                }
              >
                {compact ? `Schedule Consultation with ${p.fullName}` : `Schedule Consultation with ${p.fullName}`}
              </h2>
              <p className="text-xs text-slate-500">
                {compact
                  ? "Connect directly with verified practitioner. Zero brokerage."
                  : "Fill out your requirement brief below. We connect you directly with the professional."}
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className={compact ? "space-y-3" : "space-y-4"}>
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selected Service / Advisory Scope
                </label>
                <select
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 transition-all"
                >
                  <option value="">General Advisory / 1-on-1 Consultation</option>
                  {services.map((s, i) => (
                    <option key={i} value={s.title}>
                      {s.title} {s.priceInr ? `(From ₹${s.priceInr})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultation Format (Mode) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Consultation Format
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("ONLINE")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      mode === "ONLINE"
                        ? "bg-blue-50 border-[#1E5BFF] text-[#1E5BFF] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 mb-0.5" />
                    <span className="text-[10px] sm:text-[11px]">Video Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("IN_PERSON")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      mode === "IN_PERSON"
                        ? "bg-blue-50 border-[#1E5BFF] text-[#1E5BFF] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Building className="w-3.5 h-3.5 mb-0.5" />
                    <span className="text-[10px] sm:text-[11px]">Boardroom</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("AUDIO")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      mode === "AUDIO"
                        ? "bg-blue-50 border-[#1E5BFF] text-[#1E5BFF] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 mb-0.5" />
                    <span className="text-[10px] sm:text-[11px]">Audio Call</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min={tomorrowStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Slot
                  </label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value as "MORNING" | "AFTERNOON" | "EVENING")}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 transition-all"
                  >
                    <option value="MORNING">Morning (10AM-1PM)</option>
                    <option value="AFTERNOON">Afternoon (2PM-5PM)</option>
                    <option value="EVENING">Evening (5PM-8PM)</option>
                  </select>
                </div>
              </div>

              {/* Client Name & Company */}
              <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Name (Optional)
                  </label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      placeholder="e.g. Nexa Dynamics Pvt Ltd"
                      className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone */}
              <div className={compact ? "space-y-3" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official / Personal Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Brief description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requirement Brief &amp; Context *
                </label>
                <textarea
                  rows={compact ? 2 : 3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please outline the nature of your inquiry (e.g. GST notices, corporate filing, legal advisory)..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10 transition-all"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] text-white text-xs sm:text-sm font-black shadow-md hover:brightness-110 active:scale-95 disabled:opacity-60 transition-all duration-200 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Consultation Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Consultation Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
