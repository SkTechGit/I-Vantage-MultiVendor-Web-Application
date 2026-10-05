import {
  Clock,
  Server,
  Layers,
  Users,
  Briefcase,
  Sparkles,
} from "lucide-react";
import Container from "@/components/common/Container";

const differentiators = [
  {
    icon: Layers,
    title: "Flexible Workspace Formats",
    description:
      "From individual coworking workstations and private manager cabins to fully custom managed office floors that scale seamlessly as your business expands.",
  },
  {
    icon: Clock,
    title: "24/7 Workspace Access",
    description:
      "Round-the-clock secure biometric access engineered for businesses running night shifts, international operations, and cross-timezone collaboration.",
  },
  {
    icon: Server,
    title: "Business-Ready Infrastructure",
    description:
      "High-speed enterprise connectivity, 100% full-load power backup, centralized air conditioning, and on-site IT and operational assistance.",
  },
  {
    icon: Users,
    title: "Professional Meeting Facilities",
    description:
      "Dedicated 6-seater meeting rooms and an executive 20-seater conference room equipped for client presentations, pitches, and strategic sessions.",
  },
  {
    icon: Briefcase,
    title: "Integrated Business Ecosystem",
    description:
      "Direct on-demand access to verified professionals across legal, taxation, HR recruitment, funding, marketing, AI automation, and consulting.",
  },
];

export default function ServicesWhyChooseUs() {
  return (
    <section className="border-t border-slate-100 bg-white py-10 sm:py-20 lg:py-24">
      <Container>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#1E5BFF]">
            <Sparkles size={13} />
            <span>The i-VANTAGE Advantage</span>
          </div>

          <h2 className="mt-2 text-xl font-bold leading-tight tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
            Why Businesses Choose i-VANTAGE Services
          </h2>

          <p className="mt-2 text-xs sm:text-base leading-relaxed text-slate-600 sm:text-lg">
            A comprehensive operational foundation combining premium physical
            workspaces with integrated business support so you can focus on core
            growth.
          </p>
        </div>

        {/* 5 Differentiators Grid */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {differentiators.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`group relative flex flex-col rounded-xl sm:rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-7 ${
                  index === 4 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* Number Watermark */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-slate-200 transition-colors group-hover:text-blue-100 sm:text-4xl">
                    0{index + 1}
                  </span>
                  <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-blue-50 text-[#1E5BFF] transition-colors group-hover:bg-[#0A1F66] group-hover:text-white">
                    <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-3 sm:mt-5 text-sm sm:text-lg font-bold text-[#0A1F66]">
                  {item.title}
                </h3>

                {/* Explanation */}
                <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
