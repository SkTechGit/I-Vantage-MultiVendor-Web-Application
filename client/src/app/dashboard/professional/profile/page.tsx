"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  ShieldCheck,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  CreditCard,
  Building,
  Upload,
  Trash2,
  ExternalLink,
  Info,
  Calendar,
  Lock,
  FileCheck,
  Award,
  Clock,
  MapPin,
  Globe,
  Briefcase,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { professionalsApi, ProfessionalProfileItem, ProfileDocumentItem } from "@/lib/professionals.api";
import ProfessionalProfileHeroCard from "@/components/professionals/dashboard/ProfessionalProfileHeroCard";

const COMMON_SPECIALIZATIONS = [
  "Taxation (Direct & Indirect)",
  "Audit & Assurance",
  "GST Filings & Litigation",
  "Corporate Law & ROC Compliance",
  "FEMA & RBI Regulatory",
  "Transfer Pricing",
  "Book-keeping & Accounting",
  "Virtual CFO Advisory",
  "Startup Valuation & Fundraise",
  "HR Strategy & Payroll",
  "Labor Laws & PF/ESIC",
  "POSH & Workplace Compliance",
  "M&A and Due Diligence",
  "IBC & Insolvency Advisory",
];

const COMMON_INDUSTRIES = [
  "Startups & Tech",
  "E-Commerce & D2C",
  "Manufacturing & Industrial",
  "Real Estate & Construction",
  "Financial Services & FinTech",
  "Healthcare & Pharma",
  "Hospitality & Retail",
  "Consulting & Professional Services",
];

