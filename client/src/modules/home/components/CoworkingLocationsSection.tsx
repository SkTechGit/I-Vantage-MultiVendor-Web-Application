"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRealtimeEvent } from "@/context/RealtimeContext";
import {
  MapPin,
  Building2,
  Users,
  ArrowRight,
  Sparkles,
  Search,
  PhoneCall,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ListingEnquiryModal, {
  EnquiryListingTarget,
} from "@/components/marketplace/ListingEnquiryModal";

interface SpaceCardItem {
  id: string;
  title: string;
  category: string;
  categorySlug?: string;
  city: string;
  area: string;
  address: string;
  price: number;
  unit: string;
  capacity: number;
  image: string;
  amenities: string[];
  vendorName: string;
  slug: string;
}

const PAGE_SIZE = 8;

export default function CoworkingLocationsSection() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Search console state
  const [searchCity, setSearchCity] = useState("gurugram");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchBudget, setSearchBudget] = useState("");

  const [spaces, setSpaces] = useState<SpaceCardItem[]>([]);
  const [enquiryModalTarget, setEnquiryModalTarget] = useState<EnquiryListingTarget | null>(null);

  const fetchLiveListings = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/listings?limit=50&_t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      const json = await res.json();
      const rawListings = Array.isArray(json?.data) ? json.data : (json?.data?.listings || []);
      const apiSpaces: SpaceCardItem[] = rawListings.map((l: any) => ({
        id: l._id,
        title: l.title,
        category: l.categoryId?.name || "Coworking Space",
        categorySlug: l.categoryId?.slug || "spaces",
        city: l.location?.city || "gurugram",
        area: l.location?.area || "Gurugram",
        address: l.location?.address || `${l.location?.area}, Gurugram`,
        price: l.pricing?.basePrice || 7999,
        unit: l.pricing?.unit || "per-month",
        capacity: l.capacity || 1,
        image: l.media?.[0]?.mediaId?.secureUrl || "/images/workspace/conf3.webp",
        amenities: l.amenityIds?.map((a: any) => a.name).slice(0, 5) || [
          "High-Speed WiFi",
          "24/7 Access",
        ],
        vendorName: l.vendorId?.businessName || "Verified Partner",
        slug: l.slug || l._id,
      }));

      setSpaces(apiSpaces);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveListings();

    const handleFocus = () => {
      fetchLiveListings();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchLiveListings]);

  // Real-time live synchronization for coworking spaces
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  useRealtimeEvent("listings", () => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      fetchLiveListings();
    }, 300);
  });

  // Distinct locations computed directly from live listings
  const availableLocations = React.useMemo(() => {
    const areaMap = new Map<string, number>();
    spaces.forEach((s) => {
      const mainArea = s.area.split(",")[0].trim();
      if (mainArea) {
        areaMap.set(mainArea, (areaMap.get(mainArea) || 0) + 1);
      }
    });

    const list = [{ id: "all", label: "All Prime Hubs", count: `${spaces.length}` }];
    areaMap.forEach((count, area) => {
      list.push({ id: area, label: area, count: `${count}` });
    });
    return list;
  }, [spaces]);

  // Distinct categories computed directly from live listings
  const availableCategories = React.useMemo(() => {
    const catMap = new Map<string, number>();
    spaces.forEach((s) => {
      if (s.category) {
        catMap.set(s.category, (catMap.get(s.category) || 0) + 1);
      }
    });
    const list = [{ id: "All Types", label: "All Types", count: `${spaces.length}` }];
    catMap.forEach((count, cat) => {
      list.push({ id: cat, label: cat, count: `${count}` });
    });
    return list;
  }, [spaces]);

  // Filter spaces by location and category
  const filteredSpaces = spaces.filter((item) => {
    const matchesLocation =
      selectedLocation === "all" ||
      item.area.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Types" ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesLocation && matchesCategory;
  });

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLocation, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredSpaces.length / PAGE_SIZE));
  const clampedPage = Math.min(Math.max(1, currentPage), totalPages);
  const displayedSpaces = filteredSpaces.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchCategory) query.set("category", searchCategory);
    if (searchBudget) query.set("maxPrice", searchBudget);
    router.push(`/${searchCity}${query.toString() ? `?${query.toString()}` : ""}`);
  };

  return (
    <section className="relative py-20 sm:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A1F6606_1px,transparent_1px),linear-gradient(to_bottom,#0A1F6606_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-amber-50/90 border border-amber-200/80 text-[#B45309] uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
            <span>Curated Workspaces & Business Network</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0A1F66] tracking-tight leading-[1.15]">
            Discover Premium Coworking Across{" "}
            <span className="bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#1E5BFF] bg-clip-text text-transparent">
              Gurugram&apos;s Prime Hubs
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Direct access to executive private cabins, flexible open desks, and boardrooms in Sector 48 Sohna Road, DLF Cyber City, and Golf Course Road. Zero brokerage, guaranteed pricing.
          </p>
        </div>

        {/* Executive Search Console */}
        <div className="mb-10 max-w-4xl mx-auto bg-white/95 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_12px_36px_rgba(10,31,102,0.07)] border border-slate-200/90 backdrop-blur-md">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
          >
            {/* City */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pl-1">
                <MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" /> City
              </label>
              <div className="relative">
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full appearance-none text-xs font-bold text-slate-800 bg-slate-50/80 rounded-xl px-3.5 py-2.5 pr-8 border border-slate-200 outline-none focus:border-[#1E5BFF] focus:ring-3 focus:ring-blue-100 transition"
                >
                  <option value="gurugram">Gurugram (Gurgaon)</option>
                  <option value="delhi">Delhi NCR</option>
                  <option value="noida">Noida</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Space Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pl-1">
                <Building2 className="w-3.5 h-3.5 text-[#1E5BFF]" /> Space Category
              </label>
              <div className="relative">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full appearance-none text-xs font-bold text-slate-800 bg-slate-50/80 rounded-xl px-3.5 py-2.5 pr-8 border border-slate-200 outline-none focus:border-[#1E5BFF] focus:ring-3 focus:ring-blue-100 transition"
                >
                  <option value="">All Categories</option>
                  <option value="private-cabin">Private Cabin</option>
                  <option value="dedicated-desk">Dedicated Desk</option>
                  <option value="meeting-room">Meeting Room</option>
                  <option value="coworking-seat">Coworking Seat</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pl-1">
                <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" /> Max Budget
              </label>
              <div className="relative">
                <select
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="w-full appearance-none text-xs font-bold text-slate-800 bg-slate-50/80 rounded-xl px-3.5 py-2.5 pr-8 border border-slate-200 outline-none focus:border-[#1E5BFF] focus:ring-3 focus:ring-blue-100 transition"
                >
                  <option value="">Any Budget</option>
                  <option value="8000">Under ₹8,000 / mo</option>
                  <option value="15000">Under ₹15,000 / mo</option>
                  <option value="30000">Under ₹30,000 / mo</option>
                  <option value="50000">Enterprise Suites (₹50k+)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="sm:pt-6">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs font-black shadow-md shadow-blue-900/15 transition flex items-center justify-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Hubs</span>
              </button>
            </div>
          </form>
        </div>

        {/* Location Segmented Controls */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {availableLocations.map((loc) => {
            const isActive = selectedLocation === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? "bg-[#0A1F66] text-white border-[#0A1F66] shadow-md shadow-[#0A1F66]/15 scale-[1.02]"
                    : "bg-white text-slate-600 border-slate-200/90 hover:border-slate-300 hover:text-slate-900 shadow-2xs"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-[#F4A900]" : "bg-slate-300"
                  }`}
                />
                <span>{loc.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? "bg-white/15 text-blue-100"
                      : "bg-slate-100 text-slate-500 font-medium"
                  }`}
                >
                  {loc.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {availableCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 border flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-xs"
                    : "bg-slate-100/90 text-slate-600 border-transparent hover:bg-slate-200/70"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/80 text-slate-500 font-medium"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Space Cards Grid: Fixed 4 cards in a row on desktop (lg:grid-cols-4), compact sizing */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200 p-4 space-y-4"
              >
                <div className="h-44 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredSpaces.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3 mb-8">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No workspaces found</h3>
            <p className="text-xs text-slate-400">
              No verified listings match this location or category yet.
            </p>
            <button
              onClick={() => {
                setSelectedLocation("all");
                setSelectedCategory("All Types");
              }}
              className="text-xs font-bold text-[#1E5BFF] hover:underline pt-2 block mx-auto"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 mb-8">
            {displayedSpaces.map((item) => {
              const detailUrl = `/spaces/${encodeURIComponent(item.slug || item.id)}`;

              return (
                <article
                  key={item.id}
                  className="relative group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 shadow-[0_2px_12px_rgba(10,31,102,0.03)] hover:shadow-[0_16px_32px_rgba(10,31,102,0.08)] hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
                >
                  {/* Full-Card Accessible Navigation Target */}
                  <Link
                    href={detailUrl}
                    className="absolute inset-0 z-10 rounded-xl sm:rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF] focus-visible:ring-offset-2"
                    aria-label={`View details for ${item.title}, ${item.category} in ${item.area}`}
                  />

                  <div>
                    {/* Compact Card Image - h-28 on mobile, h-44 on desktop */}
                    <div className="relative h-28 sm:h-44 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 right-1.5 sm:right-2.5 flex items-center justify-between">
                        <span className="px-1.5 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-white/95 text-[#0A1F66] backdrop-blur-md shadow-2xs flex items-center gap-0.5 sm:gap-1 border border-white/60">
                          <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1E5BFF]" />
                          <span className="truncate max-w-[65px] sm:max-w-none">{item.category}</span>
                        </span>

                        <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold bg-emerald-600 text-white shadow-2xs flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span className="hidden sm:inline">Verified</span>
                        </span>
                      </div>

                      {/* Bottom Image Overlay Info */}
                      <div className="absolute bottom-1.5 sm:bottom-2.5 left-1.5 sm:left-2.5 right-1.5 sm:right-2.5 flex items-center justify-between text-white">
                        <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px] font-bold drop-shadow-sm">
                          <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F4A900] shrink-0" />
                          <span className="truncate max-w-[70px] sm:max-w-[130px]">{item.area}</span>
                        </div>

                        <div className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-bold bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
                          <Users className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-300" />
                          <span>{item.capacity} {item.capacity === 1 ? "Desk" : "Seats"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content - Clean & Compact */}
                    <div className="p-2.5 sm:p-4 space-y-0.5 sm:space-y-1.5">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#1E5BFF] truncate">
                        {item.vendorName}
                      </p>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#1E5BFF] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                        {item.address}
                      </p>
                    </div>
                  </div>

                  {/* Card Pricing & Enquiry CTA */}
                  <div className="p-2.5 sm:p-4 pt-1.5 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-2">
                    <div>
                      <span className="text-[8px] sm:text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                        Starting From
                      </span>
                      <p className="text-xs sm:text-sm font-black text-[#0A1F66]">
                        ₹{item.price.toLocaleString("en-IN")}{" "}
                        <span className="text-[9px] sm:text-[10px] font-normal text-slate-500">
                          /{item.unit.replace("per-", "")}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEnquiryModalTarget({
                          id: item.id,
                          title: item.title,
                          category: item.category,
                          area: item.area,
                          city: item.city,
                          price: item.price,
                          unit: item.unit,
                          vendorName: item.vendorName,
                        });
                      }}
                      className="relative z-20 w-full sm:w-auto inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] hover:brightness-110 shadow-xs shadow-blue-900/15 transition-all duration-200 active:scale-95 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF] focus-visible:ring-offset-2 cursor-pointer"
                    >
                      <span>Enquire</span>
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
      )}

        {/* Numbered Pagination (Super Admin Style) */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-2 border-t border-slate-200/80 mb-10">
            <p className="text-xs font-semibold text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {(clampedPage - 1) * PAGE_SIZE + 1}
              </span>
              –
              <span className="font-bold text-slate-800">
                {Math.min(clampedPage * PAGE_SIZE, filteredSpaces.length)}
              </span>{" "}
              of <span className="font-bold text-slate-800">{filteredSpaces.length}</span> curated spaces
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={clampedPage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1 shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[34px] h-[34px] px-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                    clampedPage === pageNum
                      ? "bg-[#0A1F66] text-white shadow-sm shadow-[#0A1F66]/20 font-black"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={clampedPage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1 shadow-2xs"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* View All Spaces Link */}
        <div className="text-center mb-14">
          <Link
            href="/gurugram"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white border border-slate-200/90 text-[#0A1F66] text-xs sm:text-sm font-extrabold shadow-2xs hover:border-[#1E5BFF] hover:text-[#1E5BFF] hover:shadow-sm transition-all duration-200"
          >
            <span>Explore All 50+ Verified Hubs in Gurugram</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Operator Onboarding Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0A1F66] via-[#0D2678] to-[#1E5BFF] text-white p-7 sm:p-10 relative overflow-hidden shadow-2xl border border-blue-400/20">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-[#F4A900]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4A900] text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <Building2 className="w-3.5 h-3.5" /> For Coworking Operators & Commercial Landlords
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                List Your Coworking Center on i-VANTAGE Marketplace
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl">
                Join our premium network of certified workspace providers. Showcase private cabins, boardrooms, and open desks to hundreds of verified startup & enterprise clients looking for spaces daily.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href="/list-your-space"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F4A900] hover:bg-[#e09b00] text-[#0A1F66] text-xs font-black shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> List Your Space
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Talk to Operations
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Enquiry Modal */}
      <ListingEnquiryModal
        isOpen={!!enquiryModalTarget}
        onClose={() => setEnquiryModalTarget(null)}
        listing={enquiryModalTarget}
      />
    </section>
  );
}
