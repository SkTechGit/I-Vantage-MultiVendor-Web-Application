import React from "react";
import Image from "next/image";
import { CheckCircle2, AlertCircle, MapPin } from "lucide-react";
import { MediaUploadItem, PricingUnit } from "./listing-form.types";

export interface ListingReviewStepProps {
  title: string;
  description: string;
  address: string;
  area: string;
  city: string;
  capacity: number;
  basePrice: number | "";
  pricingUnit: PricingUnit;
  serviceIds: string[];
  amenityIds: string[];
  customAmenities: string[];
  media: MediaUploadItem[];
}

export default function ListingReviewStep({
  title,
  description,
  address,
  area,
  city,
  capacity,
  basePrice,
  pricingUnit,
  serviceIds,
  amenityIds,
  customAmenities,
  media,
}: ListingReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Review Listing Summary
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Verify all details before submitting to the SuperAdmin approval queue.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-700" />
        <div>
          <span className="font-bold">Important Quality Standard:</span> New listings are placed in <strong>Pending Review</strong> status (<code>isLive: false</code>) upon submission. Once verified by the SuperAdmin team, your listing will be published live to public buyers.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Overview
          </p>
          <div>
            <h4 className="text-base font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{description}</p>
          </div>
          <p className="text-xs text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" /> {address}, {area}, {city.toUpperCase()}
          </p>
          <p className="text-xs text-slate-700">
            <span className="font-semibold">Capacity:</span> {capacity} Seats
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pricing &amp; Classification
          </p>
          <div className="text-xl font-extrabold text-[#0A1F66]">
            ₹{Number(basePrice || 0).toLocaleString("en-IN")}{" "}
            <span className="text-xs font-medium text-slate-500">
              /{pricingUnit.replace("per-", "")}
            </span>
          </div>
          <p className="text-xs text-slate-700">
            <span className="font-semibold">Selected Services:</span> {serviceIds.length} items
          </p>
          <p className="text-xs text-slate-700">
            <span className="font-semibold">Amenities:</span> {amenityIds.length + customAmenities.length} items
          </p>
          <p className="text-xs text-slate-700">
            <span className="font-semibold">Attached Photos:</span> {media.length} images
          </p>
        </div>
      </div>

      {/* Media Thumbnails */}
      {media.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {media.map((img) => (
            <div
              key={img.mediaId}
              className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-300 shrink-0"
            >
              <Image
                src={img.secureUrl}
                alt="Thumbnail"
                fill
                sizes="100px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
