import Link from "next/link";

import Container from "@/components/common/Container";

const termsDesks = [
  {
    title: "Business Setup Desk",
    description:
      "All the services that are required for setting up a new Business.",
    services: 9,
    href: "/terms-of-use/business-setup-desk",
  },
  {
    title: "Legal Desk",
    description:
      "Complete legal support for contracts, documentation, business compliance, registrations, and other legal requirements.",
    services: 9,
    href: "/terms-of-use/legal-desk",
  },
  {
    title: "Technology Desk",
    description:
      "Complete technology support for software, websites, IT solutions, automation, cybersecurity, and digital business needs.",
    services: 10,
    href: "/terms-of-use/technology-desk",
  },
  {
    title: "Workspace & Administration Desk",
    description:
      "Complete support for office setup, workspace management, administration, facilities, and day-to-day business operations.",
    services: 9,
    href: "/terms-of-use/workspace-administration-desk",
  },
  {
    title: "Business Growth Desk",
    description:
      "Strategic support to expand your business through sales, partnerships, market opportunities, networking, and growth solutions.",
    services: 13,
    href: "/terms-of-use/business-growth-desk",
  },
  {
    title: "Finance Desk",
    description: "Finance services and business financial support.",
    services: 8,
    href: "/terms-of-use/finance-desk",
  },
  {
    title: "Marketing Desk",
    description:
      "Strategic marketing support to build your brand, reach the right audience, generate leads, and accelerate business growth.",
    services: 16,
    href: "/terms-of-use/marketing-desk",
  },
  {
    title: "Customer Support Desk",
    description:
      "Dedicated assistance for customer queries, issue resolution, service requests, and ongoing support to ensure a smooth and satisfying customer experience.",
    services: 0,
    href: "/terms-of-use/customer-support",
  },
  {
    title: "Premium Services Desk",
    description:
      "Premium Services Desk provides personalized, high-quality support for businesses and professionals, helping manage essential requests, administrative tasks, client coordination, and business services efficiently.",
    services: 0,
    href: "/terms-of-use/premium-services-desk",
  },
  {
    title: "Human Resources Desk",
    description:
      "Complete HR support for recruitment, payroll, employee management, policies, and workplace compliance.",
    services: 9,
    href: "/terms-of-use/hr-desk",
  },
];

export default function TermsOfUsePage() {
  return (
    <main className="bg-slate-50">
      {/* Header */}
      <section className="border-b bg-white">
        <Container>
          <div className="py-14 sm:py-16 lg:py-20">
            <p className="mb-3 text-sm font-semibold tracking-wider text-[#1E5BFF]">
              i-VANTAGE Business Hub
            </p>

            <h1 className="max-w-4xl text-3xl font-bold leading-tight text-[#0A1F66] sm:text-4xl lg:text-5xl">
              Terms of Use
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Please select the desk below to view the applicable Terms of
              Use for its services.
            </p>
          </div>
        </Container>
      </section>

      {/* Desk Cards */}
      <section>
        <Container>
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {termsDesks.map((desk) => (
                <Link
                  key={desk.title}
                  href={desk.href}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-7"
                >
                  <div className="flex flex-1 flex-col">
                    <h2 className="text-xl font-bold text-[#0A1F66]">
                      {desk.title}
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {desk.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-sm font-medium text-slate-500">
                        {desk.services}{" "}
                        {desk.services === 1 ? "Service" : "Services"}
                      </span>

                      <span className="text-sm font-semibold text-[#1E5BFF] transition-transform group-hover:translate-x-1">
                        View Terms →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}