export default function ProfessionalProfileEditor() {
  const [profile, setProfile] = useState<ProfessionalProfileItem | null>(null);
  const [activeTab, setActiveTab] = useState<"bio" | "fees" | "statutory" | "vault">("bio");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingDoc, setUploadingDoc] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // 1. Profile & Bio Section Fields
  // ---------------------------------------------------------------------------
  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [headline, setHeadline] = useState("");
  const [qualification, setQualification] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [registrationBody, setRegistrationBody] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [copNumber, setCopNumber] = useState("");
  const [copValidity, setCopValidity] = useState("");
  const [yearsExperience, setYearsExperience] = useState<string>("5");
  const [summary, setSummary] = useState("");
  const [aboutMd, setAboutMd] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [languages, setLanguages] = useState("English, Hindi");
  const [city, setCity] = useState("Gurugram");
  const [state, setState] = useState("Haryana");
  const [servesAreas, setServesAreas] = useState("Gurugram, Delhi, Noida, Pan-India");
  const [officeAddress, setOfficeAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [isRemoteFriendly, setIsRemoteFriendly] = useState(true);
  const [willingToTravel, setWillingToTravel] = useState(false);
  const [contactMode, setContactMode] = useState<"hub" | "direct">("hub");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [caConnectUrl, setCaConnectUrl] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [consultationModes, setConsultationModes] = useState<string[]>(["ONLINE", "IN_PERSON"]);
  const [consultationHours, setConsultationHours] = useState("Mon - Sat, 10:00 AM - 7:00 PM");
  const [responseTimeText, setResponseTimeText] = useState("Within 2 business hours");

  // ---------------------------------------------------------------------------
  // 2. Fees & Advisory Engagement Fields
  // ---------------------------------------------------------------------------
  const [feeModel, setFeeModel] = useState<string>("RANGE");
  const [consultationFeeInr, setConsultationFeeInr] = useState<string>("1500");
  const [consultationFeeMaxInr, setConsultationFeeMaxInr] = useState<string>("3500");
  const [consultationDurationMinutes, setConsultationDurationMinutes] = useState<number>(30);
  const [freeFirstConsultation, setFreeFirstConsultation] = useState(false);
  const [gstApplicable, setGstApplicable] = useState(true);
  const [retainerScopeText, setRetainerScopeText] = useState("");
  const [acceptedPaymentMethods, setAcceptedPaymentMethods] = useState<string[]>([
    "UPI",
    "NEFT_RTGS",
    "NET_BANKING",
  ]);
  const [cancellationPolicyText, setCancellationPolicyText] = useState(
    "Consultations can be rescheduled or cancelled up to 4 hours in advance."
  );

  // ---------------------------------------------------------------------------
  // 3. Statutory & Compliance Registrations
  // ---------------------------------------------------------------------------
  const [firmRegistrationNumber, setFirmRegistrationNumber] = useState("");
  const [regionalCouncil, setRegionalCouncil] = useState("NIRC");
  const [gstin, setGstin] = useState("");
  const [gstinStatus, setGstinStatus] = useState("ACTIVE");
  const [panMasked, setPanMasked] = useState("");
  const [citrNumber, setCitrNumber] = useState("");
  const [udinEnabled, setUdinEnabled] = useState(true);
  const [aadhaarSeeded, setAadhaarSeeded] = useState(true);
  const [pfEsicRegistration, setPfEsicRegistration] = useState("");
  const [shopEstLicense, setShopEstLicense] = useState("");
  const [udyamNumber, setUdyamNumber] = useState("");
  const [empanelments, setEmpanelments] = useState("");

  // ---------------------------------------------------------------------------
  // 4. Documents / Vault
  // ---------------------------------------------------------------------------
  const [documents, setDocuments] = useState<ProfileDocumentItem[]>([]);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocKind, setNewDocKind] = useState("COP_CERTIFICATE");
  const [newDocExpiry, setNewDocExpiry] = useState("");
  const docFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await professionalsApi.getMyProfile();
        const p = res?.profile || res;
        if (p && (p._id || p.fullName)) {
          setProfile(p);

          // Populate Bio
          setFullName(p.fullName || "");
          setDesignation(p.designation || "");
          setHeadline(p.headline || "");
          setQualification(p.qualification || "");
          setEnrollmentDate(p.enrollmentDate || "");
          setRegistrationBody(p.registrationBody || "Institute of Chartered Accountants of India (ICAI)");
          setRegistrationNumber(p.registrationNumber || "");
          setCopNumber(p.copNumber || "");
          setCopValidity(p.copValidity || "");
          setYearsExperience(p.yearsExperience ? String(p.yearsExperience) : "5");
          setSummary(p.summary || "");
          setAboutMd(p.aboutMd || "");
          setSelectedSpecializations(Array.isArray(p.specializations) ? p.specializations : []);
          setSelectedIndustries(Array.isArray(p.industries) ? p.industries : []);
          setLanguages(Array.isArray(p.languages) ? p.languages.join(", ") : "English, Hindi");
          setCity(p.city || "Gurugram");
          setState(p.state || "Haryana");
          setServesAreas(Array.isArray(p.servesAreas) ? p.servesAreas.join(", ") : "Gurugram, Delhi, Noida");
          setOfficeAddress(p.officeAddress || "");
          setPincode(p.pincode || "");
          setIsRemoteFriendly(p.isRemoteFriendly !== false);
          setWillingToTravel(Boolean(p.willingToTravel));
          setContactMode(p.contactMode || "hub");
          setContactEmail(p.contactEmail || "");
          setContactPhone(p.contactPhone || "");
          setContactWhatsapp(p.contactWhatsapp || "");
          setWebsiteUrl(p.websiteUrl || "");
          setLinkedinUrl(p.linkedinUrl || "");
          setCaConnectUrl(p.caConnectUrl || "");
          setBookingUrl(p.bookingUrl || "");
          setConsultationModes(Array.isArray(p.consultationModes) && p.consultationModes.length ? p.consultationModes : ["ONLINE", "IN_PERSON"]);
          setConsultationHours(p.consultationHours || "Mon - Sat, 10:00 AM - 7:00 PM");
          setResponseTimeText(p.responseTimeText || "Within 2 business hours");

          // Populate Fees
          setFeeModel(p.feeModel || "RANGE");
          setConsultationFeeInr(p.consultationFeeInr ? String(p.consultationFeeInr) : "1500");
          setConsultationFeeMaxInr(p.consultationFeeMaxInr ? String(p.consultationFeeMaxInr) : "3500");
          setConsultationDurationMinutes(p.consultationDurationMinutes || 30);
          setFreeFirstConsultation(Boolean(p.freeFirstConsultation));
          setGstApplicable(p.gstApplicable !== false);
          setRetainerScopeText(p.retainerScopeText || "");
          if (Array.isArray(p.acceptedPaymentMethods) && p.acceptedPaymentMethods.length) {
            setAcceptedPaymentMethods(p.acceptedPaymentMethods);
          }
          setCancellationPolicyText(p.cancellationPolicyText || "Consultations can be rescheduled or cancelled up to 4 hours in advance.");

          // Populate Statutory
          setFirmRegistrationNumber(p.firmRegistrationNumber || "");
          setRegionalCouncil(p.regionalCouncil || "NIRC");
          setGstin(p.gstin || "");
          setGstinStatus(p.gstinStatus || "ACTIVE");
          setPanMasked(p.panMasked || "");
          setCitrNumber(p.citrNumber || "");
          setUdinEnabled(p.udinEnabled !== false);
          setAadhaarSeeded(p.aadhaarSeeded !== false);
          setPfEsicRegistration(p.pfEsicRegistration || "");
          setShopEstLicense(p.shopEstLicense || "");
          setUdyamNumber(p.udyamNumber || "");
          setEmpanelments(Array.isArray(p.empanelments) ? p.empanelments.join(", ") : "");

          // Populate Documents
          setDocuments(Array.isArray(p.documents) ? p.documents : []);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const broadcastProfile = (updated: ProfessionalProfileItem) => {
    setProfile(updated);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("professional-profile-updated", { detail: updated }));
    }
  };

  const toggleSpecialization = (spec: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const toggleIndustry = (ind: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  const togglePaymentMethod = (method: string) => {
    setAcceptedPaymentMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const toggleConsultationMode = (mode: string) => {
    setConsultationModes((prev) =>
      prev.includes(mode) ? (prev.length > 1 ? prev.filter((m) => m !== mode) : prev) : [...prev, mode]
    );
  };

  // ---------------------------------------------------------------------------
  // Save All Changes
  // ---------------------------------------------------------------------------
  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Saving and synchronizing compliance profile...");

    try {
      const payload: any = {
        // Bio & Practice
        fullName: fullName.trim(),
        designation: designation.trim(),
        headline: headline.trim(),
        qualification: qualification.trim(),
        enrollmentDate: enrollmentDate.trim(),
        registrationBody: registrationBody.trim(),
        registrationNumber: registrationNumber.trim(),
        copNumber: copNumber.trim(),
        copValidity: copValidity.trim(),
        yearsExperience: Number(yearsExperience) || 0,
        summary: summary.trim(),
        aboutMd: aboutMd.trim(),
        specializations: selectedSpecializations,
        industries: selectedIndustries,
        languages: languages.split(",").map((s) => s.trim()).filter(Boolean),
        city: city.trim(),
        state: state.trim(),
        servesAreas: servesAreas.split(",").map((s) => s.trim()).filter(Boolean),
        officeAddress: officeAddress.trim(),
        pincode: pincode.trim(),
        isRemoteFriendly,
        willingToTravel,
        contactMode,
        contactEmail: contactEmail.trim().toLowerCase(),
        contactPhone: contactPhone.trim(),
        contactWhatsapp: contactWhatsapp.trim(),
        websiteUrl: websiteUrl.trim() || null,
        linkedinUrl: linkedinUrl.trim() || null,
        caConnectUrl: caConnectUrl.trim() || null,
        bookingUrl: bookingUrl.trim() || null,
        consultationModes,
        consultationHours: consultationHours.trim(),
        responseTimeText: responseTimeText.trim(),

        // Fees
        feeModel,
        consultationFeeInr: consultationFeeInr ? Number(consultationFeeInr) : undefined,
        consultationFeeMaxInr: consultationFeeMaxInr ? Number(consultationFeeMaxInr) : undefined,
        consultationDurationMinutes,
        freeFirstConsultation,
        gstApplicable,
        retainerScopeText: retainerScopeText.trim(),
        acceptedPaymentMethods,
        cancellationPolicyText: cancellationPolicyText.trim(),

        // Statutory
        firmRegistrationNumber: firmRegistrationNumber.trim(),
        regionalCouncil: regionalCouncil.trim(),
        gstin: gstin.trim().toUpperCase(),
        gstinStatus,
        panMasked: panMasked.trim().toUpperCase(),
        citrNumber: citrNumber.trim(),
        udinEnabled,
        aadhaarSeeded,
        pfEsicRegistration: pfEsicRegistration.trim(),
        shopEstLicense: shopEstLicense.trim(),
        udyamNumber: udyamNumber.trim(),
        empanelments: empanelments.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const res = await professionalsApi.updateMyContent(payload);
      const updatedProfile = res?.profile || res?.data || res;
      if (updatedProfile) {
        broadcastProfile(updatedProfile);
        toast.success("Profile, Fees & Statutory records updated successfully!", { id: toastId });
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to update profile.", {
        id: toastId,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Document Upload in Vault
  // ---------------------------------------------------------------------------
  const handleUploadDocument = async (file: File) => {
    if (!file) return;
    setUploadingDoc(true);
    const toastId = toast.loading("Uploading verified document to Vault...");

    try {
      const res = await professionalsApi.uploadDocument(file, {
        title: newDocTitle.trim() || file.name,
        kind: newDocKind,
        expiryDate: newDocExpiry.trim() || undefined,
      });

      const updatedProfile = res?.data || res?.profile || res;
      if (updatedProfile) {
        broadcastProfile(updatedProfile);
        if (Array.isArray(updatedProfile.documents)) {
          setDocuments(updatedProfile.documents);
        }
        toast.success("Document uploaded and recorded in compliance vault!", { id: toastId });
        setNewDocTitle("");
        setNewDocExpiry("");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload document.", { id: toastId });
    } finally {
      setUploadingDoc(false);
      if (docFileInputRef.current) docFileInputRef.current.value = "";
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Remove this document from your compliance vault?")) return;
    const toastId = toast.loading("Deleting document...");

    try {
      const res = await professionalsApi.deleteDocument(docId);
      const updatedProfile = res?.data || res?.profile || res;
      if (updatedProfile) {
        broadcastProfile(updatedProfile);
        if (Array.isArray(updatedProfile.documents)) {
          setDocuments(updatedProfile.documents);
        }
        toast.success("Document removed.", { id: toastId });
      }
    } catch (err: any) {
      toast.error("Failed to delete document.", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E5BFF]" />
        <span className="text-xs font-semibold tracking-wide text-slate-500">
          Loading Professional Profile &amp; Statutory Records...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* ------------------------------------------------------------------ */}
      {/* Top Hero Profile Banner & Avatar Uploader                           */}
      {/* ------------------------------------------------------------------ */}
      {profile && (
        <ProfessionalProfileHeroCard
          profile={profile}
          onProfileUpdated={(updated) => {
            broadcastProfile(updated);
            if (updated.headline) setHeadline(updated.headline);
            if (updated.summary) setSummary(updated.summary);
          }}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Tab Navigation Header & Quick Actions                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-[#0A1F66]">
              Professional Practice &amp; Compliance Hub
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              ICAI &amp; Bar Council Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain your practitioner credentials, consultation fee ranges, and statutory audit registrations.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("bio")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "bio"
                ? "bg-[#0A1F66] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Profile &amp; Bio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("fees")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "fees"
                ? "bg-[#0A1F66] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>2. Fees &amp; Retainers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("statutory")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "statutory"
                ? "bg-[#0A1F66] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Statutory Registrations</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vault")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "vault"
                ? "bg-[#0A1F66] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>4. Document Vault ({documents.length})</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main Tab Content Pane                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white rounded-3xl border border-[#DCE5F5] p-6 sm:p-8 shadow-xs">
        
        {/* ================================================================ */}
        {/* TAB 1: Profile & Bio Section                                     */}
        {/* ================================================================ */}
        {activeTab === "bio" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-[#0A1F66]">
                1. Practitioner Identity &amp; Practice Narrative
              </h2>
              <p className="text-xs text-slate-500">
                Essential identity, credentials, specializations, and booking links for prospective clients.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name with Honorific <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. CA Khushi Sokaria"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF] focus:ring-2 focus:ring-blue-100 font-semibold"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Designation / Fellow Credentials
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. FCA, DISA (ICAI), Partner"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Enrollment Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Enrollment Date as ACA / FCA / Advocate
                </label>
                <input
                  type="text"
                  value={enrollmentDate}
                  onChange={(e) => setEnrollmentDate(e.target.value)}
                  placeholder="e.g. 15 March 2018"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Headline / Practice Tagline */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Practice Headline / Tagline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Partner specializing in Corporate Taxation, Transfer Pricing &amp; Startup Advisory"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF] font-medium"
                />
              </div>

              {/* Short Bio (2-3 lines) */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Executive Summary (Shown on search cards &amp; previews)
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. Advising high-growth startups, multinational groups, and family offices across Gurugram &amp; Delhi NCR."
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Detailed Bio (Rich Markdown) */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Comprehensive Biography &amp; Practice Narrative (Markdown Supported)
                </label>
                <textarea
                  rows={5}
                  value={aboutMd}
                  onChange={(e) => setAboutMd(e.target.value)}
                  placeholder="Detail your professional experience, representation before statutory tribunals, client case studies, industries served..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Specializations (Multi-Select Chips) */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Areas of Expertise / Specialization (Click to select)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SPECIALIZATIONS.map((spec) => {
                    const isSelected = selectedSpecializations.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                          isSelected
                            ? "bg-[#0A1F66] text-white border-[#0A1F66] shadow-2xs font-bold"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Industries Served (Multi-Select Chips) */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Industries Served
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_INDUSTRIES.map((ind) => {
                    const isSelected = selectedIndustries.includes(ind);
                    return (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => toggleIndustry(ind)}
                        className={`text-xs px-3 py-1 rounded-xl border transition-all cursor-pointer font-medium ${
                          isSelected
                            ? "bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-2xs font-bold"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {ind}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Years Experience & Education */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Qualifications &amp; Degrees
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. B.Com (Hons), FCA, LLB"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Spoken Languages
                </label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="e.g. English, Hindi, Punjabi"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Location & Remote Friendly */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 122018"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Physical Office Address
                </label>
                <input
                  type="text"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  placeholder="e.g. Suite 402, Welldone Tech Park, Sohna Road, Sector 48, Gurugram"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Consultation Modes & Booking Link */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Consultation Modes Offered
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: "ONLINE", label: "Video Call (Google Meet / Zoom)" },
                    { key: "IN_PERSON", label: "In-Person (Boardroom / Office)" },
                    { key: "PHONE", label: "Phone Consultation" },
                  ].map((mode) => (
                    <label key={mode.key} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consultationModes.includes(mode.key)}
                        onChange={() => toggleConsultationMode(mode.key)}
                        className="rounded border-slate-300 text-[#1E5BFF] focus:ring-blue-100"
                      />
                      <span>{mode.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Online Booking / Calendar Link
                </label>
                <input
                  type="url"
                  value={bookingUrl}
                  onChange={(e) => setBookingUrl(e.target.value)}
                  placeholder="https://calendly.com/your-firm/consult"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Remote Friendly & Travel Toggles */}
              <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center gap-6 p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRemoteFriendly}
                    onChange={(e) => setIsRemoteFriendly(e.target.checked)}
                    className="rounded text-[#1E5BFF]"
                  />
                  <span className="font-bold">Remote &amp; Pan-India Friendly (Virtual Consultations Accepted)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={willingToTravel}
                    onChange={(e) => setWillingToTravel(e.target.checked)}
                    className="rounded text-[#1E5BFF]"
                  />
                  <span>Available for On-Premise Boardroom Visits &amp; Outstation Travel</span>
                </label>
              </div>

              {/* Web & Social Links */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Firm Website
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourfirm.com"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/ca-khushi"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Directory Link (ICAI CA Connect / Bar Council)
                </label>
                <input
                  type="url"
                  value={caConnectUrl}
                  onChange={(e) => setCaConnectUrl(e.target.value)}
                  placeholder="https://caconnect.icai.org/..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: Fees & Advisory Engagement Section                        */}
        {/* ================================================================ */}
        {activeTab === "fees" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-[#0A1F66]">
                2. Advisory Fee Models &amp; Engagement Terms
              </h2>
              <p className="text-xs text-slate-500">
                ICAI advertising guideline compliant fee ranges, duration, retainers, and accepted payment methods.
              </p>
            </div>

            {/* ICAI Compliant Notice */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">ICAI Council Ethics &amp; Advertising Compliance:</p>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  Per the Chartered Accountants Act &amp; Council guidelines, individual fixed rate cards can pose compliance risks. i-VANTAGE implements <strong>indicative advisory fee ranges</strong> and customized engagement scopes with zero solicitation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Fee Model */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Fee Model
                </label>
                <select
                  value={feeModel}
                  onChange={(e) => setFeeModel(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white text-slate-800 font-semibold outline-none"
                >
                  <option value="RANGE">Consultation Fee Range (Recommended)</option>
                  <option value="RETAINER">Monthly / Annual Retainer</option>
                  <option value="HOURLY">Hourly Advisory Rate</option>
                  <option value="PROJECT">Project / Filing Based Scope</option>
                </select>
              </div>

              {/* Base Fee Range (Min) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Starting Advisory Fee (₹ INR) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={consultationFeeInr}
                  onChange={(e) => setConsultationFeeInr(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 font-bold outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Base Fee Range (Max) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Upper Advisory Range (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={consultationFeeMaxInr}
                  onChange={(e) => setConsultationFeeMaxInr(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 font-bold outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Consultation Duration */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Session Duration
                </label>
                <select
                  value={consultationDurationMinutes}
                  onChange={(e) => setConsultationDurationMinutes(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white text-slate-800 outline-none"
                >
                  <option value={30}>30 Minutes Discovery Session</option>
                  <option value={45}>45 Minutes Comprehensive</option>
                  <option value={60}>60 Minutes Deep Dive</option>
                </select>
              </div>

              {/* Toggles: Free Consultation & GST */}
              <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={freeFirstConsultation}
                    onChange={(e) => setFreeFirstConsultation(e.target.checked)}
                    className="rounded text-[#1E5BFF]"
                  />
                  <span>Offer 15-Minute Free Introductory Assessment</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={gstApplicable}
                    onChange={(e) => setGstApplicable(e.target.checked)}
                    className="rounded text-[#1E5BFF]"
                  />
                  <span>Subject to +18% GST Extra</span>
                </label>
              </div>

              {/* Retainer Scope Narrative */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Monthly / Quarterly Retainer Scope (Included Deliverables)
                </label>
                <textarea
                  rows={3}
                  value={retainerScopeText}
                  onChange={(e) => setRetainerScopeText(e.target.value)}
                  placeholder="e.g. Includes monthly GST return filing (GSTR-1 &amp; 3B), quarterly TDS returns, unlimited virtual tax query calls, advance tax computation..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Payment Methods */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Accepted Payment Channels
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: "UPI", label: "Instant UPI / QR Code" },
                    { key: "NEFT_RTGS", label: "Bank Transfer (NEFT / RTGS / IMPS)" },
                    { key: "CARD", label: "Debit & Credit Cards" },
                    { key: "NET_BANKING", label: "Corporate Net Banking" },
                    { key: "CHEQUE", label: "Crossed A/C Cheque" },
                  ].map((method) => {
                    const isChecked = acceptedPaymentMethods.includes(method.key);
                    return (
                      <label key={method.key} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePaymentMethod(method.key)}
                          className="rounded text-[#1E5BFF]"
                        />
                        <span>{method.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Rescheduling, Cancellation &amp; Refund Policy
                </label>
                <input
                  type="text"
                  value={cancellationPolicyText}
                  onChange={(e) => setCancellationPolicyText(e.target.value)}
                  placeholder="e.g. Consultations can be rescheduled or cancelled up to 4 hours before the booked time."
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: Statutory Registrations Section                            */}
        {/* ================================================================ */}
        {activeTab === "statutory" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-[#0A1F66]">
                3. Statutory Regulatory &amp; Compliance Registrations
              </h2>
              <p className="text-xs text-slate-500">
                Statutory audit credentials, ICAI / Bar Council license, GSTIN, UDIN status, and official empanelments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Statutory Body */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Registration Body *
                </label>
                <input
                  type="text"
                  value={registrationBody}
                  onChange={(e) => setRegistrationBody(e.target.value)}
                  placeholder="e.g. Institute of Chartered Accountants of India (ICAI)"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Membership No */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  ICAI / Bar Council Membership No. *
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="e.g. 523412"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 font-bold outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* FRN */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Firm Registration Number (FRN)
                </label>
                <input
                  type="text"
                  value={firmRegistrationNumber}
                  onChange={(e) => setFirmRegistrationNumber(e.target.value)}
                  placeholder="e.g. 018452N"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* COP Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Certificate of Practice (COP) No.
                </label>
                <input
                  type="text"
                  value={copNumber}
                  onChange={(e) => setCopNumber(e.target.value)}
                  placeholder="e.g. COP-42819"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* COP Validity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  COP Annual Renewal Validity
                </label>
                <input
                  type="text"
                  value={copValidity}
                  onChange={(e) => setCopValidity(e.target.value)}
                  placeholder="e.g. Valid through 31 March 2027"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Regional Council */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Regional Council / State Branch
                </label>
                <select
                  value={regionalCouncil}
                  onChange={(e) => setRegionalCouncil(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white text-slate-800 outline-none"
                >
                  <option value="NIRC">NIRC (Northern India Regional Council)</option>
                  <option value="WIRC">WIRC (Western India Regional Council)</option>
                  <option value="SIRC">SIRC (Southern India Regional Council)</option>
                  <option value="EIRC">EIRC (Eastern India Regional Council)</option>
                  <option value="CIRC">CIRC (Central India Regional Council)</option>
                  <option value="BAR_COUNCIL">State Bar Council of India</option>
                  <option value="OTHER">Other Statutory Council</option>
                </select>
              </div>

              {/* GSTIN */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  GSTIN (Goods &amp; Services Tax ID)
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 06AAAAA0000A1Z5"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 font-mono outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Masked PAN */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Permanent Account Number (Masked Display)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={panMasked}
                  onChange={(e) => setPanMasked(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCDE****F"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 font-mono outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Income Tax Practitioner / CITR */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  CITR / Income-Tax Practitioner No.
                </label>
                <input
                  type="text"
                  value={citrNumber}
                  onChange={(e) => setCitrNumber(e.target.value)}
                  placeholder="e.g. ITP/GGM/2022"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* UDIN & Aadhaar Seeding */}
              <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={udinEnabled}
                    onChange={(e) => setUdinEnabled(e.target.checked)}
                    className="rounded text-[#1E5BFF]"
                  />
                  <span>UDIN (Unique Document Identification Number) Active for All Certifications</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={aadhaarSeeded}
                    onChange={(e) => setAadhaarSeeded(e.target.checked)}
                    className="rounded text-[#1E5BFF]"
                  />
                  <span>Aadhaar Seeding Complete for Statutory UDIN Generation</span>
                </label>
              </div>

              {/* PF / ESIC, Shop Est & Udyam */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  PF &amp; ESIC Establishment Code
                </label>
                <input
                  type="text"
                  value={pfEsicRegistration}
                  onChange={(e) => setPfEsicRegistration(e.target.value)}
                  placeholder="e.g. DL/CPM/00124"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Shop &amp; Establishment License No.
                </label>
                <input
                  type="text"
                  value={shopEstLicense}
                  onChange={(e) => setShopEstLicense(e.target.value)}
                  placeholder="e.g. HR/GGM/SE/2021/8412"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  MSME / Udyam Registration No.
                </label>
                <input
                  type="text"
                  value={udyamNumber}
                  onChange={(e) => setUdyamNumber(e.target.value)}
                  placeholder="e.g. UDYAM-HR-04-0012345"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 font-mono outline-none focus:border-[#1E5BFF]"
                />
              </div>

              {/* Official Empanelments */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Institutional &amp; PSU Empanelments (Comma separated)
                </label>
                <input
                  type="text"
                  value={empanelments}
                  onChange={(e) => setEmpanelments(e.target.value)}
                  placeholder="e.g. SBI Concurrent Auditor, CVC Empaneled, IBBI Insolvency Professional, PNB Statutory Branch Auditor"
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-900 outline-none focus:border-[#1E5BFF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: Document Vault & Compliance Verification                   */}
        {/* ================================================================ */}
        {activeTab === "vault" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-[#0A1F66]">
                  4. Secure Compliance Document Vault
                </h2>
                <p className="text-xs text-slate-500">
                  Upload and maintain official verification documents (COP, ICAI card, GST certificate, PAN, Udyam).
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Encrypted Cloud Vault</span>
              </div>
            </div>

            {/* Upload New Document Box */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#1E5BFF]" />
                <span>Upload New Compliance Document</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="e.g. COP Renewal 2026-27"
                    className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Document Classification
                  </label>
                  <select
                    value={newDocKind}
                    onChange={(e) => setNewDocKind(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-900 outline-none"
                  >
                    <option value="COP_CERTIFICATE">COP Certificate (Practice License)</option>
                    <option value="MEMBERSHIP_CARD">ICAI / Bar Council Membership Card</option>
                    <option value="GST_CERTIFICATE">GST Registration Certificate (REG-06)</option>
                    <option value="PAN_CARD">Permanent Account Number (PAN) Card</option>
                    <option value="UDYAM_CERTIFICATE">MSME / Udyam Certificate</option>
                    <option value="OTHER">Other Empanelment / Statutory Record</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Document Validity / Expiry Date
                  </label>
                  <input
                    type="text"
                    value={newDocExpiry}
                    onChange={(e) => setNewDocExpiry(e.target.value)}
                    placeholder="e.g. 31/03/2027 or N/A"
                    className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <input
                  type="file"
                  ref={docFileInputRef}
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadDocument(file);
                  }}
                />

                <button
                  type="button"
                  disabled={uploadingDoc}
                  onClick={() => docFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F66] hover:bg-[#1E5BFF] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  {uploadingDoc ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Upload className="w-4 h-4 text-white" />
                  )}
                  <span>Select &amp; Upload Document (PDF / Image)</span>
                </button>
              </div>
            </div>

            {/* Document Records Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Uploaded Vault Documents ({documents.length})
              </h3>

              {documents.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-1">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700">No compliance documents uploaded yet.</p>
                  <p>Upload your Certificate of Practice (COP) or ICAI card to expedite directory verification.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {documents.map((doc) => (
                    <div
                      key={doc._id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E5BFF] flex items-center justify-center shrink-0 border border-blue-100 font-bold">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">
                            {doc.title}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {doc.kind.replace(/_/g, " ")} • {doc.expiryDate ? `Exp: ${doc.expiryDate}` : "Active"}
                          </p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {doc.verifiedStatus || "VERIFIED"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={doc.fileUrl}
                          target="_blank"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#1E5BFF] text-xs transition cursor-pointer"
                          title="View / Download"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc._id)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs transition cursor-pointer"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Sticky Action Footer Bar                                           */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>All statutory changes are time-stamped and logged for compliance audit.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {profile?.slug && (
              <Link
                href={`/professionals/${profile.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <span>Preview as Client</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => handleSaveAll()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#0A1F66] hover:bg-[#1E5BFF] text-white text-xs font-black shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Save className="w-4 h-4 text-white" />
              )}
              <span>Save &amp; Publish Profile</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
