"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { professionalsApi, ProfessionalProfileItem } from "@/lib/professionals.api";

export default function ProfessionalProfileEditor() {
  const [profile, setProfile] = useState<ProfessionalProfileItem | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "identity">("content");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Content form fields
  const [headline, setHeadline] = useState("");
  const [summary, setSummary] = useState("");
  const [aboutMd, setAboutMd] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [languages, setLanguages] = useState("");
  const [consultationFeeInr, setConsultationFeeInr] = useState<string>("");
  const [consultationHours, setConsultationHours] = useState("");
  const [responseTimeText, setResponseTimeText] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [contactMode, setContactMode] = useState<"hub" | "direct">("hub");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Identity form fields
  const [fullName, setFullName] = useState("");
  const [qualification, setQualification] = useState("");
  const [registrationBody, setRegistrationBody] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [identityReason, setIdentityReason] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await professionalsApi.getMyProfile();
        const p = res?.profile || res;
        if (p && (p._id || p.fullName)) {
          setProfile(p);

          // Populate content
          setHeadline(p.headline || "");
          setSummary(p.summary || "");
          setAboutMd(p.aboutMd || "");
          setCity(p.city || "");
          setState(p.state || "");
          setLanguages(Array.isArray(p.languages) ? p.languages.join(", ") : "");
          setConsultationFeeInr(p.consultationFeeInr ? String(p.consultationFeeInr) : "");
          setConsultationHours(p.consultationHours || "");
          setResponseTimeText(p.responseTimeText || "");
          setSpecializations(Array.isArray(p.specializations) ? p.specializations.join(", ") : "");
          setContactMode(p.contactMode || "hub");
          setContactWhatsapp(p.contactWhatsapp || "");
          setContactPhone(p.contactPhone || "");

          // Populate identity
          setFullName(p.fullName || "");
          setQualification(p.qualification || "");
          setRegistrationBody(p.registrationBody || "");
          setRegistrationNumber(p.registrationNumber || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = {
        headline: headline.trim(),
        summary: summary.trim(),
        aboutMd: aboutMd.trim(),
        city: city.trim(),
        state: state.trim(),
        languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
        consultationFeeInr: consultationFeeInr ? Number(consultationFeeInr) : undefined,
        consultationHours: consultationHours.trim(),
        responseTimeText: responseTimeText.trim(),
        specializations: specializations.split(",").map((s) => s.trim()).filter(Boolean),
        contactMode,
        contactWhatsapp: contactWhatsapp.trim(),
        contactPhone: contactPhone.trim(),
      };

      const res = await professionalsApi.updateMyContent(payload);
      if (res && res.profile) {
        setProfile(res.profile);
        setMessage({ type: "success", text: "Profile content updated and published successfully!" });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to save profile content.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestIdentityChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = {
        fullName: fullName.trim(),
        qualification: qualification.trim(),
        registrationBody: registrationBody.trim(),
        registrationNumber: registrationNumber.trim(),
        reason: identityReason.trim() || "Routine verification update",
      };

      const res = await professionalsApi.requestIdentityChange(payload);
      if (res) {
        setMessage({
          type: "success",
          text: "Identity revision submitted to Compliance Admin for verification review.",
        });
        setIdentityReason("");
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to submit identity revision.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0A1F66]">
            Profile &amp; Credentials Editor
          </h1>
          <p className="text-xs text-slate-500">
            Keep your bio, fees, and statutory registrations accurate and up-to-date.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab("content");
              setMessage(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "content"
                ? "bg-white text-[#0A1F66] shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bio &amp; Practice Details
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("identity");
              setMessage(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "identity"
                ? "bg-white text-[#0A1F66] shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Identity &amp; Statutory (Audit Review)
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-3.5 rounded-2xl text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab 1: Bio & Practice Details Form */}
      {activeTab === "content" && (
        <form onSubmit={handleSaveContent} className="rounded-3xl bg-white border border-[#DCE5F5] p-6 shadow-2xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headline / Practice Tagline *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Chartered Accountant & Corporate Tax Strategist"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Executive Summary
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief 1-2 sentence overview shown on search cards"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Biography &amp; Practice Narrative (Markdown Supported)
              </label>
              <textarea
                rows={6}
                value={aboutMd}
                onChange={(e) => setAboutMd(e.target.value)}
                placeholder="Share your experience, representation before statutory tribunals, client case studies..."
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Gurugram"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Haryana"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Initial Consultation Fee (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                value={consultationFeeInr}
                onChange={(e) => setConsultationFeeInr(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Consultation Availability Hours
              </label>
              <input
                type="text"
                value={consultationHours}
                onChange={(e) => setConsultationHours(e.target.value)}
                placeholder="e.g. Mon–Sat: 10:00 AM – 7:00 PM"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Average Response Time
              </label>
              <input
                type="text"
                value={responseTimeText}
                onChange={(e) => setResponseTimeText(e.target.value)}
                placeholder="e.g. Within 2 Hours"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Spoken Languages (Comma separated)
              </label>
              <input
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="e.g. English, Hindi, Punjabi"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specializations / Tags (Comma separated)
              </label>
              <input
                type="text"
                value={specializations}
                onChange={(e) => setSpecializations(e.target.value)}
                placeholder="e.g. Statutory Audit, GST Appeals, Startup Valuation, M&A"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Mode Preference
              </label>
              <select
                value={contactMode}
                onChange={(e) => setContactMode(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none"
              >
                <option value="hub">Hub Managed (Protect phone/email publicly)</option>
                <option value="direct">Direct Display (Show phone/WhatsApp on card)</option>
              </select>
            </div>

            {contactMode === "direct" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none"
                />
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save &amp; Publish Content</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Identity & Statutory (Requires Admin Review) */}
      {activeTab === "identity" && (
        <form onSubmit={handleRequestIdentityChange} className="rounded-3xl bg-white border border-[#DCE5F5] p-6 shadow-2xs space-y-5">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Compliance &amp; Verification Protocol</span>
            </div>
            <p>
              To safeguard trust on the I-VANTAGE network, modifications to official statutory registration body, license numbers, or legal full names require compliance review by our verification team before going live.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Legal Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Professional Qualification *
              </label>
              <input
                type="text"
                required
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. FCA, DISA (ICAI)"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Statutory Registration Body *
              </label>
              <input
                type="text"
                required
                value={registrationBody}
                onChange={(e) => setRegistrationBody(e.target.value)}
                placeholder="e.g. Institute of Chartered Accountants of India (ICAI)"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Membership / License / COP Number *
              </label>
              <input
                type="text"
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. 523412"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Identity Revision
              </label>
              <input
                type="text"
                value={identityReason}
                onChange={(e) => setIdentityReason(e.target.value)}
                placeholder="e.g. Added Fellowship (FCA) credentials / updated firm name"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-[#1E5BFF]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF] transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Submit for Verification Review</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
