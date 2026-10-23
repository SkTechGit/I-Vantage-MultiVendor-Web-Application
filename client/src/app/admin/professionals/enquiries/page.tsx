"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import {
  Mail,
  Phone,
  Calendar,
  Clock,
  Video,
  Building,
  Loader2,
  ArrowLeft,
  User,
  ExternalLink,
} from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchEnquiries = async (status = "all") => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/professionals/admin/enquiries", {
        params: { status: status === "all" ? undefined : status, limit: 50 },
      });
      if (res.data && res.data.data) {
        setEnquiries(res.data.data);
        setTotal(res.data.meta?.total || res.data.data.length);
      }
    } catch (err) {
      console.error("Failed to load admin enquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries(statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/professionals"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Consultation Enquiries Oversight
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Platform-wide visibility into professional consultation pipelines and SLA response tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none shadow-2xs"
          >
            <option value="all">All Enquiries ({total})</option>
            <option value="new">New Leads</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Ref &amp; Date</th>
                  <th className="py-3.5 px-4">Target Professional</th>
                  <th className="py-3.5 px-4">Client Contact</th>
                  <th className="py-3.5 px-4">Format &amp; Service</th>
                  <th className="py-3.5 px-4">Message Context</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ref */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-700 font-bold block">
                        {enq.referenceNumber || "ENQ-REF"}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(enq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </td>

                    {/* Professional */}
                    <td className="py-3.5 px-4">
                      {enq.professionalId ? (
                        <Link
                          href={`/professionals/${enq.professionalId.slug}`}
                          target="_blank"
                          className="font-bold text-[#0A1F66] hover:text-[#1E5BFF] flex items-center gap-1"
                        >
                          <span>{enq.professionalId.fullName}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">
                          {enq.clientName}
                        </span>
                        {enq.clientCompany && (
                          <span className="text-[11px] text-slate-500 block">
                            {enq.clientCompany}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 block">
                          {enq.clientPhone} • {enq.clientEmail}
                        </span>
                      </div>
                    </td>

                    {/* Format */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-700 block">
                          {enq.serviceTitle || "General Advisory"}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {enq.mode === "ONLINE"
                            ? "Video Session"
                            : enq.mode === "IN_PERSON"
                            ? "Boardroom"
                            : "Audio Call"}
                          {enq.preferredDate ? ` • ${enq.preferredDate}` : ""}
                        </span>
                      </div>
                    </td>

                    {/* Message */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 line-clamp-2 leading-relaxed">
                        {enq.message}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          enq.status === "NEW"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : enq.status === "SCHEDULED" || enq.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <Mail className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No consultation enquiries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
