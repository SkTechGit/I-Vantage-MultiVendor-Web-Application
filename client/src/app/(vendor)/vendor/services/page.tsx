"use client";

import React, { useState, useEffect } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Globe,
  Building2,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";

interface ServiceItem {
  _id: string;
  name: string;
  size: string;
  price: number;
  description?: string;
  isGlobal: boolean;
  isActive: boolean;
}

export default function VendorServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await marketplaceApi.getVendorServices();
      setServices(data || []);
    } catch (err: any) {
      console.warn("Vendor services note:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setName("");
    setSize("");
    setPrice("");
    setDescription("");
    setErrorMsg(null);
    setShowModal(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setName(service.name);
    setSize(service.size);
    setPrice(String(service.price));
    setDescription(service.description || "");
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !size.trim() || !price) {
      setErrorMsg("Name, size, and price are required");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingService) {
        await marketplaceApi.updateVendorService(editingService._id, {
          name: name.trim(),
          size: size.trim(),
          price: Number(price),
          description: description.trim() || undefined,
        });
      } else {
        await marketplaceApi.createVendorService({
          name: name.trim(),
          size: size.trim(),
          price: Number(price),
          description: description.trim() || undefined,
        });
      }

      setShowModal(false);
      fetchServices();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this service?")) return;
    try {
      await marketplaceApi.deleteVendorService(id);
      fetchServices();
    } catch (err: any) {
      alert(err.message || "Failed to delete service");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0A1F66]">
            Services & Desk Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your priced coworking offerings (cabin sizes, hot desks, event spaces) or choose from platform global offerings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E5BFF] text-white text-xs font-bold hover:bg-blue-700 transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Custom Service
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading services catalog...
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">No services found</p>
          <button
            onClick={openCreateModal}
            className="mt-3 px-4 py-2 bg-[#0A1F66] text-white text-xs font-bold rounded-xl"
          >
            Create Your First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc) => (
            <div
              key={svc._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {svc.isGlobal ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      <Globe className="w-3 h-3" /> Platform Global
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      <Building2 className="w-3 h-3" /> Your Custom Service
                    </span>
                  )}

                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    Size: {svc.size}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900">{svc.name}</h3>
                  {svc.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {svc.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Standard Price:</span>
                  <span className="text-lg font-extrabold text-[#0A1F66]">
                    ₹{svc.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {!svc.isGlobal && (
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(svc)}
                    className="p-2 text-slate-500 hover:text-[#1E5BFF] hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(svc._id)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Deactivate
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingService ? "Edit Custom Service" : "New Custom Coworking Service"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service / Plan Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dedicated 8-Seater Suite"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 border rounded-xl outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Size / Pax *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8-Seater, 1 Desk"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border rounded-xl outline-none"
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
                    placeholder="e.g. 35000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border rounded-xl outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key features included in this plan..."
                  className="w-full text-sm px-3.5 py-2 border rounded-xl outline-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {errorMsg}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold bg-[#1E5BFF] text-white rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingService ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
