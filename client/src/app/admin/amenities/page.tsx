"use client";

import React, { useState, useEffect, useCallback } from "react";
import { marketplaceApi } from "@/lib/marketplace.api";
import {
  Sparkles,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Loader2,
  X,
  Layers,
} from "lucide-react";

interface AmenityItem {
  _id: string;
  name: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminAmenitiesPage() {
  const [amenities, setAmenities] = useState<AmenityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AmenityItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAmenities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await marketplaceApi.getAdminAmenities();
      setAmenities(data || []);
    } catch (err: any) {
      console.error("Failed to load amenities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    marketplaceApi.getAdminAmenities()
      .then((data) => {
        if (!ignore) setAmenities(data || []);
      })
      .catch((err: unknown) => {
        if (!ignore) {
          console.error("Failed to load amenities:", err);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormIcon("");
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item: AmenityItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormIcon(item.icon || "");
    setFormActive(item.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);
    try {
      if (editingItem) {
        const updated = await marketplaceApi.updateAdminAmenity(editingItem._id, {
          name: formName.trim(),
          icon: formIcon.trim() || undefined,
          isActive: formActive,
        });
        setAmenities((prev) =>
          prev.map((a) => (a._id === editingItem._id ? updated : a))
        );
      } else {
        const created = await marketplaceApi.createAdminAmenity({
          name: formName.trim(),
          icon: formIcon.trim() || undefined,
          isActive: formActive,
        });
        setAmenities((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || "Failed to save amenity");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: AmenityItem) => {
    const nextActive = !item.isActive;
    // Optimistic UI update
    setAmenities((prev) =>
      prev.map((a) => (a._id === item._id ? { ...a, isActive: nextActive } : a))
    );
    try {
      await marketplaceApi.updateAdminAmenity(item._id, {
        isActive: nextActive,
      });
    } catch (err: any) {
      // Revert on error
      setAmenities((prev) =>
        prev.map((a) => (a._id === item._id ? { ...a, isActive: item.isActive } : a))
      );
      alert("Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this amenity?")) return;
    setDeletingId(id);
    try {
      await marketplaceApi.deleteAdminAmenity(id);
      setAmenities((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      alert("Failed to delete amenity");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = amenities.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D99000] text-white uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Platform Taxonomy
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Amenities Master Data
          </h1>
          <p className="text-xs md:text-sm text-blue-100 mt-1 max-w-xl">
            Configure global amenities selectable by verified workspace partners when listing properties.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0A1F66] hover:bg-blue-50 font-bold text-xs transition shadow-md self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#1E5BFF]" />
          <span>Add Amenity</span>
        </button>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search amenities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#1E5BFF] focus:bg-white transition"
            />
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Total: <strong className="text-slate-900">{filtered.length}</strong>
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E5BFF]" />
            <p className="text-xs font-semibold">Loading amenities...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            No amenities found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Amenity Name</th>
                  <th className="py-3.5 px-4">Icon Key</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-[#1E5BFF]">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {item.icon || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {item.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#1E5BFF] transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
                          title="Delete"
                        >
                          {deletingId === item._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create or Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1F66]">
                {editingItem ? "Edit Amenity" : "Create New Amenity"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Amenity Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% Power Backup, High-Speed Wi-Fi"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#1E5BFF] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Icon Identifier (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. wifi, zap, shield, coffee"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-[#1E5BFF] focus:bg-white transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="formActive"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded text-[#1E5BFF] focus:ring-blue-100"
                />
                <label htmlFor="formActive" className="text-xs font-semibold text-slate-700">
                  Active (Visible to vendors during property listing)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0A1F66] hover:bg-[#1E5BFF] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Save Amenity</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
