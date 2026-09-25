import React from "react";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import Listing from "@/models/Listing";
import Category from "@/models/Category";
import Amenity from "@/models/Amenity";
import MarketplaceFilterSidebar from "@/components/marketplace/MarketplaceFilterSidebar";
import {
  Building2,
  MapPin,
  Sparkles,
  Users,
  ChevronRight,
  Filter,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

interface Props {
  params: Promise<{ city: string; category: string }>;
  searchParams: Promise<{
    area?: string;
    capacity?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string;
    sort?: string;
    page?: string;
  }>;
}

const FALLBACK_CATEGORY_SPACES = [
  {
    _id: "fc-1",
    title: "i-VANTAGE Welldone Executive Workspace",
    slug: "i-vantage-welldone-executive-workspace",
    description: "Fully serviced executive workspace with high-speed leased line, dedicated pantry, and reception services.",
    location: { area: "Sohna Road", address: "Welldone Tech Park, Sector 48, Sohna Road, Gurugram" },
    pricing: { basePrice: 18500, unit: "per-month" },
    capacity: 6,
    media: [{ mediaId: { secureUrl: "/images/workspace/conf3.webp" } }],
    amenityIds: [{ name: "High-Speed WiFi" }, { name: "24/7 Access" }, { name: "Cafeteria" }],
  },
  {
    _id: "fc-2",
    title: "Cyber City Horizon Executive Space",
    slug: "cyber-city-horizon-executive-space",
    description: "Ergonomic workstations in DLF Cyber City with 24/7 access, metro connectivity, and collaborative lounges.",
    location: { area: "Cyber City", address: "DLF Cyber City, Building 10, DLF Phase 2, Gurugram" },
    pricing: { basePrice: 9999, unit: "per-month" },
    capacity: 4,
    media: [{ mediaId: { secureUrl: "/images/workspace/openseat1.webp" } }],
    amenityIds: [{ name: "Rapid Metro 200m" }, { name: "High-Speed WiFi" }, { name: "Power Backup" }],
  },
  {
    _id: "fc-3",
    title: "Golf Course Rd Signature Space",
    slug: "golf-course-rd-signature-space",
    description: "High-end collaborative space equipped with 4K video conferencing, motorized projection, and executive seating.",
    location: { area: "Golf Course Road", address: "Sector 54, Golf Course Road, Gurugram" },
    pricing: { basePrice: 14500, unit: "per-month" },
    capacity: 8,
    media: [{ mediaId: { secureUrl: "/images/workspace/conf4.webp" } }],
    amenityIds: [{ name: "Video Conferencing" }, { name: "Valet Parking" }, { name: "Cafeteria" }],
  },
  {
    _id: "fc-4",
    title: "MG Road Flexible Central Space",
    slug: "mg-road-flexible-central-space",
    description: "High-energy workspace walking distance from MG Road Metro. Unlimited tea, coffee, and meeting credits.",
    location: { area: "MG Road", address: "Heritage City, MG Road, Gurugram" },
    pricing: { basePrice: 7499, unit: "per-month" },
    capacity: 2,
    media: [{ mediaId: { secureUrl: "/images/workspace/openseat2.webp" } }],
    amenityIds: [{ name: "Yellow Line Metro" }, { name: "High-Speed WiFi" }, { name: "Tea & Coffee" }],
  },
];

export default async function CategoryListingPage({ params, searchParams }: Props) {
  const { city, category } = await params;
  const sParams = await searchParams;

  const normalizedCity = decodeURIComponent(city).toLowerCase().trim();
  const normalizedCategory = decodeURIComponent(category).toLowerCase().trim();

  await connectDB();

  // Find category doc
  const categoryDoc = await Category.findOne({ slug: normalizedCategory }).lean();

  const cityName =
    normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1);
  const categoryName = categoryDoc?.name || category.replace(/-/g, " ").toUpperCase();

  // Build query: strictly isLive: true
  const isGurgaonVariant = normalizedCity === "gurgaon" || normalizedCity === "gurugram";
  const query: any = {
    "location.city": isGurgaonVariant ? { $in: ["gurgaon", "gurugram"] } : normalizedCity,
    isLive: true,
  };

  if (categoryDoc) {
    query.categoryId = categoryDoc._id;
  }

  if (sParams.area) {
    query["location.area"] = { $regex: sParams.area, $options: "i" };
  }

  if (sParams.capacity) {
    query.capacity = { $gte: Number(sParams.capacity) };
  }

  if (sParams.minPrice || sParams.maxPrice) {
    query["pricing.basePrice"] = {};
    if (sParams.minPrice) query["pricing.basePrice"].$gte = Number(sParams.minPrice);
    if (sParams.maxPrice) query["pricing.basePrice"].$lte = Number(sParams.maxPrice);
  }

  if (sParams.amenities) {
    const amenityList = sParams.amenities.split(",").map((a) => a.trim()).filter(Boolean);
    if (amenityList.length > 0) {
      const validObjectIds = amenityList.filter((id) => mongoose.isValidObjectId(id));
      const matchedAmenities = await Amenity.find({
        $or: [
          { name: { $in: amenityList.map((n) => new RegExp(`^${n}$`, "i")) } },
          ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
        ],
      }).select("_id").lean();

      const matchedIds = matchedAmenities.map((a) => a._id);
      const amenityRegexes = amenityList.map((n) => new RegExp(n, "i"));
      query.$or = [
        ...(matchedIds.length > 0 ? [{ amenityIds: { $in: matchedIds } }] : []),
        { customAmenities: { $in: amenityRegexes } },
      ];
    }
  }

  // Sorting
  let sortObj: any = { "pricing.basePrice": 1, createdAt: -1 };
  if (sParams.sort === "price_desc") sortObj = { "pricing.basePrice": -1 };
  if (sParams.sort === "capacity_desc") sortObj = { capacity: -1 };
  if (sParams.sort === "newest") sortObj = { createdAt: -1 };

  // Pagination parameters
  const page = Math.max(1, Number(sParams.page) || 1);
  const limit = 8;
  const skip = (page - 1) * limit;

  const [dbListings, totalCount, categories] = await Promise.all([
    Listing.find(query)
      .populate("categoryId", "name slug")
      .populate("media.mediaId", "secureUrl")
      .populate("amenityIds", "name icon")
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    Listing.countDocuments(query),
    Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
  ]);

  // When DB has live listings matching query, use them.
  // If DB has 0 listings, gracefully filter fallback showcase so UI filtering never breaks.
  let filteredFallback = FALLBACK_CATEGORY_SPACES;
  if (sParams.area) {
    filteredFallback = filteredFallback.filter((s) =>
      s.location.area.toLowerCase().includes(sParams.area!.toLowerCase())
    );
  }
  if (sParams.capacity) {
    filteredFallback = filteredFallback.filter(
      (s) => (s.capacity || 1) >= Number(sParams.capacity)
    );
  }
  if (sParams.minPrice) {
    filteredFallback = filteredFallback.filter(
      (s) => s.pricing.basePrice >= Number(sParams.minPrice)
    );
  }
  if (sParams.maxPrice) {
    filteredFallback = filteredFallback.filter(
      (s) => s.pricing.basePrice <= Number(sParams.maxPrice)
    );
  }

  const isUsingFallback = dbListings.length === 0;
  const listings = isUsingFallback ? (filteredFallback as any) : dbListings;
  const effectiveTotal = isUsingFallback ? filteredFallback.length : totalCount;
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / limit));

  // Helper to preserve 100% of query filters across pagination
  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(sParams).forEach(([k, v]) => {
      if (v && k !== "page") {
        params.set(k, String(v));
      }
    });
    params.set("page", String(targetPage));
    return `/${normalizedCity}/${normalizedCategory}?${params.toString()}`;
  };

  const distinctAreas = [
    "Cyber City",
    "Golf Course Road",
    "Sohna Road",
    "MG Road",
    "Udyog Vihar",
    "Golf Course Ext.",
    "Sector 48",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb Header */}
      <div className="bg-[#0A1F66] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-blue-200">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/${normalizedCity}`} className="hover:text-white capitalize">
              {cityName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#D99000] font-bold">{categoryName}</span>
          </nav>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {categoryName} in {cityName}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
            Compare verified {categoryName.toLowerCase()} options in {cityName}. Browse amenities, seating configurations, and transparent partner rates.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <MarketplaceFilterSidebar
            city={cityName}
            totalResults={effectiveTotal}
            availableAreas={distinctAreas}
            categories={categories.map((c: any) => ({
              _id: c._id.toString(),
              name: c.name,
              slug: c.slug,
            }))}
            currentCategorySlug={normalizedCategory}
          />

          {/* Grid Content */}
          <main className="flex-1 w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-lg font-black text-[#0A1F66]">
                  {sParams.area ? `${sParams.area} • ${categoryName}` : `${categoryName} Options`}
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {listings.length} of {effectiveTotal} verified spaces in {cityName}
                </p>
              </div>

              {sParams.area && (
                <span className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-bold text-[#1E5BFF] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  <MapPin className="w-3 h-3" /> {sParams.area}
                </span>
              )}
            </div>

            {listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
                <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">
                  No matching {categoryName.toLowerCase()} spaces found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try widening your budget or clearing location filters to view more coworking options.
                </p>
                <div className="pt-3">
                  <Link
                    href={`/${normalizedCity}/${normalizedCategory}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-blue-900 transition"
                  >
                    Reset Filters
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((item: any) => {
                  const coverImg =
                    item.media?.[0]?.mediaId?.secureUrl ||
                    "/images/workspace/conf3.webp";
                  const detailUrl = `/${normalizedCity}/${normalizedCategory}/${item.slug || item._id}`;

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                          <Image
                            src={coverImg}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </div>

                          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-[#0A1F66] text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                            ₹{item.pricing?.basePrice?.toLocaleString("en-IN")}{" "}
                            <span className="text-[10px] font-medium text-slate-500">
                              /{item.pricing?.unit?.replace("per-", "") || "month"}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 space-y-2.5">
                          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-[#1E5BFF] transition">
                            <Link href={detailUrl}>{item.title}</Link>
                          </h3>

                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#1E5BFF] flex-shrink-0" />
                            <span className="truncate">{item.location?.area || "Gurugram"}, {cityName}</span>
                          </p>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                            <span className="flex items-center gap-1 font-semibold">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {item.capacity || 1} {item.capacity === 1 ? "Seat" : "Seats"}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                              Direct Rates
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href={detailUrl}
                          className="text-xs font-bold text-[#1E5BFF] hover:underline flex items-center gap-1"
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={detailUrl}
                          className="px-3.5 py-1.5 bg-[#0A1F66] hover:bg-[#1E5BFF] text-white text-xs font-bold rounded-xl transition shadow-xs"
                        >
                          Enquire
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-8 flex items-center justify-center gap-2">
                {page > 1 ? (
                  <Link
                    href={buildPageUrl(page - 1)}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </Link>
                ) : (
                  <span className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </span>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildPageUrl(p)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                      page === p
                        ? "bg-[#0A1F66] text-white shadow-md shadow-blue-900/20"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </Link>
                ))}

                {page < totalPages ? (
                  <Link
                    href={buildPageUrl(page + 1)}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-not-allowed">
                    Next <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

