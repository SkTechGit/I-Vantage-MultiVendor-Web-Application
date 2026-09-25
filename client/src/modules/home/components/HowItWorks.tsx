import Container from "@/components/common/Container";
import {
  Search,
  MousePointerClick,
  FileCheck,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Discover Spaces",
    description: "Browse verified private suites, shared desks, and boardrooms across Gurugram's prime hubs.",
    badge: "Browse & Compare",
  },
  {
    step: "02",
    icon: MousePointerClick,
    title: "Select Services",
    description: "Tailor desk capacity, required amenities, and bundled corporate support solutions.",
    badge: "Custom Configuration",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Direct Zero Brokerage",
    description: "Submit inquiry directly with partner-guaranteed transparent rates and zero middleman markup.",
    badge: "Guaranteed Pricing",
  },
  {
    step: "04",
    icon: Building2,
    title: "Move-In & Scale",
    description: "Dedicated i-VANTAGE relationship manager confirms your booking within 60 minutes.",
    badge: "1-Hour Onboarding SLA",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20 sm:py-24 bg-white overflow-hidden border-t border-slate-100">
      {/* Subtle Glow Accents */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-64 bg-gradient-to-b from-blue-50/40 to-transparent pointer-events-none" />

      <Container>
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#0A1F66] bg-blue-50 border border-blue-100 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#F4A900]" />
            <span>Effortless Onboarding Workflow</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0A1F66] tracking-tight leading-tight">
            How i-VANTAGE{" "}
            <span className="bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#1E5BFF] bg-clip-text text-transparent">
              Powers Your Workspace
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From initial search to same-day access, experience India's most streamlined corporate workspace and business support journey.
          </p>
        </div>

        {/* Steps Grid with Progressive Connecting Line */}
        <div className="relative mx-auto mt-12 max-w-6xl">
          {/* Subtle connecting gradient line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] -translate-y-12 bg-gradient-to-r from-[#0A1F66]/20 via-[#1E5BFF]/30 to-[#F4A900]/30 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(10,31,102,0.03)] hover:shadow-[0_16px_32px_rgba(30,91,255,0.08)] hover:border-[#1E5BFF]/40 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Watermark Step Number */}
                  <span className="absolute right-5 top-4 text-4xl font-black text-slate-100 select-none transition-colors group-hover:text-blue-50">
                    {item.step}
                  </span>

                  <div>
                    {/* Icon Badge */}
                    <div className="relative mb-6 inline-flex">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/80 text-[#1E5BFF] border border-blue-100/80 shadow-xs transition-all duration-300 group-hover:bg-[#0A1F66] group-hover:text-white group-hover:border-[#0A1F66]">
                        <Icon size={26} strokeWidth={2.2} />
                      </div>
                      <span className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1E5BFF] text-[10px] font-black text-white shadow-sm">
                        {index + 1}
                      </span>
                    </div>

                    {/* Step Micro-Badge */}
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#B45309] mb-1.5">
                      {item.badge}
                    </p>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-[#0A1F66] group-hover:text-[#1E5BFF] transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Indicator */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-[#1E5BFF] transition-colors">
                    <span>Phase {item.step}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}