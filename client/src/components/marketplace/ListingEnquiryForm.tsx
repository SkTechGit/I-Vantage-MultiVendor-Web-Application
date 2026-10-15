"use client";

import React, { useState, useEffect } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import {
  isValidIndianPhone,
  isValidEmail,
  normalizeIndianPhone,
  VALIDATION_MESSAGES,
} from "@/lib/validation";
import {
  Send,
  Loader2,
  CheckCircle,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Tag,
} from "lucide-react";

interface ListingEnquiryFormProps {
  listingId: string;
  listingTitle: string;
  selectedPlan?: string;
  planPrice?: number | string;
  planUnit?: string;
}

export default function ListingEnquiryForm({
  listingId,
  listingTitle,
  selectedPlan,
  planPrice,
  planUnit = "month",
}: ListingEnquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When selectedPlan changes, update prefilled message if message hasn't been edited manually
  useEffect(() => {
    if (selectedPlan && !message) {
      setMessage(`Interested in touring ${listingTitle} for "${selectedPlan}". Please share details and availability.`);
    }
  }, [selectedPlan, listingTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMsg("Please enter your full name (minimum 2 characters).");
      return;
    }

    if (!cleanPhone) {
      setErrorMsg(VALIDATION_MESSAGES.PHONE_REQUIRED);
      return;
    }

    if (!isValidIndianPhone(cleanPhone)) {
      setErrorMsg(VALIDATION_MESSAGES.PHONE_INVALID);
      return;
    }

    if (cleanEmail && !isValidEmail(cleanEmail)) {
      setErrorMsg(VALIDATION_MESSAGES.EMAIL_INVALID);
      return;
    }

    setSubmitting(true);

    try {
      const planDetail = selectedPlan ? ` [Plan: ${selectedPlan}${planPrice ? ` - ₹${Number(planPrice).toLocaleString("en-IN")}/${planUnit}` : ""}]` : "";
      const leadMsg = (message.trim() || `Interested in touring ${listingTitle}`) + planDetail;

      await marketplaceApi.submitLead({
        listingId,
        listingTitle,
        spaceTitle: listingTitle,
        name: cleanName,
        phone: normalizeIndianPhone(cleanPhone),
        email: cleanEmail ? cleanEmail.toLowerCase() : undefined,
        message: leadMsg,
        source: "listing_enquiry",
      });

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-emerald-950">
          Enquiry Received!
        </h3>
        <p className="text-xs text-emerald-800 leading-relaxed">
          Thank you, <strong>{name}</strong>! The workspace partner and our concierge team have received your request for <strong>{selectedPlan || listingTitle}</strong>. We will reach out shortly on {phone}.
          {email && (
            <span className="block mt-1.5 text-emerald-700 font-medium">
              ✉️ A confirmation email with tour details has been sent to <strong>{email}</strong>.
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setName("");
            setPhone("");
            setEmail("");
            setMessage("");
          }}
          className="text-xs font-bold text-[#1E5BFF] hover:underline pt-2 block mx-auto"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D99000] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Direct Partner Enquiry
        </span>
        <h3 className="text-lg font-bold text-[#0A1F66]">
          Schedule a Tour / Get Quote
        </h3>
        <p className="text-xs text-slate-500">
          Connect directly with the center manager. Zero commission fees.
        </p>
      </div>

      {/* Selected Plan Callout */}
      {selectedPlan && (
        <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A1F66] truncate">
            <Tag className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
            <span className="truncate">{selectedPlan}</span>
          </div>
          {planPrice && (
            <span className="text-xs font-bold text-[#1E5BFF] shrink-0">
              ₹{Number(planPrice).toLocaleString("en-IN")}/{planUnit}
            </span>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3" suppressHydrationWarning>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Your Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              required
              autoComplete="name"
              suppressHydrationWarning
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E5BFF] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="tel"
              required
              autoComplete="tel"
              suppressHydrationWarning
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E5BFF] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address (Optional)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="email"
              autoComplete="email"
              suppressHydrationWarning
              placeholder="rahul@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E5BFF] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes / Requirement
          </label>
          <textarea
            rows={2}
            suppressHydrationWarning
            placeholder="e.g. Looking for a 6-seater cabin starting next month..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#1E5BFF] transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] hover:brightness-110 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" /> Submit Enquiry
            </>
          )}
        </button>
      </form>

      <p className="text-[10px] text-slate-400 text-center">
        🔒 We respect your privacy. Zero spam guaranteed.
      </p>
    </div>
  );
}
