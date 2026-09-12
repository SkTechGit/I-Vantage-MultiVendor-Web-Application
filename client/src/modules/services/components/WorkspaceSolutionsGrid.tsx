import Link from "next/link";
import {
  Building2,
  Users,
  Shield,
  Briefcase,
  Presentation,
  Globe,
  Tag,
  Check,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/ui/Button";

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
    capacity: "1 Executive Manager + 2 Guests",
    features: [
      "Executive private boss cabin",
      "1 executive manager desk + 2 visitor chairs",
      "High-speed Wi-Fi & 100% power backup",
      "AC, reception support & housekeeping",
      "Pantry & executive lounge access",
    ],
    ctaText: "Explore Executive Cabins",
  },
  {
    id: "meeting-rooms",
    title: "Meeting Rooms",
    categoryBadge: "2 Available Rooms",
    icon: Presentation,
    description:
      "Professional meeting facilities for client pitches, interviews, team discussions and presentations with presentation displays.",
    price: "Contact Us",
    priceNote: "Available on demand",
    capacity: "6 seats per room",
    features: [
      "Two 6-seater dedicated meeting rooms",
      "High-speed Wi-Fi & presentation facilities",
      "Professional, quiet meeting environment",
      "Front-desk greeting for visiting guests",
    ],
    ctaText: "Book a Meeting Space",
  },
  {
    id: "conference-room",
    title: "20-Seater Conference Room",
    categoryBadge: "1 Conference Venue",
    icon: Presentation,
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

export default function WorkspaceSolutionsGrid() {
  return (
    <section id="workspace-solutions" className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Workspace Solutions"
          subtitle="Explore our comprehensive workspace inventory at Welldone Tech Park, Sector 48, Sohna Road, Gurgaon."
        />

        {/* Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {workspaceSolutions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 sm:p-7 ${
                  item.featured
                    ? "border-blue-300 bg-white shadow-lg ring-2 ring-[#1E5BFF]/10"
                    : "border-slate-200/80 bg-white shadow-xs hover:border-blue-200 hover:shadow-xl"
                }`}
              >
                {item.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[#1E5BFF] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                    Popular Choice
                  </span>
                )}

                <div>
                  {/* Top bar: Icon & Category Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] transition-colors group-hover:bg-[#0A1F66] group-hover:text-white">
                      <Icon size={24} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                      {item.categoryBadge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 text-xl font-bold text-[#0A1F66]">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs font-semibold text-[#1E5BFF]">
                    Capacity: {item.capacity}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  {/* Pricing Box */}
                  <div className="mt-5 border-y border-slate-100 py-3.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-extrabold tracking-tight text-[#0A1F66] sm:text-3xl">
                        {item.price}
                      </span>
                      {item.priceNote && (
                        <span className="text-xs font-medium text-slate-500">
                          {item.priceNote}
                        </span>
                      )}
                    </div>

                    {item.promo && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                        <Tag size={12} className="shrink-0 text-emerald-600" />
                        <span>{item.promo}</span>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="mt-4 space-y-2">
                    {item.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-xs text-slate-700 sm:text-[13px]"
                      >
                        <Check
                          size={14}
                          className="mt-0.5 shrink-0 text-[#1E5BFF]"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <div className="mt-6 pt-2">
                  <Link href="/contact" className="block w-full">
                    <Button
                      variant={item.featured ? "primary" : "outline"}
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
