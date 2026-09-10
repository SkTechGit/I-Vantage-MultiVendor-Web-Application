import Image from "next/image";
import { CheckCircle2, Building, ShieldCheck, Wifi, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";

export default function AboutWhoWeAre() {
  const highlights = [
    "Professional business address in a premier IT/commercial corridor",
    "Comprehensive setup: managed offices, coworking, private cabins & virtual office",
    "24/7 access tailored for conventional businesses and extended shift teams",
    "Enterprise-grade connectivity, full-load power backup & centralized AC",
    "Full shared workplace amenities: reception, housekeeping, pantry & parking",
  ];

  return (
    <section className="border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Visual Showcase */}
          <div className="order-2 lg:order-1 lg:col-span-6">
            <div className="relative">
              {/* Main large image */}
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl sm:rounded-3xl">
                <Image
                  src="/images/workspace/openseat1.webp"
                  alt="i-VANTAGE Dedicated Workstations Area in Gurgaon"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Secondary overlapping badge */}
              <div className="absolute -bottom-6 -right-3 max-w-[260px] rounded-2xl border border-blue-100 bg-white/95 p-4 backdrop-blur-md shadow-xl sm:-bottom-8 sm:-right-6 sm:max-w-[300px] sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF]">
                    <Building size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Managed Workspace
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#0A1F66]">
                      Welldone Tech Park, Sector 48
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Sohna Road, Gurgaon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            {/* Section label */}
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1E5BFF]">
              <Sparkles size={14} />
              <span>Who We Are</span>
            </div>

            {/* Heading */}
            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
              A Workspace Built for Modern Businesses
            </h2>

            {/* Paragraphs */}
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
              i-VANTAGE is positioned around flexible and practical business
              workspace solutions. Our workspace offering at Welldone Tech
              Park, Sector 48, Sohna Road, Gurgaon provides businesses with a
              professional address, flexible workspace options, reliable
              infrastructure, and shared workplace amenities.
            </p>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
              The current workspace setup includes managed office solutions,
              dedicated coworking workstations, private cabins, executive/boss
              cabins, meeting rooms, a 20-seater conference room, and virtual
              office services.
            </p>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
              The workplace is designed to support both conventional businesses
              and teams requiring extended working hours, with 24/7 member
              access, high-speed internet, and full-load power backup.
            </p>

            {/* Feature Checklist */}
            <ul className="mt-6 space-y-3">
              {highlights.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2
                    size={18}
                    className="mt-1 shrink-0 text-[#1E5BFF]"
                  />
                  <span className="text-sm font-medium text-slate-700 sm:text-base">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
