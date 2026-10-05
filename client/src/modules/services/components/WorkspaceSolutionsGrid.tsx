"use client";

import Link from "next/link";
import {
  Building2,
  Users,
  Shield,
  Briefcase,
  Presentation,
  Globe,
  Check,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/ui/Button";
import { Service } from "@/modules/service/service.types";

interface WorkspaceSolution {
  id: string;
  title: string;
  categoryBadge: string;
  icon: typeof Building2;
  description: string;
  price: string;
  priceNote?: string;
  promo?: string;
  capacity: string;
  features: string[];
  ctaText: string;
  featured?: boolean;
}

const workspaceSolutions: WorkspaceSolution[] = [
  {
    id: "managed-office",
    title: "Managed Office Solutions",
    categoryBadge: "Turnkey Workspace",
    icon: Building2,
    description:
      "A professional, ready-to-use workspace for businesses looking for a dedicated office environment without managing operational details themselves.",
    price: "Custom",
    priceNote: "Tailored to your team size",
    capacity: "Flexible team layouts",
    features: [
      "Custom layout & ready workspace",
      "24/7 member access with card security",
      "High-speed internet & 100% power backup",
      "Centralized AC & reception support",
      "Housekeeping, pantry & cafeteria access",
    ],
    ctaText: "Enquire About Managed Office",
  },
  {
    id: "coworking-seats",
    title: "Dedicated Coworking Workstations",
    categoryBadge: "120 Total Units",
    icon: Users,
    description:
      "Get your own dedicated workstation in a professionally managed workspace with high-speed internet and full amenities.",
    price: "₹7,000",
    priceNote: "per seat / month",
    promo: "1 complimentary service for every 5 seats booked",
    capacity: "Individual workstations",
    features: [
      "Dedicated ergonomic desk & chair",
      "Enterprise-grade high-speed Wi-Fi",
      "100% full-load power backup",
      "Central air conditioning",
      "Reception, housekeeping & cafeteria access",
    ],
    ctaText: "Get a Dedicated Desk",
    featured: true,
  },
  {
    id: "private-cabin",
    title: "Small Private Cabins",
    categoryBadge: "5 Total Units",
    icon: Shield,
    description:
      "A lockable private workspace designed for focused work, confidential discussions, client interactions and small business operations.",
    price: "₹25,000",
    priceNote: "per cabin / month",
    capacity: "1 Manager + 2 Guests (3 seats)",
    features: [
      "Private lockable acoustic cabin",
      "1 manager desk & chair + 2 guest chairs",
      "High-speed Wi-Fi & power backup",
      "Central AC & daily housekeeping",
      "Reception support & pantry access",
    ],
    ctaText: "Enquire About Private Cabins",
  },
  {
    id: "boss-cabin",
    title: "Executive / Boss Cabins",
    categoryBadge: "4 Total Units",
    icon: Briefcase,
    description:
      "For professionals and leadership teams that want a more private, executive workspace with dedicated visitor seating.",
    price: "₹40,000",
    priceNote: "per cabin / month",
    capacity: "1 Executive + 4 Guests (5 seats)",
    features: [
      "Executive suite with premium furniture",
      "Large executive desk + 4 guest chairs",
      "Dedicated storage cabinet",
      "Priority meeting room booking privileges",
      "Complimentary beverage service",
    ],
    ctaText: "Enquire About Executive Cabins",
  },
  {
    id: "meeting-rooms",
    title: "Meeting & Discussion Rooms",
    categoryBadge: "2 Rooms (8 Seats Each)",
    icon: Presentation,
    description:
      "A dedicated room for client meetings, presentations, interviews, and team discussions equipped with modern display capabilities.",
    price: "Hourly / Day Pass",
    priceNote: "Flexible booking available",
    capacity: "Up to 8 people per room",
    features: [
      "Two 8-seater professional meeting rooms",
      "Large screen for presentations & screen sharing",
      "High-speed Wi-Fi & video conferencing ready",
      "Whiteboard & markers for collaborative sessions",
    ],
    ctaText: "Book Meeting Room",
  },
  {
    id: "conference-room",
    title: "Large Conference Room",
    categoryBadge: "1 Room (20 Seats)",
    icon: Users,
    description:
      "Spacious conference facility configured for collaborative discussions, larger team meetings, seminars, and stakeholder presentations.",
    price: "Contact Us",
    priceNote: "Available for booking",
    capacity: "20 seats capacity",
    features: [
      "One 20-seater large conference setup",
      "Presentation screen & conferencing support",
      "High-speed Wi-Fi & power connectivity",
      "Reception hospitality & tea/coffee service",
    ],
    ctaText: "Book Conference Room",
  },
  {
    id: "virtual-office",
    title: "Virtual Office",
    categoryBadge: "Annual Plan",
    icon: Globe,
    description:
      "Establish a professional business presence with an address at Welldone Tech Park, Gurgaon without maintaining full-time physical desks.",
    price: "₹11,000",
    priceNote: "per year",
    capacity: "Professional Business Address",
    features: [
      "Unit 213–14, Welldone Tech Park address",
      "GST registration & business documentation",
      "Courier receiving & mail handling support",
      "On-demand meeting room access available",
    ],
    ctaText: "Get Virtual Office",
  },
];

interface Props {
  selectedServices?: Service[];
  onToggleService?: (service: Service) => void;
  onOpenLeadForm?: () => void;
}

export default function WorkspaceSolutionsGrid({
  selectedServices = [],
  onToggleService,
  onOpenLeadForm,
}: Props) {
  return (
    <section id="workspace-solutions" className="bg-[#F8FAFC] py-10 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Workspace Solutions"
          subtitle="Explore our comprehensive workspace inventory at Welldone Tech Park, Sector 48, Sohna Road, Gurgaon."
        />

        {/* Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="mt-6 sm:mt-12 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {workspaceSolutions.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedServices.some(
              (s) => s._id === item.id || s.slug === item.id
            );

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-7 transition-all duration-300 hover:-translate-y-1 ${
                  isSelected
                    ? "border-emerald-500 bg-white shadow-lg ring-2 ring-emerald-500/30"
                    : item.featured
                    ? "border-blue-300 bg-white shadow-lg ring-2 ring-[#1E5BFF]/10"
                    : "border-slate-200/80 bg-white shadow-xs hover:border-blue-200 hover:shadow-xl"
                }`}
              >
                {isSelected ? (
                  <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-6 rounded-full bg-emerald-600 px-2.5 sm:px-3 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs flex items-center gap-1">
                    <Check size={11} strokeWidth={3} />
                    <span>Selected</span>
                  </span>
                ) : item.featured ? (
                  <span className="absolute -top-2.5 sm:-top-3 left-4 sm:left-6 rounded-full bg-[#1E5BFF] px-2.5 sm:px-3 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                    Popular Choice
                  </span>
                ) : null}

                <div>
                  {/* Top bar: Icon & Category Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] transition-colors group-hover:bg-[#0A1F66] group-hover:text-white">
                      <Icon size={18} className="sm:w-6 sm:h-6" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-slate-700">
                      {item.categoryBadge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3 sm:mt-5 text-base sm:text-xl font-bold text-[#0A1F66]">
                    {item.title}
                  </h3>

                  <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs font-semibold text-[#1E5BFF]">
                    Capacity: {item.capacity}
                  </p>

                  <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-2 sm:line-clamp-none">
                    {item.description}
                  </p>

                  {/* Pricing Box */}
                  <div className="mt-3 sm:mt-5 border-y border-slate-100 py-2 sm:py-3.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold tracking-tight text-[#0A1F66] sm:text-3xl">
                        {item.price}
                      </span>
                      {item.priceNote && (
                        <span className="text-[11px] sm:text-xs font-medium text-slate-500">
                          {item.priceNote}
                        </span>
                      )}
                    </div>
                    {item.promo && (
                      <p className="mt-1 text-[11px] sm:text-xs font-semibold text-[#1E5BFF]">
                        ✨ {item.promo}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="mt-2.5 sm:mt-4 space-y-1 sm:space-y-2">
                    {item.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-1.5 sm:gap-2 text-[11px] text-slate-700 sm:text-[13px]"
                      >
                        <Check
                          size={13}
                          className="mt-0.5 shrink-0 text-[#1E5BFF]"
                        />
                        <span className="line-clamp-1 sm:line-clamp-none">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA & Interactive Select: 2-column on mobile, stacked on sm */}
                <div className="mt-4 sm:mt-6 pt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-col sm:space-y-2">
                  {onToggleService && (
                    <button
                      type="button"
                      onClick={() => {
                        onToggleService({
                          _id: item.id,
                          name: item.title,
                          slug: item.id,
                          shortDescription: item.description,
                          category: {
                            _id: "workspace-and-administration-desk",
                            name: "🏢 Workspace & Administration Desk",
                          },
                          sortOrder: 1,
                          isActive: true,
                          createdAt: new Date().toISOString(),
                        });
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-xl py-2 sm:py-2.5 px-2.5 sm:px-4 text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                          : "border border-[#1E5BFF] bg-blue-50/60 hover:bg-[#1E5BFF] text-[#0A1F66] hover:text-white"
                      }`}
                    >
                      <Check size={13} className={isSelected ? "text-white" : "text-[#1E5BFF] group-hover:text-white"} />
                      <span className="truncate">{isSelected ? "Selected" : "+ Select"}</span>
                    </button>
                  )}

                  {onOpenLeadForm ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!isSelected && onToggleService) {
                          onToggleService({
                            _id: item.id,
                            name: item.title,
                            slug: item.id,
                            shortDescription: item.description,
                            category: {
                              _id: "workspace-and-administration-desk",
                              name: "🏢 Workspace & Administration Desk",
                            },
                            sortOrder: 1,
                            isActive: true,
                            createdAt: new Date().toISOString(),
                          });
                        }
                        onOpenLeadForm();
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 py-2 sm:py-2.5 px-2.5 sm:px-4 text-[11px] sm:text-xs font-bold text-slate-700 transition cursor-pointer"
                    >
                      <span className="truncate">Enquire</span>
                      <ArrowRight size={13} />
                    </button>
                  ) : (
                    <Link href="/contact" className="block w-full">
                      <Button
                        variant={item.featured ? "primary" : "outline"}
                        size="sm"
                        className="w-full text-[11px] sm:text-sm py-2"
                      >
                        <span className="truncate">Enquire</span>
                        <ArrowRight size={13} />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
