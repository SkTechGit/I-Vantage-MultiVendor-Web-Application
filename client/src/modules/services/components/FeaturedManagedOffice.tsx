import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Users,
} from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

export default function FeaturedManagedOffice() {
  const features = [
    "Turnkey office ready for immediate operational deployment",
    "24/7 member access suited for international & flexible shifts",
    "High-speed enterprise internet & 100% full-load power backup",
    "Centralized air conditioning & comprehensive fire safety",
    "Front-desk reception, professional security & daily housekeeping",
    "Cafeteria & in-house pantry privileges included",
  ];

  const idealFor = [
    "Growing businesses & startups",
    "SMEs scaling their presence",
    "Established regional teams",
    "Companies working with international clients",
  ];

  return (
    <section className="bg-white py-8 sm:py-18 lg:py-22">
      <Container>
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#FDFEFF] via-[#F8FAFC] to-[#F1F6FF] p-4 sm:p-10 lg:p-14 shadow-xl">
          <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Real Workspace Image Visual Anchor */}
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-md">
                  <Image
                    src="/images/workspace/conf1.webp"
                    alt="i-VANTAGE Managed Office Solutions in Welldone Tech Park, Gurgaon"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F66]/65 via-transparent to-transparent" />

                  {/* Corner Badge */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 rounded-xl bg-white/95 p-2.5 sm:p-3.5 backdrop-blur-md shadow-lg sm:bottom-4 sm:left-4 sm:right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1E5BFF]">
                          <Building2 size={16} className="sm:w-4.5 sm:h-4.5" />
                        </div>
                        <div>
                          <p className="text-[11px] sm:text-xs font-bold text-[#0A1F66]">
                            Managed Office Space
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500">
                            Welldone Tech Park, Gurgaon
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-[#1E5BFF]">
                        Turnkey Setup
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Managed Office Content */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-bold text-[#0A1F66]">
                <ShieldCheck size={13} className="text-[#1E5BFF]" />
                <span>Featured Workspace Solution</span>
              </div>

              <h2 className="mt-2.5 sm:mt-3 text-xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-[#0A1F66]">
                Managed Office Solutions
              </h2>

              <p className="mt-2 sm:mt-4 text-xs sm:text-base leading-relaxed text-slate-600 line-clamp-3 sm:line-clamp-none">
                A professional, ready-to-use workspace for businesses that want
                the benefits of a dedicated office without dealing with every
                operational detail themselves. The Welldone Tech Park setup is
                positioned as a managed/turnkey workspace with 24/7 member access,
                high-speed internet, and 100% power backup.
              </p>

              {/* Ideal For Tags */}
              <div className="mt-3.5 sm:mt-5">
                <p className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ideal For:
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5 sm:gap-2">
                  {idealFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-slate-200/80 bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10.5px] sm:text-xs font-medium text-slate-700 shadow-2xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features List */}
              <div className="mt-4 sm:mt-6 border-t border-slate-200/60 pt-3.5 sm:pt-5">
                <p className="text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                  Included Infrastructure:
                </p>
                <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-1.5 sm:gap-2 text-[11px] font-medium text-slate-700 sm:text-[13px]"
                    >
                      <CheckCircle2
                        size={13}
                        className="mt-0.5 shrink-0 text-[#1E5BFF]"
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5 sm:mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Link href="/contact" className="inline-block w-full sm:w-auto">
                  <Button size="sm" className="w-full sm:w-auto py-2.5 text-xs sm:text-sm">
                    <span>Enquire About Managed Offices</span>
                    <ArrowRight size={14} />
                  </Button>
                </Link>
                <a
                  href="tel:+919907800600"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#1E5BFF] hover:underline py-1 sm:py-0"
                >
                  <span>Or Call +91 99078 00600</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
