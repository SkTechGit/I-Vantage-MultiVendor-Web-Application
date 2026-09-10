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
  Building,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

interface AmenityCategory {
  title: string;
  subtitle: string;
  icon: typeof Building;
  items: { name: string; icon: typeof Wifi }[];
}

const amenityCategories: AmenityCategory[] = [
  {
    title: "Connectivity & Workplace",
    subtitle: "Enterprise collaboration facilities",
    icon: Building,
    items: [
      { name: "Enterprise-grade high-speed Wi-Fi", icon: Wifi },
      { name: "Two 6-seater meeting rooms", icon: Users },
      { name: "20-seater conference venue", icon: Presentation },
      { name: "Lockable manager & boss cabins", icon: Shield },
      { name: "Dedicated front-desk reception", icon: Headphones },
    ],
  },
  {
    title: "Infrastructure & Reliability",
    subtitle: "100% uptime & operational safety",
    icon: Zap,
    items: [
      { name: "100% full-load power backup", icon: Zap },
      { name: "Centralized air conditioning", icon: Wind },
      { name: "High-speed passenger lifts", icon: Building },
      { name: "Certified fire safety systems", icon: Flame },
      { name: "24/7 security & CCTV monitoring", icon: Camera },
    ],
  },
  {
    title: "Comfort & Lifestyle",
    subtitle: "Workplace wellness & refreshments",
    icon: Coffee,
    items: [
      { name: "In-house pantry & cafeteria", icon: Utensils },
      { name: "Complimentary tea & coffee", icon: Coffee },
      { name: "Relaxing lounge & breakout zones", icon: Sparkles },
      { name: "Equipped kitchen facilities", icon: Utensils },
      { name: "Abundant natural daylight", icon: Sun },
    ],
  },
  {
    title: "Building Convenience",
    subtitle: "Hassle-free access & upkeep",
    icon: Car,
    items: [
      { name: "Dedicated & visitor parking", icon: Car },
      { name: "24/7 secure member access", icon: Clock },
      { name: "Daily professional housekeeping", icon: Sparkles },
      { name: "Campus security & monitoring", icon: Shield },
      { name: "Maintained common corridors", icon: Building },
    ],
  },
];

export default function ServicesAmenities() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Everything Your Workday Needs"
          subtitle="A complete infrastructure ecosystem built to eliminate operational friction and ensure productivity around the clock."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {amenityCategories.map((cat) => {
            const CatIcon = cat.icon;

            return (
              <div
                key={cat.title}
                className="flex flex-col rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs transition-all duration-300 hover:border-blue-200 hover:shadow-lg sm:p-7"
              >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF]">
                    <CatIcon size={22} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A1F66]">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">{cat.subtitle}</p>
                  </div>
                </div>

                {/* Items */}
                <ul className="mt-5 space-y-3.5">
                  {cat.items.map((item) => {
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
