import Link from "next/link";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A1F66] via-[#1447C5] to-[#1E5BFF] px-5 py-12 text-center text-white shadow-2xl sm:rounded-3xl sm:px-8 sm:py-16 lg:rounded-[32px] lg:px-16 lg:py-20">

          {/* Decorative Background */}
          <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:h-64 sm:w-64" />

          <div className="absolute -bottom-28 -right-24 h-56 w-56 rounded-full bg-[#C8942C]/20 blur-3xl sm:h-72 sm:w-72" />

          {/* Badge */}
          <div className="relative z-10 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-[#C8942C]/30 bg-[#C8942C]/10 px-3 py-2 text-center sm:px-5">
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#C8942C]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#F7D78A] sm:text-xs sm:tracking-[0.25em]">
              Let's Build Together
            </span>
          </div>

          {/* Heading */}
          <h2 className="relative z-10 mx-auto mt-6 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:mt-8 sm:text-4xl md:text-5xl lg:text-6xl">
            Ready to Find the Perfect Workspace

            <span className="mt-2 block text-[#F7D78A]">
              for Your Business?
            </span>
          </h2>

          {/* Description */}
          <p className="relative z-10 mx-auto mt-6 max-w-3xl text-base leading-7 text-blue-100 sm:mt-8 sm:text-lg sm:leading-8 md:text-xl">
            Whether you're a startup, growing team, or enterprise,
            i-VANTAGE Business Hub helps you discover premium coworking
            spaces, managed offices, commercial properties, and business
            support services across India.
          </p>

          {/* Buttons */}
          <div className="relative z-10 mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:justify-center">

            <Link
              href="/contact"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:min-w-[220px]"
              >
                Book a Free Consultation
              </Button>
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white bg-white/10 text-white hover:border-white hover:bg-white hover:text-[#0A1F66] sm:min-w-[220px]"
              >
                Explore Services
              </Button>
            </Link>

          </div>

        </div>
      </Container>
    </section>
  );
}