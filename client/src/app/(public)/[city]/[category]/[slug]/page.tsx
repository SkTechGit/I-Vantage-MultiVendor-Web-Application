import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ListingEnquiryForm from "@/components/marketplace/ListingEnquiryForm";
import {
  Building2,
  MapPin,
  Users,
  ChevronRight,
  ShieldCheck,
  Check,
  Sparkles,
  Layers,
  Phone,
} from "lucide-react";

interface Props {
  params: Promise<{
    city: string;
    category: string;
    slug: string;
  }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { city, category, slug } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  let listing: any = null;

  try {
    const res = await fetch(`${apiUrl}/listings/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      listing = json.data;
    }
  } catch (err) {
    console.error("Error fetching listing from backend API:", err);
  }

  if (!listing || !listing.isLive) {
    notFound();
  }

  const item: any = listing;
  const cityName = decodeURIComponent(city);
  const categoryName = item.categoryId?.name || decodeURIComponent(category);
  const mediaList = item.media || [];
  const primaryImage =
    mediaList[0]?.mediaId?.secureUrl ||
    "https://images.unsplash.com/photo-1497366216548-37526070297c";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Derived Breadcrumbs Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href={`/${city}`} className="hover:text-slate-900 capitalize">
            {cityName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href={`/${city}/${category}`} className="hover:text-slate-900">
            {categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-xs">
            {listing.title}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Title & Location Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1E5BFF]">
                {categoryName}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#0A1F66]">
              {listing.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#1E5BFF] flex-shrink-0" />
              <span>
                {listing.location.address}, {listing.location.area}, {listing.location.city.toUpperCase()}
              </span>
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-right self-start md:self-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Starting Rates
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#0A1F66]">
              ₹{listing.pricing?.basePrice?.toLocaleString("en-IN")}{" "}
              <span className="text-xs font-medium text-slate-500">
                /{listing.pricing?.unit?.replace("per-", "")}
              </span>
            </div>
          </div>
        </div>

        {/* Media Photo Showcase Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative aspect-video md:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-200 shadow-sm">
            <Image
              src={primaryImage}
              alt={listing.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {mediaList.slice(1, 3).map((m: any, idx: number) => (
              <div
                key={idx}
                className="relative aspect-video rounded-2xl overflow-hidden bg-slate-200 shadow-sm"
              >
                <Image
                  src={m.mediaId?.secureUrl || primaryImage}
                  alt={`Gallery photo ${idx + 2}`}
                  fill
                  sizes="33vw"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
            {mediaList.length < 2 && (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center text-xs text-slate-400 border border-dashed">
                More photos coming soon
              </div>
            )}
          </div>
        </div>

        {/* Details & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Description, Services & Amenities (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Workspace */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#0A1F66] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#1E5BFF]" /> About This Coworking Space
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {listing.description}
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-600">
                <span>
                  <strong>Center Capacity:</strong> {listing.capacity || 1} Total Seats
                </span>
                <span>
                  <strong>Managed By:</strong> {item.vendorId?.businessName || item.vendorId?.name || "Verified Partner"}
                </span>
              </div>
            </div>

            {/* Included / Available Services */}
            {listing.serviceIds?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-lg font-bold text-[#0A1F66] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#1E5BFF]" /> Available Plans & Desk Services
                </h2>
                <p className="text-xs text-slate-500">
                  Select your desired configuration for custom quotes:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.serviceIds.map((svc: any) => (
                    <div
                      key={svc._id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-[#1E5BFF] bg-slate-50/50 space-y-2 transition"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">
                          {svc.name}
                        </h4>
                        <span className="text-xs font-extrabold text-[#1E5BFF]">
                          ₹{svc.price?.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="inline-block text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                        Size: {svc.size}
                      </span>
                      {svc.description && (
                        <p className="text-xs text-slate-500">{svc.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities & Infrastructure */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-[#0A1F66] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1E5BFF]" /> Amenities & Center Facilities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listing.amenityIds?.map((am: any) => (
                  <div
                    key={am._id}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-800 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{am.name}</span>
                  </div>
                ))}
                {listing.customAmenities?.map((ca: string) => (
                  <div
                    key={ca}
                    className="flex items-center gap-2 text-xs font-semibold text-amber-900 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200"
                  >
                    <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{ca}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Enquiry / Booking Card (1 Col) */}
          <div className="sticky top-24 space-y-4">
            <ListingEnquiryForm
              listingId={listing._id.toString()}
              listingTitle={listing.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
