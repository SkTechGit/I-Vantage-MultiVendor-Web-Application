import Link from "next/link";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

const serviceCategories = [
  {
    title: "Workspace Solutions",
    description:
      "Flexible workspaces designed for freelancers, startups, teams and growing businesses.",
    services: [
      "Coworking Space",
      "Private Cabins",
      "Meeting Rooms",
      "Virtual Office",
    ],
  },
  {
    title: "Business Registration",
    description:
      "Get the support you need to start your business with the right registrations and documentation.",
    services: [
      "Company Registration",
      "LLP Registration",
      "GST Registration",
      "MSME Registration",
    ],
  },
  {
    title: "Finance & Compliance",
    description:
      "Stay organized and compliant with professional financial and regulatory support.",
    services: [
      "Accounting",
      "Taxation",
      "GST Compliance",
      "Financial Support",
    ],
  },
  {
    title: "Legal & Documentation",
    description:
      "Simplify legal processes and documentation with reliable business support.",
    services: [
      "Legal Consultation",
      "Agreements",
      "Business Documentation",
      "Compliance Support",
    ],
  },
  {
    title: "HR & Recruitment",
    description:
      "Build and manage your team with practical HR and recruitment solutions.",
    services: [
      "Recruitment",
      "Payroll Support",
      "HR Consulting",
      "Employee Documentation",
    ],
  },
  {
    title: "Technology & Growth",
    description:
      "Use technology, marketing and business strategy to build and scale your company.",
    services: [
      "Website Development",
      "Digital Marketing",
      "Business Consulting",
      "Technology Support",
    ],
  },
];

const benefits = [
  "100+ business support services",
  "Workspace and business solutions under one roof",
  "Support for startups, SMEs and enterprises",
  "Flexible solutions based on your business needs",
];

export default function ServicesPage() {
  return (
    <section className="overflow-hidden py-12 sm:py-16 lg:py-24">
      <Container>
        {/* Hero Content */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-[#1E5BFF] sm:px-5 sm:py-2 sm:text-sm">
            Business Services
          </span>

          {/* Heading */}
          <h1 className="mt-5 text-3xl font-bold leading-[1.2] tracking-tight text-[#0A1F66] sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
            100+ Business Support Services
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-base sm:leading-7 md:text-lg md:leading-8">
            From coworking spaces and virtual offices to company registration,
            legal compliance, finance, HR and technology support, I-Vantage
            Business Hub helps businesses build, manage and grow under one
            roof.
          </p>

          {/* CTA */}
          <div className="mt-7 flex justify-center sm:mt-9">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                Explore Services on Homepage
              </Button>
            </Link>
          </div>
        </div>

        {/* Service Categories */}
        <div className="mt-14 sm:mt-16 lg:mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-[#0A1F66] sm:text-3xl lg:text-4xl">
              Everything Your Business Needs
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Access essential workspace, compliance, technology and growth
              services without dealing with multiple providers.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {serviceCategories.map((category) => (
              <div
                key={category.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-6"
              >
                <h3 className="text-lg font-bold text-[#0A1F66] sm:text-xl">
                  {category.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {category.services.map((service) => (
                    <li
                      key={service}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E5BFF]" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Why I-Vantage */}
        <div className="mt-14 rounded-3xl bg-[#0A1F66] px-5 py-10 sm:mt-16 sm:px-8 sm:py-12 lg:mt-20 lg:px-12 lg:py-14">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div>
              <span className="text-sm font-semibold text-blue-200">
                WHY I-VANTAGE?
              </span>

              <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                More Than Just a Workspace
              </h2>

              <p className="mt-4 text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">
                We bring workspace, business support and professional services
                together so you can focus on what matters most — building and
                growing your business.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-xl border border-blue-400/20 bg-white/10 p-4 text-sm leading-6 text-white backdrop-blur-sm"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-14 max-w-3xl text-center sm:mt-16">
          <h2 className="text-2xl font-bold text-[#0A1F66] sm:text-3xl lg:text-4xl">
            Ready to Build & Grow Your Business?
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Tell us what your business needs and we&apos;ll help you find the
            right workspace and support services.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                Talk to Our Team
              </Button>
            </Link>

            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}