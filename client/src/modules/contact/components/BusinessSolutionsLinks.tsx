import Link from "next/link";
import {
  Globe,
  Users,
  Armchair,
  DoorOpen,
  Building2,
  Presentation,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/common/Container";

const solutions = [
  {
    title: "Virtual Office",
    description: "Prestigious Welldone Tech Park address & GST registration",
    href: "/services#workspace-solutions",
    icon: Globe,
    badge: "₹11,000/yr",
  },
  {
    title: "Coworking Seats",
    description: "120 dedicated workstations with 24/7 biometric access",
    href: "/services#workspace-solutions",
    icon: Users,
    badge: "₹7,000/mo",
  },
  {
    title: "Dedicated Desk",
    description: "Fixed ergonomic workstation with secure storage lock",
    href: "/services#workspace-solutions",
    icon: Armchair,
    badge: "Flexible",
  },
  {
    title: "Private Cabin",
    description: "Enclosed sound-dampened cabins (1 manager + 2 guests)",
    href: "/services#workspace-solutions",
    icon: DoorOpen,
    badge: "From ₹25,000/mo",
  },
  {
    title: "Managed Office",
    description: "Turnkey customized enterprise office floors and suites",
    href: "/services#workspace-solutions",
    icon: Building2,
    badge: "Turnkey",
  },
  {
    title: "Meeting Room",
    description: "6-seater and 20-seater conference facilities on-demand",
    href: "/services#workspace-solutions",
    icon: Presentation,
    badge: "On-demand",
  },
  {
    title: "GST Registration",
    description: "Full compliance documentation & commercial NOC support",
    href: "/services#business-support",
    icon: FileCheck,
    badge: "Business Support",
  },
];

export default function BusinessSolutionsLinks() {
  return (
    <section className="bg-slate-50/60 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E5BFF]">
            Quick Access
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
            Looking for a Specific Business Solution?
          </h2>
          <p className="mt-3.5 text-sm leading-relaxed text-slate-600 sm:text-base">
            Explore our workspace and business-support solutions designed for
            entrepreneurs, startups, professionals and growing businesses.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          {solutions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100/60 bg-blue-50/80 text-[#1E5BFF] shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:bg-[#1E5BFF] group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/20">
                      <Icon size={20} strokeWidth={1.85} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-[#0A1F66] group-hover:text-[#1E5BFF]">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#1E5BFF] transition-all group-hover:gap-2">
                  <span>Learn More</span>
                  <ArrowRight size={13} strokeWidth={1.85} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
