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
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

interface SpaceCardItem {
  id: string;
  title: string;
  category: string;
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

const FEATURED_SPACES: SpaceCardItem[] = [
  {
    id: "sp-1",
    title: "i-VANTAGE Welldone Executive Suites",
    category: "Private Cabin",
    city: "gurugram",
    area: "Sohna Road",
    address: "Welldone Tech Park, Sector 48, Sohna Road, Gurugram",
    price: 18500,
    unit: "per-month",
    capacity: 6,
    image: "/images/workspace/conf3.webp",
    amenities: ["High-Speed Leased Line", "24/7 Access", "Welldone Reception", "Meeting Credits", "Cafeteria"],
    vendorName: "i-VANTAGE Flagship Hub",
    slug: "i-vantage-welldone-executive-suites",
  },
  {
    id: "sp-2",
    title: "Cyber City Horizon Dedicated Desks",
    category: "Dedicated Desk",
    city: "gurugram",
    area: "Cyber City",
    address: "DLF Cyber City, Building 10, DLF Phase 2, Gurugram",
    price: 9999,
    unit: "per-month",
    capacity: 1,
    image: "/images/workspace/openseat1.webp",
    amenities: ["Rapid Metro 200m", "High-Speed WiFi", "Power Backup", "Executive Lounge", "Pantry"],
    vendorName: "Horizon Workspaces",
    slug: "cyber-city-horizon-dedicated-desks",
  },
  {
    id: "sp-3",
    title: "Golf Course Rd Elite Boardroom & Day Pass",
    category: "Meeting Room",
    city: "gurugram",
    area: "Golf Course Road",
    address: "Sector 54, Golf Course Road, Gurugram",
    price: 1200,
    unit: "per-hour",
    capacity: 14,
    image: "/images/workspace/conf4.webp",
    amenities: ["Video Conferencing", "Whiteboard", "High-Speed WiFi", "Valet Parking", "Hospitality Staff"],
    vendorName: "Elite Workspace Partners",
    slug: "golf-course-rd-elite-boardroom",
  },
  {
    id: "sp-4",
    title: "MG Road Flexible Coworking Desks",
    category: "Coworking Seat",
    city: "gurugram",
    area: "MG Road",
    address: "Near MG Road Metro Station, Heritage City, Gurugram",
    price: 7499,
    unit: "per-month",
    capacity: 1,
    image: "/images/workspace/openseat2.webp",
    amenities: ["Yellow Line Metro", "High-Speed WiFi", "Unlimited Coffee", "Print & Scan"],
    vendorName: "Metro Hubs",
    slug: "mg-road-flexible-coworking-desks",
  },
  {
    id: "sp-5",
    title: "Udyog Vihar Managed Enterprise Cabin",
    category: "Private Cabin",
    city: "gurugram",
    area: "Udyog Vihar",
    address: "Phase IV, Udyog Vihar, Gurugram (Near CyberHub)",
    price: 32000,
    unit: "per-month",
    capacity: 12,
    image: "/images/workspace/conf1.webp",
    amenities: ["Dedicated Fiber Line", "24/7 Security", "Enterprise Access", "Covered Parking"],
    vendorName: "Enterprise Co-Works",
    slug: "udyog-vihar-managed-enterprise-cabin",
  },
  {
    id: "sp-6",
    title: "Sohna Road Premium Open Workstation",
    category: "Dedicated Desk",
    city: "gurugram",
    area: "Sohna Road",
    address: "Spaze I-Tech Park, Sector 49, Sohna Road, Gurugram",
    price: 6999,
    unit: "per-month",
    capacity: 1,
    image: "/images/workspace/openseat3.webp",
    amenities: ["Ergonomic Herman Miller", "High-Speed WiFi", "Reserved Parking", "Food Court"],
    vendorName: "Spaze Hubs",
    slug: "sohna-road-premium-open-workstation",
  },
];

const LOCATIONS = [
  { id: "all", label: "All Prime Hubs", count: "50+" },
  { id: "Sohna Road", label: "Sohna Rd (Sec 48)", count: "Flagship" },
  { id: "Cyber City", label: "DLF Cyber City", count: "12 Hubs" },
  { id: "Golf Course Road", label: "Golf Course Rd", count: "8 Hubs" },
  { id: "MG Road", label: "MG Road", count: "10 Hubs" },
  { id: "Udyog Vihar", label: "Udyog Vihar", count: "14 Hubs" },
];

const CATEGORIES = [
  "All Types",
  "Private Cabin",
  "Dedicated Desk",
  "Meeting Room",
  "Coworking Seat",
];

export default function CoworkingLocationsSection() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All Types");

