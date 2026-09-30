import React from "react";
import Link from "next/link";
import Image from "next/image";
import MarketplaceFilterSidebar from "@/components/marketplace/MarketplaceFilterSidebar";
import MarketplaceLiveRevalidator from "@/components/marketplace/MarketplaceLiveRevalidator";
import {
  Building2,
  MapPin,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  params: Promise<{ city: string }>;
  searchParams: Promise<{
    area?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    capacity?: string;
    amenities?: string;
    sort?: string;
    page?: string;
  }>;
}

const FALLBACK_SPACES = [
  {
    _id: "fb-1",
    title: "i-VANTAGE Welldone Executive Suites",
    slug: "i-vantage-welldone-executive-suites",
    description: "Fully serviced executive private cabin with high-speed leased line, dedicated pantry, and reception services.",
    categoryId: { name: "Private Cabin", slug: "private-cabin" },
    location: { area: "Sohna Road", address: "Welldone Tech Park, Sector 48, Sohna Road, Gurugram" },
    pricing: { basePrice: 18500, unit: "per-month" },
    capacity: 6,
    media: [{ mediaId: { secureUrl: "/images/workspace/conf3.webp" } }],
  },
  {
    _id: "fb-2",
    title: "Cyber City Horizon Dedicated Desks",
    slug: "cyber-city-horizon-dedicated-desks",
    description: "Ergonomic workstations in DLF Cyber City with 24/7 access, metro connectivity, and collaborative lounges.",
    categoryId: { name: "Dedicated Desk", slug: "dedicated-desk" },
    location: { area: "Cyber City", address: "DLF Cyber City, Building 10, DLF Phase 2, Gurugram" },
    pricing: { basePrice: 9999, unit: "per-month" },
    capacity: 1,
    media: [{ mediaId: { secureUrl: "/images/workspace/openseat1.webp" } }],
  },
  {
    _id: "fb-3",
    title: "Golf Course Rd Elite Boardroom",
    slug: "golf-course-rd-elite-boardroom",
    description: "High-end boardroom equipped with 4K video conferencing, motorized projection, and executive leather seating.",
    categoryId: { name: "Meeting Room", slug: "meeting-room" },
    location: { area: "Golf Course Road", address: "Sector 54, Golf Course Road, Gurugram" },
    pricing: { basePrice: 1200, unit: "per-hour" },
    capacity: 14,
    media: [{ mediaId: { secureUrl: "/images/workspace/conf4.webp" } }],
  },
  {
    _id: "fb-4",
    title: "MG Road Flexible Coworking Desks",
    slug: "mg-road-flexible-coworking-desks",
    description: "High-energy open desk community walking distance from MG Road Metro. Unlimited tea, coffee, and meeting credits.",
    categoryId: { name: "Coworking Seat", slug: "coworking-seat" },
    location: { area: "MG Road", address: "Heritage City, MG Road, Gurugram" },
    pricing: { basePrice: 7499, unit: "per-month" },
    capacity: 1,
    media: [{ mediaId: { secureUrl: "/images/workspace/openseat2.webp" } }],
  },
  {
    _id: "fb-5",
    title: "Udyog Vihar Managed Enterprise Wing",
    slug: "udyog-vihar-managed-enterprise-wing",
    description: "Private team floor with biometric access, custom branding, executive cabin, and 100% DG power backup.",
    categoryId: { name: "Private Cabin", slug: "private-cabin" },
    location: { area: "Udyog Vihar", address: "Phase IV, Udyog Vihar, Gurugram" },
    pricing: { basePrice: 32000, unit: "per-month" },
    capacity: 12,
    media: [{ mediaId: { secureUrl: "/images/workspace/conf1.webp" } }],
  },
  {
    _id: "fb-6",
    title: "Sohna Road Premium Open Workstation",
    slug: "sohna-road-premium-open-workstation",
    description: "Spacious tech workstations in Spaze I-Tech Park with cafeteria, high-speed WiFi, and ample car parking.",
    categoryId: { name: "Dedicated Desk", slug: "dedicated-desk" },
    location: { area: "Sohna Road", address: "Sector 49, Sohna Road, Gurugram" },
    pricing: { basePrice: 6999, unit: "per-month" },
    capacity: 1,
    media: [{ mediaId: { secureUrl: "/images/workspace/openseat3.webp" } }],
  },
];

