"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Ban,
  ExternalLink,
  Loader2,
  Search,
  User,
  Filter,
  Eye,
} from "lucide-react";
import ProfessionalDetailsModal from "@/modules/admin/components/professionals/ProfessionalDetailsModal";

export default function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any | null>(null);

  const fetchProfessionals = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/professionals/admin/all");
      if (res.data && res.data.data) {
        setProfessionals(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load admin professionals:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      await axiosInstance.patch(`/professionals/admin/${id}/approve`);
      await fetchProfessionals();
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleVerify = async (id: string, status: "VERIFIED" | "REJECTED") => {
    setActionLoadingId(id);
    try {
      await axiosInstance.patch(`/professionals/admin/${id}/verify`, { status });
      await fetchProfessionals();
    } catch (err) {
      console.error("Verify failed:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSuspend = async (id: string) => {
    setActionLoadingId(id);
    try {
      await axiosInstance.patch(`/professionals/admin/${id}/suspend`, { reason: "Admin policy enforcement" });
      await fetchProfessionals();
    } catch (err) {
      console.error("Suspend failed:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = professionals.filter((p) => {
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Professionals Network Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Governance, registration auditing, and listing lifecycle management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/professionals/revisions"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-[#1E5BFF] hover:bg-blue-100 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Review Queue &amp; Diffs</span>
          </Link>

          <Link
            href="/admin/professionals/enquiries"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
          >
            <span>All Leads</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, city, registration..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#1E5BFF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="DRAFT">Draft</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table of Professionals */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Professional</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Statutory Registration</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((pro) => (
                  <tr key={pro._id} className="hover:bg-blue-50/35 transition-colors duration-200 group/row">
                    {/* Professional Name + Photo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {pro.photoUrl ? (
                            <Image
                              src={pro.photoUrl}
                              alt={pro.fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0A1F66] text-white font-bold text-xs">
                              {pro.fullName ? pro.fullName.charAt(0) : <User className="w-4 h-4" />}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">
                            {pro.fullName}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {pro.qualification || "Practitioner"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {pro.categoryId?.label || pro.categoryId?.name || "Professional"}
                    </td>

                    {/* Registration */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">
                          {pro.registrationBody || "Unregistered"}
                        </span>
                        {pro.registrationNumber && (
                          <span className="font-mono text-[10px] text-slate-400">
                            #{pro.registrationNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {pro.city}{pro.state ? `, ${pro.state}` : ""}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          pro.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : pro.status === "PENDING_REVIEW"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : pro.status === "SUSPENDED"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {pro.status}
                      </span>
                    </td>

                    {/* Verification Pill */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pro.verificationStatus === "VERIFIED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{pro.verificationStatus}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details — Strict i-VANTAGE Brand Gradient Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedProfessional(pro)}
                          className="group relative inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-bold text-white rounded-full bg-gradient-to-r from-[#0A1F66] via-[#1E5BFF] to-[#0A1F66] bg-[length:200%_100%] hover:bg-right shadow-[0_2px_10px_rgba(10,31,102,0.3)] hover:shadow-[0_4px_16px_rgba(30,91,255,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 border border-blue-400/30 cursor-pointer overflow-hidden shrink-0"
                          title={`View complete details of ${pro.fullName}`}
                        >
                          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                          <Eye className="relative w-3.5 h-3.5 text-blue-200 group-hover:text-white transition-colors shrink-0" />
                          <span className="relative tracking-tight">View Details</span>
                        </button>

                        {pro.status !== "PUBLISHED" && (
                          <button
                            type="button"
                            disabled={actionLoadingId === pro._id}
                            onClick={() => handleApprove(pro._id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            Approve
                          </button>
                        )}

                        {pro.verificationStatus !== "VERIFIED" && (
                          <button
                            type="button"
                            disabled={actionLoadingId === pro._id}
                            onClick={() => handleVerify(pro._id, "VERIFIED")}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            Verify
                          </button>
                        )}

                        {pro.status === "PUBLISHED" && (
                          <button
                            type="button"
                            disabled={actionLoadingId === pro._id}
                            onClick={() => handleSuspend(pro._id)}
                            className="px-2 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold cursor-pointer transition-colors"
                          >
                            Suspend
                          </button>
                        )}

                        {pro.slug && (
                          <Link
                            href={`/professionals/${pro.slug}`}
                            target="_blank"
                            className="p-1 text-slate-400 hover:text-[#1E5BFF] transition-colors"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <User className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No professionals found</p>
          </div>
        )}
      </div>

      {/* Professional Read-Only Details Dossier Modal */}
      <ProfessionalDetailsModal
        isOpen={Boolean(selectedProfessional)}
        professional={selectedProfessional}
        onClose={() => setSelectedProfessional(null)}
      />
    </div>
  );
}
