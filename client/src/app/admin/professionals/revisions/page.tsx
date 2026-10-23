"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  User,
  AlertCircle,
} from "lucide-react";

export default function AdminRevisionsQueuePage() {
  const [revisions, setRevisions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  const fetchRevisions = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/professionals/admin/revisions");
      if (res.data && res.data.data) {
        setRevisions(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load revisions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      await axiosInstance.patch(`/professionals/admin/revisions/${id}/approve`);
      await fetchRevisions();
    } catch (err) {
      console.error("Approve revision failed:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      await axiosInstance.patch(`/professionals/admin/revisions/${id}/reject`, {
        reason: rejectReason || "Declined by compliance administrator.",
      });
      setRejectingId(null);
      setRejectReason("");
      await fetchRevisions();
    } catch (err) {
      console.error("Reject revision failed:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

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
            Identity &amp; Statutory Revisions Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit proposed changes to legal names, professional qualifications, and regulatory COP licenses.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>{revisions.length} Pending Audit Reviews</span>
        </div>
      </div>

      {/* Revisions List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : revisions.length > 0 ? (
        <div className="space-y-6">
          {revisions.map((rev) => {
            const p = rev.professionalId || {};
            const changes = rev.changes || {};

            return (
              <div
                key={rev._id}
                className="rounded-3xl bg-white border border-[#DCE5F5] p-6 shadow-2xs space-y-5"
              >
                {/* Revision Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0A1F66] text-white flex items-center justify-center font-bold text-sm">
                      {p.fullName ? p.fullName.charAt(0) : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        {p.fullName || "Practitioner"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Requested by: {rev.requestedBy?.email || "Practitioner"} •{" "}
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {rev.changes?.reason && (
                    <div className="text-xs font-medium bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-slate-600 max-w-sm">
                      <span className="font-bold text-slate-800">Reason: </span>
                      {rev.changes.reason}
                    </div>
                  )}
                </div>

                {/* Side-by-Side Diffs Comparison */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                    Side-by-Side Field Changes
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Current Live State */}
                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Current Live State
                      </span>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Full Name:</span>
                          <span className="font-semibold text-slate-700">{p.fullName || "—"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Qualification:</span>
                          <span className="font-semibold text-slate-700">{p.qualification || "—"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Registration Body:</span>
                          <span className="font-semibold text-slate-700">{p.registrationBody || "—"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Registration / COP No:</span>
                          <span className="font-mono font-semibold text-slate-700">{p.registrationNumber || "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Proposed New Values */}
                    <div className="rounded-2xl bg-blue-50/60 border border-blue-200 p-4 space-y-3">
                      <span className="text-xs font-bold text-[#1E5BFF] uppercase tracking-wider block">
                        Proposed New Values
                      </span>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Full Name:</span>
                          <span className={`font-semibold ${changes.fullName ? "text-[#1E5BFF] font-bold" : "text-slate-700"}`}>
                            {changes.fullName || p.fullName || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Qualification:</span>
                          <span className={`font-semibold ${changes.qualification ? "text-[#1E5BFF] font-bold" : "text-slate-700"}`}>
                            {changes.qualification || p.qualification || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Registration Body:</span>
                          <span className={`font-semibold ${changes.registrationBody ? "text-[#1E5BFF] font-bold" : "text-slate-700"}`}>
                            {changes.registrationBody || p.registrationBody || "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Registration / COP No:</span>
                          <span className={`font-mono font-semibold ${changes.registrationNumber ? "text-[#1E5BFF] font-bold" : "text-slate-700"}`}>
                            {changes.registrationNumber || p.registrationNumber || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reject Input Field if clicked */}
                {rejectingId === rev._id && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                    <label className="block text-xs font-bold text-rose-800">
                      Reason for Rejection (sent to professional):
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. ICAI Membership number could not be verified on the portal"
                      className="w-full p-2.5 rounded-xl border border-rose-200 bg-white text-xs outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setRejectingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-rose-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={actionLoadingId === rev._id}
                        onClick={() => handleReject(rev._id)}
                        className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                {rejectingId !== rev._id && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setRejectingId(rev._id)}
                      className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reject Revision
                    </button>

                    <button
                      type="button"
                      disabled={actionLoadingId === rev._id}
                      onClick={() => handleApprove(rev._id)}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      {actionLoadingId === rev._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Approve &amp; Update Live Profile</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-white border border-dashed border-slate-200">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">All Revisions Cleared</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            There are currently no pending identity or statutory change requests awaiting audit review.
          </p>
        </div>
      )}
    </div>
  );
}
