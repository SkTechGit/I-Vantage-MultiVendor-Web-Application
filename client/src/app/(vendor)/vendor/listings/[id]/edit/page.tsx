"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { marketplaceApi } from "@/lib/marketplace.api";
import MediaPicker from "@/components/marketplace/MediaPicker";
import ServiceSelector from "@/components/marketplace/ServiceSelector";
import {
  Building2,
  Tag,
  Layers,
  Sparkles,
  Camera,
  IndianRupee,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";

export default function EditVendorListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isCurrentlyLive, setIsCurrentlyLive] = useState(false);

  // Categories & Amenities
  const [categories, setCategories] = useState<any[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<any[]>([]);

  // Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState<number>(1);
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [newCustomAmenity, setNewCustomAmenity] = useState("");
  const [media, setMedia] = useState<Array<{ mediaId: string; secureUrl: string; order: number }>>([]);
  const [basePrice, setBasePrice] = useState<number | "">("");
  const [pricingUnit, setPricingUnit] = useState<any>("per-month");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      marketplaceApi.getCategories(),
      marketplaceApi.getAmenities(),
      marketplaceApi.getVendorListingById(id),
    ])
      .then(([cats, amens, listing]) => {
        setCategories(cats || []);
        setAmenitiesList(amens || []);

        if (listing) {
          setTitle(listing.title || "");
          setDescription(listing.description || "");
          setCapacity(listing.capacity || 1);
          setCity(listing.location?.city || "gurugram");
          setArea(listing.location?.area || "");
          setAddress(listing.location?.address || "");
          setCategoryId(listing.categoryId?._id || listing.categoryId || "");
          setServiceIds(listing.serviceIds?.map((s: any) => s._id || s) || []);
          setAmenityIds(listing.amenityIds?.map((a: any) => a._id || a) || []);
          setCustomAmenities(listing.customAmenities || []);
          setBasePrice(listing.pricing?.basePrice || "");
          setPricingUnit(listing.pricing?.unit || "per-month");
          setIsCurrentlyLive(Boolean(listing.isLive));

          const formattedMedia = (listing.media || []).map((m: any, idx: number) => ({
            mediaId: m.mediaId?._id || m.mediaId,
            secureUrl: m.mediaId?.secureUrl || "",
            order: m.order ?? idx,
          }));
          setMedia(formattedMedia);
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || "Failed to load listing");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomAmenity.trim()) return;
    if (!customAmenities.includes(newCustomAmenity.trim())) {
      setCustomAmenities([...customAmenities, newCustomAmenity.trim()]);
    }
    setNewCustomAmenity("");
  };

  const removeCustomAmenity = (name: string) => {
    setCustomAmenities(customAmenities.filter((a) => a !== name));
  };

  const toggleAmenity = (amenId: string) => {
    if (amenityIds.includes(amenId)) {
      setAmenityIds(amenityIds.filter((aId) => aId !== amenId));
    } else {
      setAmenityIds([...amenityIds, amenId]);
    }
  };

  const handleSave = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && "preventDefault" in e) e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        location: {
          city: city.trim().toLowerCase(),
          area: area.trim(),
          address: address.trim(),
        },
        pricing: {
          basePrice: Number(basePrice),
          currency: "INR",
          unit: pricingUnit,
        },
        capacity: Number(capacity) || 1,
        serviceIds,
        amenityIds,
        customAmenities,
        media: media.map((m, idx) => ({
          mediaId: m.mediaId,
          order: idx,
        })),
      };

      await marketplaceApi.updateVendorListing(id, payload);
      router.push("/vendor/listings");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update listing");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Loading listing specifications...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Listings
      </button>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#0A1F66]">
          Edit Property: {title}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Update property descriptions, seating capacity, services, pricing, or photos.
        </p>
      </div>

      {/* NON-NEGOTIABLE RULE 4 WARNING */}
      {isCurrentlyLive && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-extrabold text-sm text-amber-900">
              Notice: Re-Review Will Be Triggered on Live Listing Edit
            </p>
            <p className="text-amber-800 leading-relaxed">
              This listing is currently <strong>Live on the public marketplace</strong>. Modifying and saving changes will automatically revert the listing to <strong>Pending Review</strong> (`isLive: false`) until SuperAdmin verifies and re-approves your edits.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="space-y-8 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs">
        {/* Section 1: Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b pb-2">
            <Building2 className="w-4 h-4 text-[#1E5BFF]" /> Basic Details & Location
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Property Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area / Micro-Market *
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full text-sm px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
              required
            />
          </div>
        </div>

        {/* Section 2: Category */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b pb-2">
            <Tag className="w-4 h-4 text-[#1E5BFF]" /> Category
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = categoryId === cat._id;
              return (
                <div
                  key={cat._id}
                  onClick={() => setCategoryId(cat._id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition text-xs font-bold flex items-center justify-between ${
                    isSelected
                      ? "border-[#1E5BFF] bg-blue-50 text-[#1E5BFF]"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span>{cat.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Services */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b pb-2">
            <Layers className="w-4 h-4 text-[#1E5BFF]" /> Services & Desk Options
          </h3>
          <ServiceSelector
            selectedServiceIds={serviceIds}
            onChange={setServiceIds}
          />
        </div>

        {/* Section 4: Amenities */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b pb-2">
            <Sparkles className="w-4 h-4 text-[#1E5BFF]" /> Amenities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {amenitiesList.map((amen) => {
              const isSelected = amenityIds.includes(amen._id);
              return (
                <div
                  key={amen._id}
                  onClick={() => toggleAmenity(amen._id)}
                  className={`p-2.5 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2 ${
                    isSelected
                      ? "border-[#1E5BFF] bg-blue-50 text-[#1E5BFF]"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="truncate">{amen.name}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex gap-2">
            <input
              type="text"
              placeholder="Add custom amenity..."
              value={newCustomAmenity}
              onChange={(e) => setNewCustomAmenity(e.target.value)}
              className="flex-1 text-xs px-3 py-1.5 border rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddCustomAmenity}
              className="px-3 py-1.5 text-xs bg-slate-800 text-white rounded-lg"
            >
              Add
            </button>
          </div>
          {customAmenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {customAmenities.map((ca) => (
                <span
                  key={ca}
                  className="px-2.5 py-0.5 rounded-full text-xs bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1"
                >
                  {ca}
                  <button type="button" onClick={() => removeCustomAmenity(ca)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Media */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b pb-2">
            <Camera className="w-4 h-4 text-[#1E5BFF]" /> Media Assets
          </h3>
          <MediaPicker
            selectedMedia={media}
            onChange={setMedia}
            maxFiles={12}
          />
        </div>

        {/* Section 6: Pricing */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b pb-2">
            <IndianRupee className="w-4 h-4 text-[#1E5BFF]" /> Pricing
          </h3>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Price (INR) *
              </label>
              <input
                type="number"
                min="1"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full text-sm font-bold px-3 py-2 border rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit *
              </label>
              <select
                value={pricingUnit}
                onChange={(e) => setPricingUnit(e.target.value as any)}
                className="w-full text-xs font-semibold px-3 py-2.5 border rounded-xl bg-white"
              >
                <option value="per-month">Per Month</option>
                <option value="per-day">Per Day</option>
                <option value="per-hour">Per Hour</option>
                <option value="per-seat">Per Seat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.push("/vendor/listings")}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-6 py-2.5 text-xs font-bold bg-[#1E5BFF] text-white hover:bg-blue-700 transition rounded-xl flex items-center gap-2 shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>Save Listing Updates</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
