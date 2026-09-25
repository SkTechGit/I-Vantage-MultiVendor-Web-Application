import Container from "@/components/common/Container";
import {
  Building2,
  Users,
  ShieldCheck,
  Briefcase,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";

const features = [
  {
    num: "01",
    icon: Building2,
    title: "100+ Integrated Business Services",
    description:
      "A complete single-source ecosystem — from ready-to-move executive cabins to corporate GST, legal compliance, and vendor onboarding.",
    highlight: "Comprehensive Ecosystem",
  },
  {
    num: "02",
    icon: Users,
    title: "Dedicated Relationship Managers",
    description:
      "Every client is assigned a dedicated enterprise specialist ensuring seamless onboarding, IT support, and rapid query resolution within 1 hour.",
    highlight: "1-Hour Response SLA",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "100% Transparent & Zero Brokerage",
    description:
      "Direct partner inventory with clear, upfront commercial terms, zero hidden broker commissions, and flexible tenure contracts.",
    highlight: "Direct Partner Rates",
  },
  {
    num: "04",
    icon: Briefcase,
    title: "Venture Mentorship & Expansion",
    description:
      "Access exclusive networking roundtables, investor connects, enterprise corporate credits, and scalable multi-city presence across India.",
    highlight: "Growth Beyond Desks",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative bg-gradient-to-b from-slate-50/70 via-white to-slate-50/70 py-20 sm:py-28 border-t border-slate-200/70 overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute left-1/2 -top-24 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-blue-50 border border-blue-100 text-[#0A1F66] uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
            <span>The i-VANTAGE Advantage</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0A1F66] tracking-tight leading-tight">
            Why High-Growth Companies{" "}
            <span className="bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#1E5BFF] bg-clip-text text-transparent">
              Trust i-VANTAGE
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We deliver institutional-grade workspace reliability combined with agile business support so your team can focus exclusively on scaling.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/85 bg-white p-7 sm:p-8 shadow-[0_4px_20px_rgba(10,31,102,0.03)] hover:shadow-[0_16px_36px_rgba(30,91,255,0.09)] hover:border-[#1E5BFF]/50 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Background Watermark Number */}
                <span className="absolute right-6 top-4 text-4xl font-black text-slate-100/90 select-none group-hover:text-blue-50 transition-colors">
                  {item.num}
                </span>

                <div>
                  {/* Icon Box */}
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/80 text-[#1E5BFF] border border-blue-100/80 shadow-xs transition-all duration-300 group-hover:bg-[#0A1F66] group-hover:text-white group-hover:border-[#0A1F66]">
                    <Icon size={26} strokeWidth={2.2} />
                  </div>

                  {/* Micro Highlight Badge */}
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#B45309] mb-1.5">
                    {item.highlight}
                  </p>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0A1F66] group-hover:text-[#1E5BFF] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Border Accent */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-[#1E5BFF] transition-colors">
                  <Zap className="w-3.5 h-3.5 text-[#F4A900]" />
                  <span>Enterprise Grade Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}