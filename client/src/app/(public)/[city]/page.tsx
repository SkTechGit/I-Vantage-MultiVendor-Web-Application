import React from "react";
import Link from "next/link";
import Image from "next/image";
import MarketplaceFilterSidebar from "@/components/marketplace/MarketplaceFilterSidebar";
import MarketplaceLiveRevalidator from "@/components/marketplace/MarketplaceLiveRevalidator";
import MarketplaceListingCards from "@/components/marketplace/MarketplaceListingCards";
import MarketplaceCategoryBar from "@/components/marketplace/MarketplaceCategoryBar";
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

  const listings = dbListings;
  const effectiveTotal = totalCount;
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

      {/* Sticky Categories Showcase Bar across all category views */}
      <MarketplaceCategoryBar
        normalizedCity={normalizedCity}
        categories={categories}
        activeCategorySlug={sParams.category}
      />

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

          {/* Listings Container with Instant Enquiry Modal & Pagination */}
          <MarketplaceListingCards
            listings={listings}
            cityName={cityName}
            normalizedCity={normalizedCity}
            effectiveTotal={effectiveTotal}
            areaFilter={sParams.area}
            page={page}
            totalPages={totalPages}
            basePath={`/${normalizedCity}`}
            searchParams={sParams}
          />
        </div>
      </section>
    </div>
  );
}

