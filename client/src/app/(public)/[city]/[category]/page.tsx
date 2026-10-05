import React from "react";
import Link from "next/link";
import Image from "next/image";
import MarketplaceFilterSidebar from "@/components/marketplace/MarketplaceFilterSidebar";
import MarketplaceListingCards from "@/components/marketplace/MarketplaceListingCards";
import MarketplaceCategoryBar from "@/components/marketplace/MarketplaceCategoryBar";
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



export default async function CategoryListingPage({ params, searchParams }: Props) {
  const { city, category } = await params;
  const sParams = await searchParams;

  const normalizedCity = decodeURIComponent(city).toLowerCase().trim();
  const normalizedCategory = decodeURIComponent(category).toLowerCase().trim();

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

  const categoryDoc = allCategories.find((c) => c.slug === normalizedCategory);

  const cityName =
    normalizedCity.charAt(0).toUpperCase() + normalizedCity.slice(1);
  const categoryName = categoryDoc?.name || category.replace(/-/g, " ").toUpperCase();

  // 2. Fetch listings from Express backend
  const queryParams = new URLSearchParams();
  queryParams.set("city", normalizedCity);
  if (categoryDoc?._id || categoryDoc?.id) {
    queryParams.set("category", categoryDoc._id || categoryDoc.id);
  }
  if (sParams.minPrice) queryParams.set("minPrice", sParams.minPrice);
  if (sParams.maxPrice) queryParams.set("maxPrice", sParams.maxPrice);
  if (sParams.capacity) queryParams.set("capacity", sParams.capacity);
  if (sParams.amenities) queryParams.set("amenities", sParams.amenities);
  if (sParams.page) queryParams.set("page", sParams.page);
  queryParams.set("limit", "8");

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
  const limit = 8;

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

      {/* Sticky Categories Showcase Bar across all category views */}
      <MarketplaceCategoryBar
        normalizedCity={normalizedCity}
        categories={categories}
        activeCategorySlug={normalizedCategory}
      />

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
            topOffset={136}
          />

          {/* Grid Content with Instant Enquiry Modal & Pagination */}
          <MarketplaceListingCards
            listings={listings}
            cityName={cityName}
            normalizedCity={normalizedCity}
            effectiveTotal={effectiveTotal}
            areaFilter={sParams.area}
            page={page}
            totalPages={totalPages}
            basePath={`/${normalizedCity}/${normalizedCategory}`}
            searchParams={sParams}
          />
        </div>
      </div>
    </div>
  );
}

