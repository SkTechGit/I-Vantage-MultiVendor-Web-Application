import {
  Clock,
  Server,
  Layers,
  Building,
  Sparkles,
} from "lucide-react";
import Container from "@/components/common/Container";

const pillars = [
  {
    icon: Clock,
    title: "24/7 Member Access",
    description:
      "A workspace setup suited to night-shift operations, cross-timezone schedules, and businesses collaborating with international teams.",
  },
  {
    icon: Server,
    title: "Reliable Infrastructure",
    description:
      "High-speed enterprise internet, 100% full-load power backup, centralized air conditioning, and professional security support around the clock.",
  },
  {
    icon: Layers,
    title: "Flexible Workspace Formats",
    description:
      "From a single dedicated workstation to private manager cabins, executive cabins, and bespoke managed office solutions.",
  },
  {
    icon: Building,
    title: "Professional Business Environment",
    description:
      "Reception support, daily housekeeping, meeting rooms, cafeteria, breakout lounge, and parking built for seamless day-to-day business operations.",
  },
];

export default function AboutWhyUs() {
  return (
    <section className="border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1E5BFF]">
            <Sparkles size={14} />
            <span>Why Businesses Choose Us</span>
          </div>

          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
            More Than a Desk. A Complete Business Environment.
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Built for flexibility and engineered for daily operational
            productivity without setting up infrastructure from scratch.
          </p>
        </div>

        {/* 4 Value Pillars Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <div
                key={pillar.title}
                className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-7"
              >
                {/* Number Watermark */}
                <span className="text-3xl font-extrabold text-slate-200 transition-colors group-hover:text-blue-100 sm:text-4xl">
                  0{index + 1}
                </span>

                {/* Icon */}
                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] transition-colors group-hover:bg-[#0A1F66] group-hover:text-white">
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-bold text-[#0A1F66]">
                  {pillar.title}
                </h3>

                {/* Explanation */}
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
