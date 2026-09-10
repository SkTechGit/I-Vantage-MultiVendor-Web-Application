import Link from "next/link";
import {
  Scale,
  Calculator,
  UserCheck,
  TrendingUp,
  Megaphone,
  Cpu,
  Compass,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

interface BusinessSupportItem {
  id: string;
  title: string;
  icon: typeof Scale;
  description: string;
}

const businessServices: BusinessSupportItem[] = [
  {
    id: "legal-compliance",
    title: "Legal & Compliance",
    icon: Scale,
    description:
      "Business-related legal guidance and regulatory compliance support to help you operate safely and stay up to date.",
  },
  {
    id: "accounting-taxation",
    title: "Accounting & Taxation",
    icon: Calculator,
    description:
      "Structured assistance for company bookkeeping, financial reporting, and periodic taxation requirements.",
  },
  {
    id: "hr-recruitment",
    title: "HR & Recruitment",
    icon: UserCheck,
    description:
      "Support for talent acquisition, hiring workflows, and workforce-related operational requirements.",
  },
  {
    id: "funding-support",
    title: "Business Funding Support",
    icon: TrendingUp,
    description:
      "Assistance around business funding pathways, financial documentation, and growth capital exploration.",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    icon: Megaphone,
    description:
      "Digital presence, brand visibility, and performance marketing support to help scale customer acquisition.",
  },
  {
    id: "ai-automation",
    title: "AI & Automation",
    icon: Cpu,
    description:
      "Technology-led solutions and smart automated workflows to optimize business operations and internal efficiency.",
  },
  {
    id: "business-consulting",
    title: "Business Consulting",
    icon: Compass,
    description:
      "Strategic business guidance, operational mentorship, and structured advisory support for startups and SMEs.",
  },
  {
    id: "commercial-real-estate",
    title: "Commercial Real Estate",
    icon: Building,
    description:
      "Commercial property advisory and workspace leasing solutions tailored to growing enterprise requirements.",
  },
];

export default function BusinessSupportGrid() {
  return (
    <section id="business-support" className="border-t border-slate-100 bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#1E5BFF]">
            <Sparkles size={14} />
            <span>Beyond Workspace</span>
          </div>

          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
            Business Support Services
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            i-VANTAGE&apos;s broader Business Hub positioning brings essential
            business-support categories together under one roof, helping your
            company minimize friction and scale effectively.
          </p>
        </div>

        {/* 8 Services Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {businessServices.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-7"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] transition-colors group-hover:bg-[#0A1F66] group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#0A1F66] transition-colors group-hover:text-[#1E5BFF]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm sm:leading-6">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] transition-all group-hover:gap-2.5"
                  >
                    <span>Enquire About Service</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
