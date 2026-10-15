"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Star,
  Clock,
  Coffee,
  Wifi,
  Car,
  Lock,
  Zap,
  Tag,
  Info,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  ExternalLink,
  HelpCircle,
  TrendingUp,
  X,
  Camera,
  CheckCircle2,
  Calendar,
  PhoneCall,
  Flame,
  ArrowRight,
} from "lucide-react";

interface ListingDetailViewProps {
  listing: any;
  city?: string;
  category?: string;
}

interface SeatingOption {
  id: string;
  name: string;
  subtitle: string;
  capacityLabel: string;
  image: string;
  price: number;
  originalPrice: number;
  unit: string;
  discountCode: string;
  features: string[];
  statusLabel?: string;
  isPopular?: boolean;
}

export default function ListingDetailView({
  listing,
  city,
  category,
}: ListingDetailViewProps) {
  const item: any = listing;
  const rawCity = city || item.location?.city || "gurugram";
  const rawCategory = category || item.categoryId?.slug || "spaces";

  const cityName =
    rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase();
  const categoryName = item.categoryId?.name || "Coworking Space";

  // Curated Fallback Images
  const fallbackGallery = [
    "/images/workspace/conf3.webp",
    "/images/workspace/conf1.webp",
    "/images/workspace/openseat3.webp",
    "/images/workspace/pantry1.webp",
    "/images/workspace/reception1.webp",
    "/images/workspace/conf2.webp",
    "/images/workspace/openseat1.webp",
  ];

  // Raw media from backend
  const rawMediaList = (item.media || [])
    .map((m: any) => m?.mediaId?.secureUrl || m?.url || "")
    .filter(Boolean);

  // Unified Gallery of at least 4 photos
  const fullGallery: string[] = useMemo(() => {
    const combined = [...rawMediaList];
    for (const fb of fallbackGallery) {
      if (combined.length < 5 && !combined.includes(fb)) {
        combined.push(fb);
      }
    }
    return combined.length > 0 ? combined : fallbackGallery;
  }, [rawMediaList]);

  const primaryImage = fullGallery[0];

  // Base pricing
  const basePrice = Number(item.pricing?.basePrice) || 7999;
  const baseUnit = item.pricing?.unit?.replace("per-", "") || "month";

  // Seating Options Generation (Dynamically mirrors myHQ seating cards)
  const seatingOptions: SeatingOption[] = useMemo(() => {
    // If backend has configured services, map them
    if (Array.isArray(item.serviceIds) && item.serviceIds.length > 0) {
      return item.serviceIds.map((svc: any, idx: number) => {
        const sPrice = Number(svc.price) || basePrice;
        const sOrig = Math.round(sPrice * 1.25);
        const imagesPool = [
          fullGallery[1] || fallbackGallery[1],
          fullGallery[2] || fallbackGallery[2],
          fullGallery[0] || fallbackGallery[0],
          fullGallery[3] || fallbackGallery[3],
        ];

        return {
          id: svc._id || `svc-${idx}`,
          name: svc.name || "Workspace Plan",
          subtitle: svc.size || "Flexible Seating",
          capacityLabel: svc.size || "1 - 10 Seats",
          image: imagesPool[idx % imagesPool.length],
          price: sPrice,
          originalPrice: sOrig,
          unit: "month",
          discountCode: "IVANTAGE10",
          features: [
            "Ergonomic seating & desk",
            "High-speed 1Gbps Wi-Fi",
            "Unlimited artisan coffee & tea",
            "100% DG power backup",
          ],
          isPopular: idx === 0,
        };
      });
    }

    // Default High-Converting Seating Plans (Open Desk, Dedicated Desk, Private Cabin, Meeting Room)
    const openDeskPrice = Math.max(699, Math.round(basePrice * 0.1));
    const dedicatedPrice = basePrice;
    const cabinPrice = Math.round(basePrice * 2.8);
    const meetingRoomPrice = 1200;

    return [
      {
        id: "open-desk",
        name: "Open Flexi Desk",
        subtitle: "Hot desk in collaborative open workspace",
        capacityLabel: "1 Person / Hot Desk",
        image: fullGallery[2] || "/images/workspace/openseat3.webp",
        price: openDeskPrice,
        originalPrice: Math.round(openDeskPrice * 1.3),
        unit: "day",
        discountCode: "IVANTAGE50",
        features: [
          "Plug & play hot desk",
          "High-speed dual-band Wi-Fi",
          "Unlimited tea, coffee & RO water",
          "Access to common lounge & cafeteria",
        ],
        statusLabel: "Instant Access Today",
      },
      {
        id: "dedicated-desk",
        name: "Dedicated Desk",
        subtitle: "Your own fixed workstation with lockable storage",
        capacityLabel: "1 Reserved Seat",
        image: fullGallery[0] || "/images/workspace/conf3.webp",
        price: dedicatedPrice,
        originalPrice: Math.round(dedicatedPrice * 1.25),
        unit: baseUnit,
        discountCode: "IVANTAGE10",
        features: [
          "Dedicated fixed workstation",
          "Lockable storage pedestal",
          "24/7 keycard access & security",
          "2 hours/month meeting room credits",
        ],
        isPopular: true,
        statusLabel: "Only 4 desks left",
      },
      {
        id: "private-cabin",
        name: "Private Executive Cabin",
        subtitle: "Soundproof acoustic office suite for teams",
        capacityLabel: "3, 6, 10, 20 Seater Options",
        image: fullGallery[1] || "/images/workspace/conf1.webp",
        price: cabinPrice,
        originalPrice: Math.round(cabinPrice * 1.2),
        unit: "month",
        discountCode: "IVANTAGE15",
        features: [
          "Private acoustic soundproof suite",
          "Manager desk & executive chairs",
          "Company branding on cabin door",
          "Complimentary conference room credits",
        ],
        statusLabel: "High Demand · Priority Booking",
      },
      {
        id: "meeting-room",
        name: "Meeting & AV Boardroom",
        subtitle: "Executive conference suite for pitches & syncs",
        capacityLabel: "6 - 14 Seater AV Suite",
        image: fullGallery[3] || "/images/workspace/conf2.webp",
        price: meetingRoomPrice,
        originalPrice: 1800,
        unit: "hour",
        discountCode: "MEET15",
        features: [
          "4K Ultra-HD display screen",
          "Polycom conference phone & mic",
          "Magnetic whiteboard & markers",
          "Beverage hospitality service",
        ],
        statusLabel: "Hourly On-Demand",
      },
    ];
  }, [item, basePrice, baseUnit, fullGallery]);

  // Selected seating option state
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    seatingOptions[1]?.id || seatingOptions[0]?.id || "dedicated-desk"
  );

  const activePlan = useMemo(() => {
    return (
      seatingOptions.find((p) => p.id === selectedPlanId) || seatingOptions[0]
    );
  }, [seatingOptions, selectedPlanId]);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Copy Address Toast
  const [copied, setCopied] = useState(false);
  const handleCopyAddress = () => {
    const fullAddress = `${item.location?.address || ""}, ${item.location?.area || ""}, ${item.location?.city || "Gurugram"}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Offer Dropdown State
  const [showOffers, setShowOffers] = useState(false);

  const fullAddress = `${item.location?.address || "One Horizon Center, Golf Course Road"}${item.location?.area ? `, ${item.location.area}` : ", DLF Phase 5"}${item.location?.city ? `, ${String(item.location.city).toUpperCase()}` : ", GURUGRAM"}, HR 122002`;

  const scrollToForm = () => {
    const el = document.getElementById("enquiry-booking-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-16 text-slate-800">
      {/* 1. Breadcrumbs Bar */}
      <div className="bg-white border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#0A1F66] transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <Link
              href={`/${rawCity.toLowerCase()}`}
              className="hover:text-[#0A1F66] capitalize transition"
            >
              {cityName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="text-slate-500">
              {item.location?.area || "Coworking"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="text-[#0A1F66] font-bold truncate max-w-[200px] sm:max-w-xs">
              {item.title}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyAddress}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E5BFF] transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* 2. Photo Showcase Gallery (myHQ Layout: 1 Large + 3 Stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Main Large Photo */}
          <div
            onClick={() => {
              setActivePhotoIndex(0);
              setLightboxOpen(true);
            }}
            className="md:col-span-2 relative aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl overflow-hidden bg-slate-200 shadow-xs cursor-pointer group"
          >
            <Image
              src={primaryImage}
              alt={item.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            {/* Popular / Verified Badge */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-[#0A1F66] shadow-md backdrop-blur-md border border-white/60">
                <Flame className="w-3.5 h-3.5 text-[#F4A900] fill-[#F4A900]" />
                <span>Popular Choice</span>
              </span>
            </div>

            {/* View All Photos Button */}
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex(0);
                  setLightboxOpen(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-900 bg-white/95 hover:bg-white backdrop-blur-md shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#1E5BFF]" />
                <span>View all {fullGallery.length} photos</span>
              </button>
            </div>
          </div>

          {/* 3 Secondary Stacked Photos */}
          <div className="grid grid-cols-3 md:grid-cols-1 gap-2.5 sm:gap-3">
            {fullGallery.slice(1, 4).map((photoUrl, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActivePhotoIndex(idx + 1);
                  setLightboxOpen(true);
                }}
                className="relative aspect-video sm:aspect-[16/9] md:aspect-[16/8] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-200 shadow-xs cursor-pointer group"
              >
                <Image
                  src={photoUrl}
                  alt={`Center photo ${idx + 2}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Property Title, Rating & Key Badges Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1E5BFF] border border-blue-200/60">
                {categoryName}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> i-VANTAGE Verified Hub
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A1F66] tracking-tight">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-[#1E5BFF] shrink-0" />
                <span className="truncate max-w-md">{fullAddress}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="text-xs font-bold text-[#1E5BFF] hover:underline cursor-pointer"
              >
                {copied ? "Copied!" : "Copy Address"}
              </button>
            </div>

            {/* Social Proof Pill (Matches myHQ) */}
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                <span>Booked 172 times in last 30 days</span>
              </span>
              <span className="text-xs text-slate-400">• Highly Rated Space</span>
            </div>
          </div>

          {/* Rating Box on Right */}
          <div className="flex items-center md:flex-col md:items-end gap-2 bg-white md:bg-transparent p-3 md:p-0 rounded-xl border md:border-0 border-slate-200">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black text-sm shadow-xs">
              <Star className="w-4 h-4 fill-white" />
              <span>4.8</span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              1,240+ Verified Reviews
            </span>
          </div>
        </div>

        {/* 4. Two-Column Layout (Left: Content Sections, Right: Sticky Booking/Enquiry) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: Seating Options, Why Us, Location, Amenities, House Rules, FAQs */}
          <div className="lg:col-span-2 space-y-10">
            {/* A. SELECT A SEATING OPTION (myHQ Core Component) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="relative pb-2">
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#0A1F66]">
                    Select a Seating Option
                  </h2>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E5BFF] rounded-full" />
                </div>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="text-xs font-bold text-[#1E5BFF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Need custom layout?</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Seating Cards Stack */}
              <div className="space-y-3.5">
                {seatingOptions.map((option) => {
                  const isSelected = option.id === selectedPlanId;

                  return (
                    <div
                      key={option.id}
                      onClick={() => setSelectedPlanId(option.id)}
                      className={`group relative bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-[#1E5BFF] ring-2 ring-[#1E5BFF]/20 shadow-md bg-blue-50/20"
                          : "border-slate-200/90 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                        {/* Seating Option Thumbnail */}
                        <div className="relative w-full sm:w-44 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={option.image}
                            alt={option.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 180px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {option.isPopular && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#1E5BFF] text-white shadow-xs">
                              POPULAR
                            </span>
                          )}
                        </div>

                        {/* Plan Details & Why Choose */}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-bold text-[#0A1F66] group-hover:text-[#1E5BFF] transition-colors">
                              {option.name}
                            </h3>
                            {option.statusLabel && (
                              <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                {option.statusLabel}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{option.capacityLabel}</span>
                          </p>

                          {/* Feature Tags ("Why choose?") */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {option.features.slice(0, 3).map((feat, fIdx) => (
                              <span
                                key={fIdx}
                                className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium"
                              >
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate max-w-[150px] sm:max-w-none">{feat}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Pricing & Selection CTA */}
                        <div className="sm:border-l sm:border-slate-100 sm:pl-5 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="text-xs text-slate-400 line-through">
                              ₹{option.originalPrice.toLocaleString("en-IN")}
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg sm:text-xl font-black text-[#0A1F66]">
                                ₹{option.price.toLocaleString("en-IN")}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                /{option.unit}
                              </span>
                            </div>
                            <span className="inline-block mt-0.5 text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded tracking-wide">
                              {option.discountCode}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlanId(option.id);
                            }}
                            className={`w-28 sm:w-32 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              isSelected
                                ? "bg-[#0A1F66] text-white shadow-xs"
                                : "bg-white hover:bg-slate-50 text-[#0A1F66] border border-slate-300"
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Selected</span>
                              </>
                            ) : (
                              <span>Select Plan</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* B. "Why book Workspaces with i-VANTAGE ?" Banner (myHQ Match) */}
            <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#0A1F66] via-[#0E2A8C] to-[#1E5BFF] text-white shadow-md space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#F4A900]">
                  THE i-VANTAGE ADVANTAGE
                </span>
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  Why book Workspaces with i-VANTAGE ?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                    <Building2 className="w-5 h-5 text-blue-200" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white">Unique Grade A Spaces</h4>
                    <p className="text-xs text-blue-100/80 leading-relaxed">
                      Hand-curated premium corporate towers with verified acoustics and ergonomic furniture.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                    <Tag className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white">Economical Direct Pricing</h4>
                    <p className="text-xs text-blue-100/80 leading-relaxed">
                      Direct operator rates with zero brokerage, zero markup, and 100% transparent agreements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                    <Zap className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white">Hassle-free Move-in</h4>
                    <p className="text-xs text-blue-100/80 leading-relaxed">
                      Plug-and-play setups with instant high-speed Wi-Fi credentials. Start working immediately.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                    <Users className="w-5 h-5 text-purple-200" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white">Dedicated Enterprise Concierge</h4>
                    <p className="text-xs text-blue-100/80 leading-relaxed">
                      Free assisted site tours, customized office floorplans, and priority booking support.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* C. LOCATION DETAILS (myHQ Section 3) */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1E5BFF]">
                  CONNECTIVITY & ACCESS
                </span>
                <h3 className="text-lg font-black text-[#0A1F66]">
                  Location Details
                </h3>
              </div>

              {/* Address card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Center Address
                </p>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                    {fullAddress}
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${item.title} ${fullAddress}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1E5BFF] hover:underline"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {copied ? "Copied to clipboard!" : "Copy Full Address"}
                  </button>
                </div>
              </div>

              {/* Transit Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">🚇 Metro Station</span>
                  <p className="text-xs font-bold text-slate-900">300m Walking Distance</p>
                  <p className="text-[11px] text-slate-500">Rapid Metro & Yellow Line direct</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">✈️ Airport Access</span>
                  <p className="text-xs font-bold text-slate-900">20 Mins Drive</p>
                  <p className="text-[11px] text-slate-500">Fast corridor via Expressway</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">☕ Food & Dining</span>
                  <p className="text-xs font-bold text-slate-900">2 Mins Walk</p>
                  <p className="text-[11px] text-slate-500">Cafes, banks & fine restaurants</p>
                </div>
              </div>
            </section>

            {/* D. ABOUT THE CENTER & OPERATING HOURS (myHQ Section 3) */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1E5BFF]">
                  MANAGED INFRASTRUCTURE
                </span>
                <h3 className="text-lg font-black text-[#0A1F66]">
                  About {item.title}
                </h3>
              </div>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
                <p>
                  {item.description ||
                    `${item.title} is an ultra-premium managed workspace designed for fast-growing companies, enterprises, and discerning professionals. Featuring soundproof executive suites, ergonomic workstations, and high-speed enterprise fiber connectivity.`}
                </p>
                <p>
                  The center provides seamless hospitality with dedicated business concierge, receptionist greeting, mail management, and curated networking community events.
                </p>
              </div>

              {/* Workspace Timings Card (Exact myHQ Match) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1E5BFF]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F66]">
                    Workspace Timings
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                    <span className="text-slate-400 block text-[10px] font-bold">MON - FRI</span>
                    <span className="font-bold text-slate-800">8:00 AM – 8:30 PM</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                    <span className="text-slate-400 block text-[10px] font-bold">SATURDAY</span>
                    <span className="font-bold text-slate-800">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                    <span className="text-slate-400 block text-[10px] font-bold">SUNDAY</span>
                    <span className="font-bold text-emerald-700">24/7 Keycard for Cabins</span>
                  </div>
                </div>
              </div>

              {/* Hub Metadata Badges */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600">
                <span>
                  <strong>Center Capacity:</strong> {item.capacity || 150} Total Seats
                </span>
                <span>
                  <strong>Building Grade:</strong> Grade A Corporate Park
                </span>
                <span>
                  <strong>Managed By:</strong>{" "}
                  {item.vendorId?.businessName || item.vendorId?.name || "i-VANTAGE Verified Partner"}
                </span>
              </div>
            </section>

            {/* E. COMMON AMENITIES (Categorized & Verified, myHQ Section 3) */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1E5BFF]">
                    FEATURE BREAKDOWN
                  </span>
                  <h3 className="text-lg font-black text-[#0A1F66]">
                    Common Amenities & Facilities
                  </h3>
                </div>

                {/* Legend badges */}
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free Included
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#1E5BFF]" /> Premier Feature
                  </span>
                </div>
              </div>

              {/* Notice Banner (Exact myHQ Match) */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#1E5BFF] shrink-0 mt-0.5" />
                <span>
                  Amenities like reserved 4-wheeler parking and dedicated phone booths are limited and subject to availability at the center.
                </span>
              </div>

              {/* Available Included Amenities Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AVAILABLE AT THIS CENTER
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "2 Wheeler Parking", type: "free", icon: Car },
                    { name: "4 Wheeler Parking", type: "free", icon: Car },
                    { name: "High-Speed Wi-Fi (1Gbps)", type: "free", icon: Wifi },
                    { name: "Tea & Artisan Coffee", type: "free", icon: Coffee },
                    { name: "Filtered RO Drinking Water", type: "free", icon: Check },
                    { name: "Ergonomic Chairs & Desks", type: "free", icon: Check },
                    { name: "Separate Male/Female Washroom", type: "free", icon: Check },
                    { name: "Cafeteria & Pantry Lounge", type: "free", icon: Coffee },
                    { name: "Central Air Conditioning", type: "free", icon: Check },
                    { name: "100% DG Power Backup", type: "free", icon: Zap },
                    { name: "Desk Charging Ports", type: "free", icon: Zap },
                    { name: "Security Personnel & CCTV", type: "free", icon: Lock },
                    { name: "Fire Extinguisher & Alarms", type: "free", icon: Check },
                    { name: "First Aid Emergency Kit", type: "free", icon: Check },
                    { name: "Acoustic Phone Booths", type: "premier", icon: PhoneCall },
                    { name: "Meeting & AV Boardrooms", type: "paid", icon: Layers },
                  ].map((amenity, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <amenity.icon className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">
                          {amenity.name}
                        </span>
                      </div>
                      {amenity.type === "free" && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded shrink-0">
                          Free
                        </span>
                      )}
                      {amenity.type === "premier" && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded shrink-0">
                          Premier
                        </span>
                      )}
                      {amenity.type === "paid" && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded shrink-0">
                          On-Demand
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Not Included / Optional Section */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  NOT INCLUDED / OPTIONAL UPGRADES
                </h4>
                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="px-3 py-1 rounded-lg bg-slate-100 font-medium">
                    Heavy Production Printing (available on nominal per-sheet basis)
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 font-medium">
                    Dedicated Private Server Racks (available upon request)
                  </span>
                </div>
              </div>
            </section>

            {/* F. House Rules & Guidelines */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-[#0A1F66]">
                House Rules & Workspace Policies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Business Decorum:</strong> Professional and respectful work atmosphere in open spaces.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Visitor Policy:</strong> External guests require reception sign-in and escort.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Quiet Calling Zones:</strong> Dedicated soundproof phone booths for long client calls.
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Clean Desk & Smoke-Free:</strong> 100% smoke-free premises with daily sanitization.
                  </span>
                </div>
              </div>
            </section>

            {/* G. Frequently Asked Questions (FAQ) */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1E5BFF]">
                  HELPFUL ANSWERS
                </span>
                <h3 className="text-lg font-black text-[#0A1F66]">
                  Frequently Asked Questions
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: "Can I schedule a physical site visit before committing?",
                    a: "Yes, absolutely! Fill out the schedule form or click 'Book a Visit'. Our dedicated workspace concierge will arrange a personalized walkthrough with the center manager at your preferred time with zero fees.",
                  },
                  {
                    q: "Are there any hidden brokerage charges or security deposits?",
                    a: "No. i-VANTAGE operates with a strict Zero Brokerage policy. You deal with direct partner rates. Security deposits are standard 1-2 months for dedicated cabins, fully refundable upon move-out.",
                  },
                  {
                    q: "How soon can our team move in?",
                    a: "For Open Desks and Dedicated Desks, you can move in the very same day. For Private Cabins, move-in can take place within 24 to 48 hours once agreements and access cards are configured.",
                  },
                  {
                    q: "Can we register our company GST and business address here?",
                    a: "Yes! Dedicated Desks and Private Cabins include documentation support for GST registration, ROC company incorporation, and signage display.",
                  },
                  {
                    q: "What is the policy for meeting room usage?",
                    a: "All dedicated members receive complimentary meeting room credits every month. Additional hours can be easily reserved on-demand via our portal or at the front desk.",
                  },
                ].map((faq, fIdx) => {
                  const isOpen = openFaq === fIdx;
                  return (
                    <div
                      key={fIdx}
                      className="border border-slate-200 rounded-xl overflow-hidden transition"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                        className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#0A1F66] flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#1E5BFF] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-4 pt-2 text-xs text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Sticky Booking / Enquiry Widget (Exact myHQ Structure) */}
          <div
            id="enquiry-booking-section"
            className="lg:sticky lg:top-24 space-y-4"
          >
            {/* Widget 1: Dynamic Plan Booking Summary Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#1E5BFF]">
                  SELECTED SEATING PLAN
                </span>
                <h3 className="text-base sm:text-lg font-black text-[#0A1F66] leading-tight">
                  Book {activePlan.name} at {item.title}
                </h3>
              </div>

              {/* Price display */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Member Rate
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-[#0A1F66]">
                      ₹{activePlan.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      /{activePlan.unit}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through block">
                    ₹{activePlan.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                    SAVE {Math.round((1 - activePlan.price / activePlan.originalPrice) * 100)}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Proceed to select dates, team size, and tour schedule:
              </p>

              {/* CTA Button */}
              <button
                type="button"
                onClick={scrollToForm}
                className="w-full py-3 bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] hover:brightness-110 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Schedule a Tour / Book Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Offer Banner (myHQ Match) */}
              <div className="pt-2">
                <div
                  onClick={() => setShowOffers(!showOffers)}
                  className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-[11px] sm:text-xs">
                      Get 15% OFF (upto ₹5,000). Use {activePlan.discountCode}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-700 underline shrink-0">
                    {showOffers ? "Hide" : "2 Offers"}
                  </span>
                </div>

                {showOffers && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">IVANTAGE15</span>
                      <span className="text-[10px] text-emerald-600 font-bold">15% OFF on 3+ Months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">MEET15</span>
                      <span className="text-[10px] text-emerald-600 font-bold">₹500 off meeting rooms</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Widget 2: "Planning a meeting?" Cross-Sell Mini Card (Exact myHQ Match) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3.5">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <Image
                  src="/images/workspace/conf3.webp"
                  alt="Meeting room"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-bold text-[#0A1F66] truncate">
                  Planning a team meeting?
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  Book a meeting room at this workspace for team discussions or client pitches.
                </p>
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-xs font-black text-[#0A1F66]">
                    From ₹1,200<span className="text-[10px] font-normal text-slate-500">/hr</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const mr = seatingOptions.find((p) => p.id === "meeting-room");
                      if (mr) setSelectedPlanId(mr.id);
                      scrollToForm();
                    }}
                    className="text-[11px] font-bold text-[#1E5BFF] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Widget 3: Direct Partner Enquiry Form (Pre-populated with activePlan) */}
            <ListingEnquiryForm
              listingId={item._id ? item._id.toString() : String(item.id)}
              listingTitle={item.title}
              selectedPlan={activePlan.name}
              planPrice={activePlan.price}
              planUnit={activePlan.unit}
            />
          </div>
        </div>
      </div>

      {/* 5. Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {activePlan.name}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-[#0A1F66]">
                ₹{activePlan.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-500">/{activePlan.unit}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToForm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] text-white text-xs font-bold shadow-md cursor-pointer"
          >
            Book Desk / Tour
          </button>
        </div>
      </div>

      {/* 6. Fullscreen Photo Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white pb-4 max-w-6xl mx-auto w-full">
            <span className="text-sm font-bold">
              {activePhotoIndex + 1} / {fullGallery.length} Photos • {item.title}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo View */}
          <div className="relative flex-1 max-w-5xl mx-auto w-full flex items-center justify-center">
            <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden">
              <Image
                src={fullGallery[activePhotoIndex]}
                alt={`Photo ${activePhotoIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Prev Button */}
            {activePhotoIndex > 0 && (
              <button
                type="button"
                onClick={() => setActivePhotoIndex((prev) => prev - 1)}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
            )}

            {/* Next Button */}
            {activePhotoIndex < fullGallery.length - 1 && (
              <button
                type="button"
                onClick={() => setActivePhotoIndex((prev) => prev + 1)}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="max-w-4xl mx-auto w-full pt-4 flex items-center gap-2 overflow-x-auto pb-2 justify-center">
            {fullGallery.map((imgUrl, thumbIdx) => (
              <button
                key={thumbIdx}
                type="button"
                onClick={() => setActivePhotoIndex(thumbIdx)}
                className={`relative w-16 sm:w-20 h-12 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                  activePhotoIndex === thumbIdx
                    ? "border-[#1E5BFF] scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={imgUrl}
                  alt={`Thumbnail ${thumbIdx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
