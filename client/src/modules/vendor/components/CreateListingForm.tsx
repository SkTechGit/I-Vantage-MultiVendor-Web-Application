"use client";

import React, { useState, useEffect } from "react";
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
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

import {
  CategoryItem,
  AmenityItem,
  MediaUploadItem,
  PricingUnit,
  LISTING_STEPS,
} from "./listing-form.types";
import StepProgressIndicator from "./StepProgressIndicator";
import ListingReviewStep from "./ListingReviewStep";

export default function CreateListingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Categories & Amenities Master Data
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<AmenityItem[]>([]);
  const [loadingTaxonomy, setLoadingTaxonomy] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState<number>(1);
  const [city, setCity] = useState("gurugram");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const [customAmenities, setCustomAmenities] = useState<string[]>([]);
  const [newCustomAmenity, setNewCustomAmenity] = useState("");

  const [media, setMedia] = useState<MediaUploadItem[]>([]);

  const [basePrice, setBasePrice] = useState<number | "">("");
  const [pricingUnit, setPricingUnit] = useState<PricingUnit>("per-month");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([marketplaceApi.getCategories(), marketplaceApi.getAmenities()])
      .then(([cats, amens]) => {
        setCategories(cats || []);
        if (cats?.length > 0) {
          setCategoryId((prev) => prev || cats[0]._id);
        }
        setAmenitiesList(amens || []);
      })
      .catch((err) => console.error("Taxonomy error:", err))
      .finally(() => setLoadingTaxonomy(false));
  }, []);

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

  const toggleAmenity = (id: string) => {
    if (amenityIds.includes(id)) {
      setAmenityIds(amenityIds.filter((aId) => aId !== id));
    } else {
      setAmenityIds([...amenityIds, id]);
    }
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!title.trim() || title.trim().length < 3) {
        setErrorMsg("Please enter a property title (at least 3 characters)");
        return false;
      }
      if (!description.trim() || description.trim().length < 10) {
        setErrorMsg("Please provide a description (at least 10 characters)");
        return false;
      }
      if (!city.trim() || !area.trim() || !address.trim()) {
        setErrorMsg("Please fill in the complete location details (city, area, address)");
        return false;
      }
    }
    if (step === 2) {
      if (!categoryId) {
        setErrorMsg("Please select a property category");
        return false;
      }
    }
    if (step === 5) {
      if (media.length === 0) {
        setErrorMsg("Please select or upload at least one image of the space");
        return false;
      }
    }
    if (step === 6) {
      if (!basePrice || Number(basePrice) <= 0) {
        setErrorMsg("Please enter a valid base price");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(LISTING_STEPS.length, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(6) || !validateStep(5) || !validateStep(1)) return;

    setSubmitting(true);
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

      await marketplaceApi.createVendorListing(payload);
      router.push("/vendor/listings?created=true");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message || "Failed to submit property listing";
      setErrorMsg(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D99000] text-white uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Multi-Step Listing Workflow
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            List Your Coworking Space
          </h2>
          <p className="text-sm text-blue-100 mt-2">
            Configure full property specifications, add custom services, choose images from your library, and submit for SuperAdmin verification.
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <StepProgressIndicator
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
      />

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step Forms */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-slate-200">
        {/* Step 1: Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#1E5BFF]" /> Property Details &amp; Location
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Provide clear titles and accurate location so prospective clients can easily discover your center.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Property Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. i-Vantage Horizon Business Park - Executive Suites"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your workspace environment, amenities, acoustics, surrounding commercial hub, and connectivity..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none bg-white"
                  >
                    <option value="gurugram">Gurugram</option>
                    <option value="delhi">Delhi</option>
                    <option value="noida">Noida</option>
                    <option value="bengaluru">Bengaluru</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="pune">Pune</option>
                    <option value="hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Area / Micro-Market *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Golf Course Road, Sector 44"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Overall Seating Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 50"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Complete Street Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5th Floor, Tower B, Horizon Center, DLF Phase 5"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-sm px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Category */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#1E5BFF]" /> Select Workspace Category
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose the primary category that classifies this specific coworking listing.
              </p>
            </div>

            {loadingTaxonomy ? (
              <div className="flex items-center justify-center py-10 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading categories...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const isSelected = categoryId === cat._id;
                  return (
                    <div
                      key={cat._id}
                      onClick={() => setCategoryId(cat._id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-[#1E5BFF] bg-blue-50/50 shadow-md ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-[#1E5BFF] text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Tag className="w-5 h-5" />
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            isSelected
                              ? "bg-[#1E5BFF] text-white font-bold"
                              : "border border-slate-300"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">
                          {cat.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Standard coworking classification
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Services */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#1E5BFF]" /> Services &amp; Package Customization
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select from global services or define your own custom priced options (e.g. 4-Seater Cabin, Day Pass, Hot Desk).
              </p>
            </div>

            <ServiceSelector
              selectedServiceIds={serviceIds}
              onChange={setServiceIds}
            />
          </div>
        )}

        {/* Step 4: Amenities */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1E5BFF]" /> Space Amenities &amp; Perks
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select from the platform master amenities list and add any center-specific perks.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Master Amenities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {amenitiesList.map((amen) => {
                  const isSelected = amenityIds.includes(amen._id);
                  return (
                    <div
                      key={amen._id}
                      onClick={() => toggleAmenity(amen._id)}
                      className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? "border-[#1E5BFF] bg-blue-50 text-[#1E5BFF]"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isSelected
                            ? "bg-[#1E5BFF] text-white"
                            : "border border-slate-300"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="truncate">{amen.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Custom Amenities */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Additional Custom Amenities
                </h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="e.g. Free Podcasting Studio, Pet Friendly, EV Charging"
                    value={newCustomAmenity}
                    onChange={(e) => setNewCustomAmenity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomAmenity(e);
                      }
                    }}
                    className="flex-1 text-sm px-3.5 py-2 border rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="px-4 py-2 bg-[#0A1F66] text-white text-xs font-bold rounded-xl hover:bg-blue-950 transition"
                  >
                    Add
                  </button>
                </div>

                {customAmenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customAmenities.map((amen) => (
                      <span
                        key={amen}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200"
                      >
                        {amen}
                        <button
                          type="button"
                          onClick={() => removeCustomAmenity(amen)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Media */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#1E5BFF]" /> Media Library &amp; Uploads
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload new photos to Cloudinary or reuse existing workspace photos directly from your personal asset library.
              </p>
            </div>

            <MediaPicker
              selectedMedia={media}
              onChange={setMedia}
              maxFiles={12}
            />
          </div>
        )}

        {/* Step 6: Pricing */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-[#1E5BFF]" /> Base Pricing &amp; Billing Unit
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Set starting price shown on public cards and cards filter index.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Starting Price (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 8500"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-base font-bold pl-9 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Billing Cycle / Unit *
                </label>
                <select
                  value={pricingUnit}
                  onChange={(e) => setPricingUnit(e.target.value as PricingUnit)}
                  className="w-full text-sm font-semibold px-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E5BFF] outline-none bg-white"
                >
                  <option value="per-month">Per Month</option>
                  <option value="per-day">Per Day</option>
                  <option value="per-hour">Per Hour</option>
                  <option value="per-seat">Per Seat / Month</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Review & Submit */}
        {currentStep === 7 && (
          <ListingReviewStep
            title={title}
            description={description}
            address={address}
            area={area}
            city={city}
            capacity={capacity}
            basePrice={basePrice}
            pricingUnit={pricingUnit}
            serviceIds={serviceIds}
            amenityIds={amenityIds}
            customAmenities={customAmenities}
            media={media}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          {currentStep < LISTING_STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E5BFF] text-white text-xs font-bold hover:bg-blue-700 transition shadow-xs"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-sm font-extrabold hover:brightness-110 transition shadow-md disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Submit for Review
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
