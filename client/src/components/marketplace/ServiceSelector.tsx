"use client";

import React, { useState, useEffect } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import { Plus, Check, Globe, Building2, Loader2, X } from "lucide-react";

interface ServiceItem {
  _id: string;
  name: string;
  size: string;
  price: number;
  description?: string;
  isGlobal: boolean;
}

interface ServiceSelectorProps {
  selectedServiceIds: string[];
  onChange: (ids: string[]) => void;
}

export default function ServiceSelector({
  selectedServiceIds,
  onChange,
}: ServiceSelectorProps) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceSize, setNewServiceSize] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await marketplaceApi.getVendorServices();
      setServices(data || []);
    } catch (err: any) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      onChange(selectedServiceIds.filter((sId) => sId !== id));
    } else {
      onChange([...selectedServiceIds, id]);
    }
  };

  const handleCreateService = async (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e && "preventDefault" in e) e.preventDefault();
    if (!newServiceName.trim() || !newServiceSize.trim() || !newServicePrice) {
      setCreateError("Name, size, and price are required");
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      const created = await marketplaceApi.createVendorService({
        name: newServiceName.trim(),
        size: newServiceSize.trim(),
        price: Number(newServicePrice),
        description: newServiceDesc.trim() || undefined,
      });

      // Update state and automatically select the newly created service
      setServices((prev) => [created, ...prev]);
      onChange([...selectedServiceIds, created._id]);

      // Reset form and close modal
      setNewServiceName("");
      setNewServiceSize("");
      setNewServicePrice("");
      setNewServiceDesc("");
      setShowCreateModal(false);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create service");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Select Included Coworking Services
          </p>
          <p className="text-xs text-slate-500">
            Choose from global offerings or your own priced desk/cabin packages.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-[#1E5BFF] hover:bg-blue-100 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Custom Service
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-xs text-slate-500 mb-2">
            No services registered yet. Create your first customized service option!
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-[#0A1F66] text-white rounded-lg"
          >
            Create Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
          {services.map((svc) => {
            const isSelected = selectedServiceIds.includes(svc._id);
            return (
              <div
                key={svc._id}
                onClick={() => toggleService(svc._id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                  isSelected
                    ? "border-[#1E5BFF] bg-blue-50/40 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {svc.name}
                    </span>
                    {svc.isGlobal ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        <Globe className="w-2.5 h-2.5" /> Global
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        <Building2 className="w-2.5 h-2.5" /> Yours
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded">
                      Size: {svc.size}
                    </span>
                    <span className="font-bold text-[#1E5BFF]">
                      ₹{svc.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {svc.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {svc.description}
                    </p>
                  )}
                </div>

                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#1E5BFF] text-white"
                      : "border border-slate-300 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inline Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add Custom Coworking Service
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service / Plan Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Executive Private Suite"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateService();
                    }
                  }}
                  className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Size / Capacity *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6-Seater, 1 Desk"
                    value={newServiceSize}
                    onChange={(e) => setNewServiceSize(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateService();
                      }
                    }}
                    className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 25000"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateService();
                      }
                    }}
                    className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="e.g. Ergonomic seating, acoustic isolation, dedicated high-speed LAN"
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full text-sm px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                />
              </div>

              {createError && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {createError}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={creating}
                  onClick={() => handleCreateService()}
                  className="px-4 py-2 text-xs font-semibold bg-[#1E5BFF] text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save & Select
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
