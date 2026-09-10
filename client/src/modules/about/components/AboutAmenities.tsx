import {
  Wifi,
  Users,
  Presentation,
  Shield,
  Headphones,
  Zap,
  Wind,
  Flame,
  Camera,
  Coffee,
  Utensils,
  Sun,
  Car,
  Clock,
  Sparkles,
  Check,
  Building,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

interface AmenityCategory {
  category: string;
  tagline: string;
  icon: typeof Building;
  items: { name: string; icon: typeof Wifi }[];
}

const amenityGroups: AmenityCategory[] = [
  {
    category: "Workspace Essentials",
    tagline: "Core work & collaboration facilities",
    icon: Building,
    items: [
      { name: "High-speed enterprise Wi-Fi", icon: Wifi },
      { name: "6-seater meeting rooms", icon: Users },
      { name: "20-seater conference facility", icon: Presentation },
      { name: "Lockable private cabins", icon: Shield },
      { name: "Front-desk reception support", icon: Headphones },
    ],
  },
  {
    category: "Infrastructure & Reliability",
    tagline: "Uninterrupted business operations",
    icon: Zap,
    items: [
      { name: "100% full-load power backup", icon: Zap },
      { name: "Centralized air conditioning", icon: Wind },
      { name: "High-speed passenger lifts", icon: Building },
      { name: "Comprehensive fire safety systems", icon: Flame },
      { name: "24/7 security & CCTV monitoring", icon: Camera },
    ],
  },
  {
    category: "Comfort & Lifestyle",
    tagline: "Breakout & workplace wellness",
    icon: Coffee,
    items: [
      { name: "In-house pantry & cafeteria", icon: Utensils },
      { name: "Complimentary tea & coffee", icon: Coffee },
      { name: "Lounge & breakout zones", icon: Sparkles },
      { name: "Kitchen facilities", icon: Utensils },
      { name: "Abundant natural daylight", icon: Sun },
    ],
  },
  {
    category: "Building Convenience",
    tagline: "Ease of access & maintenance",
    icon: Car,
    items: [
      { name: "Dedicated & visitor parking", icon: Car },
      { name: "24/7 secure card access", icon: Clock },
      { name: "Daily professional housekeeping", icon: Sparkles },
      { name: "Well-maintained common areas", icon: Building },
      { name: "Welldone Tech Park campus security", icon: Shield },
    ],
  },
];

export default function AboutAmenities() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Amenities & Infrastructure"
          subtitle="Everything your team needs to stay productive, secure, and comfortable during regular and extended working hours."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {amenityGroups.map((group) => {
            const HeaderIcon = group.icon;

            return (
              <div
                key={group.category}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs transition-all duration-300 hover:border-blue-200 hover:shadow-lg sm:p-7"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF]">
                    <HeaderIcon size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A1F66]">
                      {group.category}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {group.tagline}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <ul className="mt-5 space-y-3.5">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <li
                        key={item.name}
                        className="flex items-center gap-2.5 text-xs font-medium text-slate-700 sm:text-sm"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50/70 text-[#1E5BFF]">
                          <ItemIcon size={13} />
                        </span>
                        <span>{item.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
