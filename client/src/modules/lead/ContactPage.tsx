import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

const contactDetails = [
  {
    title: "Call Us",
    description: "Speak directly with our team",
    value: "+91 99078 00600",
    secondaryValue: "+91 78359 91750",
    href: "tel:+919907800600",
    secondaryHref: "tel:+917835991750",
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
    value:
      "Unit 213-14, Welldone Tech Park, Sector 48, Sohna Road, Gurugram, Haryana",
    href: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14035.292126011822!2d77.02529949086778!3d28.424596283426347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d23ac952fe5ed%3A0x2d354a104d995c73!2sWelldone%20Techpark!5e0!3m2!1sen!2sin!4v1787210456538!5m2!1sen!2sin",
    icon: MapPin,
  },
  {
    title: "Working Hours",
    description: "We're available during",
    value: "Mon - Fri, 10:00 AM - 07:00 PM",
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
    <main className="overflow-hidden bg-white">
      <Container>
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="py-10 sm:py-14 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <span
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-blue-100
                bg-blue-50
                px-4
                py-1.5
                text-xs
                font-semibold
                text-[#1E5BFF]
                sm:px-5
                sm:py-2
                sm:text-sm
              "
            >
              Contact Us
            </span>

            <h1
              className="
                mt-5
                text-3xl
                font-bold
                leading-[1.15]
                tracking-tight
                text-[#0A1F66]
                sm:mt-6
                sm:text-4xl
                lg:text-5xl
              "
            >
              Let&apos;s Build Your Business Together
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-3xl
                text-sm
                leading-6
                text-slate-600
                sm:mt-6
                sm:text-base
                sm:leading-7
                lg:text-lg
                lg:leading-8
              "
            >
              Whether you&apos;re looking for a workspace, business
              registration, legal support, finance services or mentorship, our
              team is ready to understand your requirements and help you find
              the right solution.
            </p>

            {/* CTA */}
            <div
              className="
                mt-7
                flex
                w-full
                flex-col
                gap-3
                sm:mt-9
                sm:w-auto
                sm:flex-row
                sm:justify-center
                sm:gap-4
              "
            >
              <a
                href="tel:+919907800600"
                className="w-full sm:w-auto"
              >
                <Button className="flex w-full items-center justify-center gap-2 sm:w-auto">
                  <Phone size={18} />
                  <span>99078 00600</span>
                </Button>
              </a>

              <a
                href="tel:+917835991750"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    sm:w-auto
                  "
                >
                  <Phone size={18} />
                  <span>78359 91750</span>
                </Button>
              </a>

              <a
                href="mailto:info@i-vantage.in"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    sm:w-auto
                  "
                >
                  <Mail size={18} />
                  <span>Email Us</span>
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT INFORMATION
        ====================================================== */}
        <section className="pb-12 sm:pb-16 lg:pb-20">
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
              lg:gap-5
            "
          >
            {contactDetails.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  className="
                    group
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:shadow-lg
                    sm:rounded-3xl
                    sm:p-6
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-50
                      text-[#1E5BFF]
                      transition
                      duration-300
                      group-hover:bg-[#1E5BFF]
                      group-hover:text-white
                    "
                  >
                    <Icon size={20} />
                  </div>

                  <h2 className="mt-4 text-base font-bold text-[#0A1F66] sm:text-lg">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {item.description}
                  </p>

                  <p
                    className="
                      mt-3
                      break-words
                      text-sm
                      font-semibold
                      text-slate-700
                      transition
                      group-hover:text-[#1E5BFF]
                      sm:text-base
                    "
                  >
                    {item.value}
                  </p>

                  {item.secondaryValue && (
                    <p
                      className="
                        mt-1
                        text-sm
                        font-semibold
                        text-slate-700
                        transition
                        group-hover:text-[#1E5BFF]
                        sm:text-base
                      "
                    >
                      {item.secondaryValue}
                    </p>
                  )}
                </a>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            HELP SECTION
        ====================================================== */}
        <section
          className="
            grid
            grid-cols-1
            gap-8
            pb-12
            sm:pb-16
            lg:grid-cols-2
            lg:items-center
            lg:gap-16
            lg:pb-20
          "
        >
          {/* Content */}
          <div>
            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-[#1E5BFF]
                sm:text-sm
              "
            >
              How Can We Help?
            </span>

            <h2
              className="
                mt-2
                text-2xl
                font-bold
                leading-tight
                text-[#0A1F66]
                sm:text-3xl
                lg:text-4xl
              "
            >
              Tell Us What Your Business Needs
            </h2>

            <p
              className="
                mt-4
                text-sm
                leading-6
                text-slate-600
                sm:text-base
                sm:leading-7
              "
            >
              From setting up your business to finding the right workspace or
              growing your existing operations, i-VANTAGE Business Hub brings
              multiple business services together under one roof.
            </p>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-slate-600
                sm:text-base
                sm:leading-7
              "
            >
              Contact our team and share your requirements. We&apos;ll help you
              understand the available options and identify the right solution
              for your business.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+919907800600"
                className="w-full sm:w-auto"
              >
                <Button className="flex w-full items-center justify-center gap-2 sm:w-auto">
                  <Phone size={17} />
                  Call Our Team
                </Button>
              </a>

              <a
                href="https://wa.me/919907800600"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  className="flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Services */}
          <div
            className="
              rounded-2xl
              border
              border-slate-100
              bg-slate-50
              p-5
              sm:rounded-3xl
              sm:p-7
              lg:p-8
            "
          >
            <h3 className="text-lg font-bold text-[#0A1F66] sm:text-xl">
              We Can Help With
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {supportAreas.map((area) => (
                <div
                  key={area}
                  className="
                    flex
                    items-start
                    gap-2.5
                    rounded-xl
                    border
                    border-slate-100
                    bg-white
                    p-3
                    text-sm
                    text-slate-700
                    shadow-sm
                    transition
                    hover:border-blue-100
                    hover:shadow-md
                  "
                >
                  <span
                    className="
                      mt-2
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-[#1E5BFF]
                    "
                  />

                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            VISIT US
        ====================================================== */}
        <section
          id="location"
          className="
            mb-12
            overflow-hidden
            rounded-2xl
            bg-[#0A1F66]
            sm:mb-16
            sm:rounded-3xl
            lg:mb-20
          "
        >
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[1fr_1fr]
            "
          >
            {/* Address Content */}
            <div
              className="
                px-5
                py-8
                sm:px-8
                sm:py-10
                lg:px-10
                lg:py-12
              "
            >
              <div className="flex items-center gap-2 text-blue-200">
                <MapPin size={18} />

                <span className="text-sm font-semibold">
                  Visit i-VANTAGE Business Hub
                </span>
              </div>

              <h2
                className="
                  mt-3
                  text-2xl
                  font-bold
                  leading-tight
                  text-white
                  sm:text-3xl
                "
              >
                Let&apos;s Meet &amp; Talk About Your Business
              </h2>

              <p
                className="
                  mt-3
                  max-w-2xl
                  text-sm
                  leading-6
                  text-blue-100
                  sm:text-base
                  sm:leading-7
                "
              >
                Visit us in Gurugram to explore our workspace, discuss your
                requirements and discover how i-VANTAGE can support your
                business.
              </p>

              <p
                className="
                  mt-4
                  text-sm
                  font-medium
                  leading-6
                  text-white
                  sm:text-base
                "
              >
                Unit 213-14, Welldone Tech Park
                <br />
                Sector 48, Sohna Road
                <br />
                Gurugram, Haryana
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="tel:+919907800600"
                  className="w-full sm:w-auto"
                >
                  <Button className="flex w-full items-center justify-center gap-2 sm:w-auto">
                    <Phone size={17} />
                    Call Us
                  </Button>
                </a>

                <a
                  href="tel:+917835991750"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="secondary"
                    className="flex w-full items-center justify-center gap-2 sm:w-auto"
                  >
                    <Phone size={17} />
                    Alternate Number
                  </Button>
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="min-h-[280px] bg-slate-200 sm:min-h-[350px] lg:min-h-full">
              <iframe
                title="i-VANTAGE Business Hub Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14035.292126011822!2d77.02529949086778!3d28.424596283426347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d23ac952fe5ed%3A0x2d354a104d995c73!2sWelldone%20Techpark!5e0!3m2!1sen!2sin!4v1787210456538!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  minHeight: "280px",
                }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="mx-auto max-w-3xl pb-12 text-center sm:pb-16 lg:pb-20">
          <span
            className="
              inline-flex
              items-center
              gap-2
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-[#1E5BFF]
              sm:text-sm
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#1E5BFF]" />
            We&apos;re Here to Help
          </span>

          <h2
            className="
              mt-2
              text-2xl
              font-bold
              text-[#0A1F66]
              sm:text-3xl
              lg:text-4xl
            "
          >
            Have a Question?
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-slate-600
              sm:text-base
              sm:leading-7
            "
          >
            Don&apos;t hesitate to reach out. Our team is ready to help you
            understand your options and get started.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="mailto:info@i-vantage.in"
              className="w-full sm:w-auto"
            >
              <Button className="flex w-full items-center justify-center gap-2 sm:w-auto">
                <Mail size={17} />
                Send Us an Email
                <ArrowRight size={16} />
              </Button>
            </a>

            <a
              href="tel:+919907800600"
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <Phone size={17} />
                Call Us
              </Button>
            </a>
          </div>
        </section>
      </Container>
    </main>
  );
}