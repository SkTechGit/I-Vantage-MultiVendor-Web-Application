import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

const contactDetails = [
  {
    title: "Call Us",
    description: "Speak directly with our team",
    value: "+91 99078 00600",
    href: "tel:+919907800600",
    icon: Phone,
  },
  {
    title: "Email Us",
    description: "Send us your requirements",
    value: "info@i-vantage.in",
    href: "mailto:info@i-vantage.in",
    icon: Mail,
  },
  {
    title: "Visit Us",
    description: "Come and explore our workspace",
    value: "Gurugram, Haryana",
    href: "#location",
    icon: MapPin,
  },
  {
    title: "Working Hours",
    description: "We're available during",
    value: "Mon - Sat, 09:00 AM - 07:00 PM",
    href: "#",
    icon: Clock,
  },
];

const supportAreas = [
  "Coworking & Private Offices",
  "Virtual Office Solutions",
  "Company & GST Registration",
  "Legal & Compliance Support",
  "Finance & Accounting",
  "HR & Recruitment",
  "Technology & Digital Services",
  "Business Consulting & Mentorship",
];

export default function ContactPage() {
  return (
    <section className="overflow-hidden py-12 sm:py-16 lg:py-24">
      <Container>
        {/* Hero */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-[#1E5BFF] sm:px-5 sm:py-2 sm:text-sm">
            Contact Us
          </span>

          {/* Heading */}
          <h1 className="mt-5 text-3xl font-bold leading-[1.2] tracking-tight text-[#0A1F66] sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Let&apos;s Build Your Business Together
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-6 sm:text-base sm:leading-7 md:text-lg md:leading-8">
            Whether you&apos;re looking for a workspace, business registration,
            legal support, finance services or mentorship, our team is ready
            to understand your requirements and help you find the right
            solution.
          </p>

          {/* Main CTA */}
          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:justify-center sm:gap-4">
            <a href="tel:+919907800600" className="w-full sm:w-auto">
              <Button className="flex w-full items-center justify-center gap-2 sm:w-auto">
                <Phone size={18} />
                +91 99078 00600
              </Button>
            </a>

            <a href="mailto:info@i-vantage.in" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <Mail size={18} />
                info@i-vantage.in
              </Button>
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {contactDetails.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg sm:rounded-3xl sm:p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] sm:h-11 sm:w-11">
                    <Icon size={20} />
                  </div>

                  <h2 className="mt-4 text-base font-bold text-[#0A1F66] sm:text-lg">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {item.description}
                  </p>

                  <p className="mt-3 break-words text-sm font-semibold text-slate-700 transition group-hover:text-[#1E5BFF] sm:text-base">
                    {item.value}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 lg:mt-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Content */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#1E5BFF] sm:text-sm">
              How Can We Help?
            </span>

            <h2 className="mt-2 text-2xl font-bold leading-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
              Tell Us What Your Business Needs
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              From setting up your business to finding the right workspace or
              growing your existing operations, I-Vantage Business Hub brings
              multiple business services together under one roof.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Contact our team and share your requirements. We&apos;ll help you
              understand the available options and identify the right solution
              for your business.
            </p>
          </div>

          {/* Services */}
          <div className="rounded-2xl bg-slate-50 p-5 sm:rounded-3xl sm:p-7">
            <h3 className="text-lg font-bold text-[#0A1F66] sm:text-xl">
              We Can Help With
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {supportAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-start gap-2 rounded-xl bg-white p-3 text-sm text-slate-700 shadow-sm"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E5BFF]" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visit Us */}
        <div
          id="location"
          className="mt-12 overflow-hidden rounded-2xl bg-[#0A1F66] px-5 py-8 sm:mt-16 sm:rounded-3xl sm:px-8 sm:py-10 lg:mt-20 lg:px-12 lg:py-12"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div>
              <div className="flex items-center gap-2 text-blue-200">
                <MapPin size={18} />
                <span className="text-sm font-semibold">
                  Visit I-Vantage Business Hub
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Let&apos;s Meet &amp; Talk About Your Business
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">
                Visit us in Gurugram to explore our workspace, discuss your
                requirements and discover how I-Vantage can support your
                business.
              </p>

              <p className="mt-3 text-sm font-medium text-white sm:text-base">
                I-Vantage Business Hub · Gurugram, Haryana
              </p>
            </div>

            <div className="shrink-0">
              <Link href="tel:+919907800600" className="block w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  Call Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mx-auto mt-12 max-w-3xl text-center sm:mt-16">
          <h2 className="text-2xl font-bold text-[#0A1F66] sm:text-3xl lg:text-4xl">
            Have a Question?
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Don&apos;t hesitate to reach out. Our team is ready to help you
            understand your options and get started.
          </p>

          <div className="mt-6">
            <a
              href="mailto:info@i-vantage.in"
              className="inline-block w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto">
                Send Us an Email
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}