  // Search console state
  const [searchCity, setSearchCity] = useState("gurugram");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchBudget, setSearchBudget] = useState("");

  const [spaces, setSpaces] = useState<SpaceCardItem[]>(FEATURED_SPACES);

  const fetchLiveListings = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/listings?limit=12&_t=${Date.now()}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      const json = await res.json();
      const rawListings = Array.isArray(json?.data) ? json.data : (json?.data?.listings || []);
      if (rawListings.length > 0) {
        const apiSpaces: SpaceCardItem[] = rawListings.map((l: any) => ({
          id: l._id,
          title: l.title,
          category: l.categoryId?.name || "Coworking Space",
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
            "Cafeteria",
          ],
          vendorName: l.vendorId?.businessName || "Verified Partner",
          slug: l._id,
        }));

        if (apiSpaces.length > 0) {
          setSpaces([...apiSpaces, ...FEATURED_SPACES.slice(apiSpaces.length)]);
        } else {
          setSpaces(FEATURED_SPACES);
        }
      }
    } catch {
      // Graceful fallback to verified spaces
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/v1/listings?limit=12&_t=${Date.now()}`, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (ignore) return;
        const rawListings = Array.isArray(json?.data) ? json.data : (json?.data?.listings || []);
        if (rawListings.length > 0) {
          const apiSpaces: SpaceCardItem[] = rawListings.map((l: any) => ({
            id: l._id,
            title: l.title,
            category: l.categoryId?.name || "Coworking Space",
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
              "Cafeteria",
            ],
            vendorName: l.vendorId?.businessName || "Verified Partner",
            slug: l._id,
          }));

          if (apiSpaces.length > 0) {
            setSpaces([...apiSpaces, ...FEATURED_SPACES.slice(apiSpaces.length)]);
          } else {
            setSpaces(FEATURED_SPACES);
          }
        }
      })
      .catch(() => {});

    // Revalidate when user returns to this browser tab
    const handleFocus = () => {
      fetchLiveListings();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      ignore = true;
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

  const filteredSpaces = spaces.filter((item) => {
    const matchesLocation =
      selectedLocation === "all" ||
      item.area.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Types" ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesLocation && matchesCategory;
  });

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
        <div className="mb-12 max-w-4xl mx-auto bg-white/95 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_12px_36px_rgba(10,31,102,0.07)] border border-slate-200/90 backdrop-blur-md">
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
                  <option value="day-pass">Day Pass / Flexi</option>
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
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {LOCATIONS.map((loc) => {
            const isActive = selectedLocation === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-2 border ${
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
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-10 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 border ${
                  isActive
                    ? "bg-[#1E5BFF] text-white border-[#1E5BFF] shadow-xs"
                    : "bg-slate-100/90 text-slate-600 border-transparent hover:bg-slate-200/70"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Space Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {filteredSpaces.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-[0_4px_16px_rgba(10,31,102,0.03)] hover:shadow-[0_16px_36px_rgba(10,31,102,0.09)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-black/30" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#0A1F66] backdrop-blur-md shadow-xs flex items-center gap-1.5 border border-white/50">
                    <Building2 className="w-3 h-3 text-[#1E5BFF]" />
                    <span>{item.category}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Bottom Image Overlay Info */}
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1.5 text-xs font-bold drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#F4A900]" />
                    <span className="truncate max-w-[180px]">{item.area}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold bg-black/45 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    <Users className="w-3 h-3 text-blue-300" />
                    <span>Up to {item.capacity} {item.capacity === 1 ? "Desk" : "Seats"}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#1E5BFF]">
                    {item.vendorName}
                  </p>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#1E5BFF] transition-colors mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.address}
                  </p>
                </div>

                {/* Amenities Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.amenities.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-600 text-[10px] font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {amenity}
                    </span>
                  ))}
                  {item.amenities.length > 3 && (
                    <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-bold">
                      +{item.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Card Pricing & CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Partner Rate
                    </span>
                    <p className="text-lg font-black text-[#0A1F66]">
                      ₹{item.price.toLocaleString("en-IN")}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        /{item.unit.replace("per-", "")}
                      </span>
                    </p>
                  </div>

                  <Link
                    href={`/gurugram?area=${encodeURIComponent(item.area)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] hover:brightness-110 shadow-sm shadow-blue-900/15 transition-all duration-200 active:scale-95 group/btn"
                  >
                    <span>View Space</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Spaces CTA Button */}
        <div className="text-center mb-16">
          <Link
            href="/gurugram"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white border border-slate-200/90 text-[#0A1F66] text-xs sm:text-sm font-extrabold shadow-sm hover:border-[#1E5BFF] hover:text-[#1E5BFF] hover:shadow-md transition-all duration-200"
          >
            <span>Explore All 50+ Verified Hubs in Gurugram</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Operator Onboarding Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0A1F66] via-[#0D2678] to-[#1E5BFF] text-white p-7 sm:p-12 relative overflow-hidden shadow-2xl border border-blue-400/20">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-[#F4A900]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F4A900] text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <Building2 className="w-3.5 h-3.5" /> For Coworking Operators & Commercial Landlords
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                List Your Coworking Center on i-VANTAGE Marketplace
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl">
                Join our premium network of certified workspace providers. Showcase private cabins, boardrooms, and open desks to hundreds of verified startup & enterprise clients looking for spaces daily.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href="/vendor/signup"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F4A900] hover:bg-[#e09b00] text-[#0A1F66] text-xs font-black shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Register as Partner
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
    </section>
  );
}
