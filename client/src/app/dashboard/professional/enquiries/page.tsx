"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Video,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  User,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { professionalsApi } from "@/lib/professionals.api";

export default function ProfessionalEnquiriesInbox() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchEnquiries = async (status?: string) => {
    setIsLoading(true);
    try {
      const res = await professionalsApi.getMyEnquiries(status === "ALL" ? undefined : status).catch(() => []);
      const list = Array.isArray(res) ? res : res?.data || [];
      setEnquiries(list);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(activeStatus);
  }, [activeStatus]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await professionalsApi.updateMyEnquiry(id, { status: newStatus });
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this client enquiry from the database?")) return;
    try {
      await professionalsApi.deleteMyEnquiry(id);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Failed to delete enquiry:", err);
      alert("Failed to delete enquiry from database.");
    }
  };

  const statusList = ["ALL", "NEW", "CONTACTED", "SCHEDULED", "COMPLETED", "DECLINED"];

  return (
    <div className="space-y-6">
      {/* Header & Status Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0A1F66]">
            Client Consultation Inquiries
          </h1>
          <p className="text-xs text-slate-500">
            Real-time leads submitted by verified clients through the I-VANTAGE platform.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold overflow-x-auto self-start sm:self-auto scrollbar-none no-scrollbar">
          {statusList.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeStatus === st
                  ? "bg-white text-[#0A1F66] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st === "ALL" ? "All Leads" : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : enquiries.length > 0 ? (
        <div className="space-y-4">
          {enquiries.map((enq) => {
            const cleanPhone = enq.clientPhone ? enq.clientPhone.replace(/\D/g, "") : "";
            return (
              <div
                key={enq._id}
                className="rounded-3xl bg-white border border-[#DCE5F5] p-5 sm:p-6 shadow-2xs space-y-4 hover:border-blue-200 transition-colors"
              >
                {/* Header: Reference + Date + Status Select */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {enq.referenceNumber || "ENQ-REF"}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-400">
                      {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Status Dropdown & Actions */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    <select
                      value={enq.status}
                      disabled={updatingId === enq._id}
                      onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="NEW">New Lead</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="DECLINED">Declined</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteEnquiry(enq._id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body: Client Details & Request */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Client Info (Span 5) */}
                  <div className="md:col-span-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E5BFF] flex items-center justify-center font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#0A1F66]">
                          {enq.clientName}
                        </h3>
                        {enq.clientCompany && (
                          <p className="text-xs text-slate-500 font-medium">
                            {enq.clientCompany}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 pl-10">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${enq.clientEmail}`} className="hover:text-[#1E5BFF]">
                          {enq.clientEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`tel:${cleanPhone}`} className="hover:text-[#1E5BFF]">
                          {enq.clientPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Requirements & Timing (Span 7) */}
                  <div className="md:col-span-7 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {enq.serviceTitle && (
                        <span className="font-bold text-[#1E5BFF] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                          {enq.serviceTitle}
                        </span>
                      )}
                      <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {enq.mode === "ONLINE"
                          ? "Video Consultation"
                          : enq.mode === "IN_PERSON"
                          ? "In-Person Boardroom"
                          : "Audio Call"}
                      </span>
                      {enq.preferredDate && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{enq.preferredDate}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      &ldquo;{enq.message}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Footer: Quick Connect Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Hello ${enq.clientName}, I am following up on your consultation request for ${enq.serviceTitle || "professional advisory"} via I-VANTAGE.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-2xs"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}

                    {cleanPhone && (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-bold border border-slate-200 hover:bg-white transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>Call</span>
                      </a>
                    )}

                    <a
                      href={`mailto:${enq.clientEmail}?subject=${encodeURIComponent(
                        `Regarding your consultation inquiry: ${enq.serviceTitle || "I-VANTAGE"}`
                      )}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-bold border border-slate-200 hover:bg-white transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl bg-white border border-dashed border-slate-200">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">No consultation leads found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {activeStatus === "ALL"
              ? "When clients submit consultation requests for your practice, they will appear here in real time."
              : `No leads with status '${activeStatus}' found.`}
          </p>
        </div>
      )}
    </div>
  );
}
