import {
  Clock3,
  Wifi,
  BatteryCharging,
  Snowflake,
  ShieldCheck,
  Sparkles,
  Car,
  Users,
} from "lucide-react";
import Container from "@/components/common/Container";

const trustItems = [
  {
    icon: Clock3,
    title: "24/7 Member Access",
    subtitle: "Round-the-clock entry",
  },
  {
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    subtitle: "Enterprise connectivity",
  },
  {
    icon: BatteryCharging,
    title: "100% Power Backup",
    subtitle: "Zero downtime operations",
  },
  {
    icon: Snowflake,
    title: "Central Air Conditioning",
    subtitle: "Climate-controlled comfort",
  },
  {
    icon: ShieldCheck,
    title: "Reception Support",
    subtitle: "Guest greeting & handling",
  },
  {
    icon: Sparkles,
    title: "Daily Housekeeping",
    subtitle: "Immaculate workspace",
  },
  {
    icon: Car,
    title: "Dedicated Parking",
    subtitle: "Convenient building slots",
  },
  {
    icon: Users,
    title: "Meeting Facilities",
    subtitle: "6 & 20 seater rooms",
  },
];

export default function WhyVisitTrustStrip() {
  return (
    <section className="border-y border-slate-100 bg-white py-14 sm:py-18">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E5BFF]">
            Workplace Infrastructure
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1F66] sm:text-3xl">
            Everything You Need to Work Better
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Backed by enterprise-grade infrastructure at Welldone Tech Park to
            keep your team productive every hour of the day.
          </p>
        </div>

        {/* 8-Item Compact Grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group flex flex-col items-center rounded-2xl border border-slate-200/70 bg-[#FDFEFF] p-4 text-center shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md sm:p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100/60 bg-blue-50/80 text-[#1E5BFF] shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1E5BFF] group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/20">
                  <Icon size={20} strokeWidth={1.85} />
                </div>
                <h3 className="mt-3 text-xs font-bold text-[#0A1F66] transition-colors group-hover:text-[#1E5BFF] sm:text-sm">
                  {item.title}
                </h3>
                <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
