"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Video,
  Building,
  Edit2,
  X,
} from "lucide-react";
import { professionalsApi, ProfessionalProfileItem, ServiceItem } from "@/lib/professionals.api";

export default function ProfessionalServicesManager() {
  const [profile, setProfile] = useState<ProfessionalProfileItem | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Service form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<"ONLINE" | "IN_PERSON" | "ONLINE_IN_PERSON">("ONLINE");
  const [priceType, setPriceType] = useState<"FROM" | "QUOTE">("FROM");
  const [priceInr, setPriceInr] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await professionalsApi.getMyProfile().catch(() => null);
        const p = res?.profile || res?.data || res;
        if (p && (p._id || p.fullName)) {
          setProfile(p);
          setServices(Array.isArray(p.services) ? p.services : []);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMode("ONLINE");
    setPriceType("FROM");
    setPriceInr("");
    setShowAddForm(false);
    setEditingIndex(null);
  };

  const startEdit = (idx: number) => {
    const s = services[idx];
    if (!s) return;
    setTitle(s.title || "");
    setDescription(s.description || "");
    setMode(s.mode || "ONLINE");
    setPriceType(s.priceType || "FROM");
    setPriceInr(s.priceInr ? String(s.priceInr) : "");
    setEditingIndex(idx);
    setShowAddForm(true);
  };

  const handleSaveServiceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let updatedList: ServiceItem[] = [];

    if (editingIndex !== null) {
      // Editing existing
      updatedList = services.map((s, idx) => {
        if (idx === editingIndex) {
          return {
            ...s,
            title: title.trim(),
            description: description.trim(),
            mode,
            priceType,
            priceInr: priceType === "FROM" && priceInr ? Number(priceInr) : null,
          };
        }
        return s;
      });
    } else {
      // Creating new
      const newService: ServiceItem = {
        _id: `srv_${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        mode,
        priceType,
        priceInr: priceType === "FROM" && priceInr ? Number(priceInr) : null,
        isActive: true,
      };
      updatedList = [...services, newService];
    }

    setServices(updatedList);
    resetForm();

    // Auto-persist directly to database
    await persistServices(updatedList);
  };

  const handleDeleteService = async (index: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const next = [...services];
    next.splice(index, 1);
    setServices(next);
    await persistServices(next);
  };

  const persistServices = async (serviceItems: ServiceItem[]) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = {
        services: serviceItems.map((s, idx) => ({
          title: s.title,
          description: s.description,
          mode: s.mode,
          priceType: s.priceType,
          priceInr: s.priceInr,
          isActive: s.isActive !== false,
          sortOrder: idx + 1,
        })),
      };

      const res = await professionalsApi.updateMyContent(payload);
      const updatedProfile = res?.profile || res?.data || res;
      if (updatedProfile) {
        setProfile(updatedProfile);
        setServices(updatedProfile.services || []);
        setMessage({ type: "success", text: "Services synchronized and saved to database successfully!" });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("professional-profile-updated", { detail: updatedProfile }));
        }
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to save services.",
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
            Services &amp; Advisory Fees
          </h1>
          <p className="text-xs text-slate-500">
            Configure specific services you offer, consultation formats, and baseline pricing directly stored in database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!showAddForm && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A1F66] hover:bg-[#1E5BFF] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => persistServices(services)}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Sync with DB</span>
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

      {/* Add / Edit Service Form */}
      {showAddForm && (
        <form onSubmit={handleSaveServiceForm} className="rounded-2xl bg-blue-50/50 border border-blue-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#0A1F66]">
              {editingIndex !== null ? "Edit Practice Service" : "Add New Practice Service"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Service Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Statutory Audit, GST Litigation, Startup Valuation"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Brief Scope &amp; Deliverables
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details on what this consultation or engagement covers..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Delivery Format
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="ONLINE">Online Video Consultation</option>
                <option value="IN_PERSON">In-Person (Office / Boardroom)</option>
                <option value="ONLINE_IN_PERSON">Hybrid (Both Online &amp; In-Person)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pricing Structure
              </label>
              <div className="flex gap-2">
                <select
                  value={priceType}
                  onChange={(e) => setPriceType(e.target.value as any)}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="FROM">Starting From (₹)</option>
                  <option value="QUOTE">Custom Quote</option>
                </select>
                {priceType === "FROM" && (
                  <input
                    type="number"
                    min="0"
                    value={priceInr}
                    onChange={(e) => setPriceInr(e.target.value)}
                    placeholder="₹ Amount"
                    className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-800 outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF] flex items-center gap-1.5"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{editingIndex !== null ? "Update & Save to DB" : "Save Service to DB"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Services List */}
      <div className="space-y-3">
        {services.length > 0 ? (
          services.map((s, idx) => (
            <div
              key={s._id || idx}
              className="flex items-start justify-between gap-4 rounded-2xl bg-white border border-[#DCE5F5] p-5 shadow-2xs hover:border-blue-200 transition-colors"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#0A1F66]">
                    {s.title}
                  </h3>
                  {s.mode === "ONLINE" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Video className="w-3 h-3" />
                      Online
                    </span>
                  )}
                  {s.mode === "IN_PERSON" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      <Building className="w-3 h-3" />
                      In-Person
                    </span>
                  )}
                  {s.mode === "ONLINE_IN_PERSON" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Hybrid
                    </span>
                  )}
                </div>

                {s.description && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.description}
                  </p>
                )}

                <div className="text-xs font-bold text-slate-500 pt-1">
                  {s.priceType === "FROM" && s.priceInr ? (
                    <span className="text-[#0A1F66]">From ₹{s.priceInr.toLocaleString("en-IN")}</span>
                  ) : (
                    <span>Custom Advisory Quote</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(idx)}
                  className="text-slate-400 hover:text-[#1E5BFF] transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                  title="Edit Service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteService(idx)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white border border-dashed border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No services added yet</p>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">Add the key advisory services you offer clients.</p>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-[#1E5BFF]"
            >
              Add First Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
