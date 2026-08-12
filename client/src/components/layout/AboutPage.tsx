import Link from "next/link";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <section className="overflow-hidden py-8 sm:py-12 lg:py-20">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <span className="inline-flex max-w-full items-center rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-[#1E5BFF] sm:px-5 sm:py-2 sm:text-sm">
            About i-Vantage
          </span>

          {/* Heading */}
          <h1 className="mt-5 text-2xl font-bold leading-[1.2] tracking-tight text-[#0A1F66] sm:mt-6 sm:text-2xl md:text-4xl lg:text-4xl">
            Empowering Businesses to
            <br className="hidden sm:block" />
            <span className="sm:whitespace-nowrap"> Work, Connect &amp; Grow</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-4xl text-sm leading-6 text-slate-600 sm:mt-7 sm:text-base sm:leading-7 md:text-lg md:leading-8">
            i-Vantage Business Hub is a one-stop destination for
            entrepreneurs, startups, SMEs and enterprises looking for
            premium coworking spaces and comprehensive business support
            services. From workspace solutions and virtual offices to
            company registration, finance, HR, legal, technology and
            business consulting, we help businesses build, manage and
            scale with confidence.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <Link href="/services" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                Explore Our Services
              </Button>
            </Link>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}