"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { marketplaceApi } from "@/lib/marketplace.api";
import {
  isValidIndianPhone,
  isValidEmail,
  normalizeIndianPhone,
  VALIDATION_MESSAGES,
} from "@/lib/validation";

export interface EnquiryListingTarget {
  id: string;
  title: string;
  image?: string;
  area?: string;
  city?: string;
  price?: number;
  unit?: string;
  category?: string;
  vendorName?: string;
}

interface ListingEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: EnquiryListingTarget | null;
}

export default function ListingEnquiryModal({
  isOpen,
  onClose,
  listing,
}: ListingEnquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset form when modal opens with new listing
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrorMsg(null);
    }
  }, [isOpen, listing]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !listing) return null;

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
      await marketplaceApi.submitLead({
        listingId: listing.id,
        listingTitle: listing.title,
        spaceTitle: listing.title,
        name: cleanName,
        phone: normalizeIndianPhone(cleanPhone),
        email: cleanEmail ? cleanEmail.toLowerCase() : undefined,
        message:
          message.trim() ||
          `Interested in touring ${listing.title}${
            moveInDate ? ` with target move-in on ${moveInDate}` : ""
          }.`,
        source: "listing_card_popup",
      });

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit inquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0A1F66]/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_25px_70px_rgba(10,31,102,0.25)] border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] p-5 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 pr-8">
            {listing.image && (
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-white/20 shadow-md">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/15 text-blue-200 uppercase tracking-wider mb-1">
                <ShieldCheck size={11} className="text-[#F4A900]" /> Verified Operator Rate
              </span>
              <h3 className="text-base font-bold text-white truncate">
                {listing.title}
              </h3>
              <p className="text-xs text-blue-100 flex items-center gap-1 truncate">
                <MapPin size={12} className="text-[#F4A900] shrink-0" />
                <span>{listing.area || "Gurugram"}, {listing.city || "Gurugram"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-50 duration-300">
                <CheckCircle2 size={36} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-[#0A1F66]">
                  Inquiry Received!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Our dedicated workspace manager will contact you at <strong>{phone}</strong> within 1 hour with exclusive rates and tour options.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF] transition shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-[#0A1F66]">
                    Instant Workspace Tour &amp; Quote
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Connect directly with the center operator. Zero brokerage.
                  </p>
                </div>
                {listing.price && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block">From</span>
                    <span className="text-sm font-black text-[#1E5BFF]">
                      ₹{listing.price.toLocaleString("en-IN")}
                      <span className="text-[10px] text-slate-500 font-normal">
                        /{listing.unit?.replace("per-", "") || "mo"}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium animate-in fade-in">
                  • {errorMsg}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Work Email <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="rahul@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Move-in Date */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Expected Move-in Date <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Specific Requirements <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Number of team seats, private cabin preferences, etc."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1E5BFF] focus:bg-white focus:ring-2 focus:ring-blue-100 transition resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] text-white text-xs font-bold hover:brightness-110 shadow-md shadow-blue-900/15 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-98"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-white" />
                    <span>Transmitting Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Inquiry to Space Operator</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
                <span>🔒 100% Privacy Protected</span>
                <span>⚡ 1-Hour SLA Call</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