export default async function CityCoworkingPage({ params, searchParams }: Props) {
  const { city } = await params;
  const sParams = await searchParams;

  const normalizedCity = decodeURIComponent(city).toLowerCase().trim();
  const cityName =
    normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  // 1. Fetch categories from Express backend
  let allCategories: any[] = [];
  try {
    const catRes = await fetch(`${apiUrl}/marketplace-categories`, {
      next: { revalidate: 300 },
    });
    if (catRes.ok) {
      const catJson = await catRes.json();
      allCategories = catJson.data || [];
    }
  } catch (err) {
    console.error("Error fetching categories from backend:", err);
  }

  // 2. Fetch listings from Express backend
  const queryParams = new URLSearchParams();
  queryParams.set("city", normalizedCity);
  if (sParams.category) {
    const matchedCat = allCategories.find((c) => c.slug === sParams.category);
    if (matchedCat?._id || matchedCat?.id) {
      queryParams.set("category", matchedCat._id || matchedCat.id);
    }
  }
  if (sParams.minPrice) queryParams.set("minPrice", sParams.minPrice);
  if (sParams.maxPrice) queryParams.set("maxPrice", sParams.maxPrice);
  if (sParams.capacity) queryParams.set("capacity", sParams.capacity);
  if (sParams.amenities) queryParams.set("amenities", sParams.amenities);
  if (sParams.page) queryParams.set("page", sParams.page);
  queryParams.set("limit", "9");

  let dbListings: any[] = [];
  let totalCount = 0;

  try {
    const listRes = await fetch(`${apiUrl}/listings?${queryParams.toString()}`, {
      next: { revalidate: 60 },
    });
    if (listRes.ok) {
      const listJson = await listRes.json();
      dbListings = listJson.data || [];
      totalCount = listJson.pagination?.total || 0;
    }
  } catch (err) {
    console.error("Error fetching listings from backend:", err);
  }

  const categories = allCategories;
  const page = Math.max(1, Number(sParams.page) || 1);
  const limit = 9;

  // When DB has live listings matching query, use them.
  // If DB has 0 listings, gracefully filter fallback showcase so UI filtering never breaks.
  let filteredFallback = FALLBACK_SPACES;
  if (sParams.area) {
    filteredFallback = filteredFallback.filter((s) =>
      s.location.area.toLowerCase().includes(sParams.area!.toLowerCase())
    );
  }
  if (sParams.category) {
    filteredFallback = filteredFallback.filter((s) =>
      s.categoryId.slug.toLowerCase() === sParams.category!.toLowerCase()
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
    return `/${normalizedCity}?${params.toString()}`;
  };

  // Extract available distinct areas for filter sidebar
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
      <MarketplaceLiveRevalidator />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A1F66] via-[#0D257A] to-[#1E5BFF] text-white py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(217,144,0,0.15),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#D99000] text-white uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Verified Coworking Network
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Premium Coworking Spaces in{" "}
              <span className="bg-gradient-to-r from-[#FFB800] via-[#FFD270] to-[#D99000] bg-clip-text text-transparent font-black drop-shadow-xs">
                {cityName}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
              Discover verified private cabins, flexible desks, and executive conference rooms across prime commercial hubs in {cityName}. Zero brokerage, direct partner pricing.
            </p>

            {/* Quick stats counter */}
            <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-blue-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Verified Partners
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Building2 className="w-4 h-4 text-[#D99000]" /> {effectiveTotal} Active Spaces
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase Bar */}
      <section className="bg-white border-b border-slate-200 py-4 sticky top-17 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex-shrink-0 mr-2">
              Category:
            </span>
            <Link
              href={`/${normalizedCity}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0 ${
                !sParams.category
                  ? "bg-[#0A1F66] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Spaces
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/${normalizedCity}/${cat.slug}`}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-[#0A1F66] hover:text-white text-slate-700 whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Filter Sidebar + Space Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar */}
          <MarketplaceFilterSidebar
            city={cityName}
            totalResults={effectiveTotal}
            availableAreas={distinctAreas}
            categories={categories.map((c: any) => ({
              _id: c._id.toString(),
              name: c.name,
              slug: c.slug,
            }))}
          />

          {/* Listings Container */}
          <div className="flex-1 w-full space-y-6">
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-lg font-black text-[#0A1F66]">
                  {sParams.area ? `${sParams.area}, ${cityName}` : `Workspaces in ${cityName}`}
                </h2>
                <p className="text-xs text-slate-500">
                  Showing {listings.length} of {effectiveTotal} verified coworking spaces
                </p>
              </div>

              {sParams.area && (
                <span className="self-start sm:self-auto inline-flex items-center gap-1 text-xs font-bold text-[#1E5BFF] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  <MapPin className="w-3 h-3" /> Location: {sParams.area}
                </span>
              )}
            </div>

            {/* Empty State */}
            {listings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
                <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">
                  No spaces found matching your criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your budget or clearing location filters to view more coworking options.
                </p>
                <div className="pt-3">
                  <Link
                    href={`/${normalizedCity}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F66] text-white text-xs font-bold hover:bg-blue-900 transition"
                  >
                    Clear All Filters
                  </Link>
                </div>
              </div>
            ) : (
              /* Spaces Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((item: any) => {
                  const coverImg =
                    item.media?.[0]?.mediaId?.secureUrl ||
                    "/images/workspace/conf3.webp";
                  const catSlug = item.categoryId?.slug || "spaces";
                  const detailUrl = `/${normalizedCity}/${catSlug}/${item.slug || item._id}`;

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                    >
                      <div>
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                          <Image
                            src={coverImg}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#0A1F66] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                            {item.categoryId?.name || "Workspace"}
                          </div>

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

                        {/* Details */}
                        <div className="p-5 space-y-2.5">
                          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-[#1E5BFF] transition">
                            <Link href={detailUrl}>{item.title}</Link>
                          </h3>

                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#1E5BFF] flex-shrink-0" />
                            <span className="truncate">
                              {item.location?.area || "Gurugram"}, {cityName}
                            </span>
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
                              Zero Brokerage
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
                          Enquire Now
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="pt-8 flex items-center justify-center gap-2">
                {/* Previous */}
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

                {/* Numbered Pages */}
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

                {/* Next */}
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
          </div>
        </div>
      </section>
    </div>
  );
}

