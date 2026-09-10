import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

export default function AboutFinalCTA() {
  return (
    <section className="bg-white py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071F66] via-[#0A1F66] to-[#1E5BFF] px-6 py-14 text-center text-white shadow-2xl sm:rounded-3xl sm:px-10 sm:py-18 lg:rounded-[32px] lg:px-16 lg:py-22">
          {/* Decorative ambient blur elements */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl sm:h-72 sm:w-72"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#C8942C]/20 blur-3xl sm:h-72 sm:w-72"
          />

          {/* Eyebrow */}
          <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-[#C8942C]/40 bg-[#C8942C]/10 px-4 py-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#F7D78A]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F7D78A] sm:text-xs">
              Get Started Today
            </span>
          </div>

          {/* Heading */}
          <h2 className="relative z-10 mx-auto mt-6 max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:mt-7 sm:text-3xl md:text-4xl lg:text-4xl">
            Build Your Business in the Right Environment.
          </h2>

          {/* Description */}
          <p className="relative z-10 mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-blue-100 sm:mt-6 sm:text-base sm:leading-8">
            Whether you need a dedicated desk, private cabin, managed office,
            meeting space, or professional virtual office setup, i-VANTAGE offers
            flexible workspace options built around practical business needs.
          </p>

          {/* Buttons */}
          <div className="relative z-10 mt-8 flex flex-col items-center justify-center gap-3.5 sm:mt-10 sm:flex-row sm:gap-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Find Your Workspace
                <ArrowRight size={17} />
              </Button>
            </Link>

            <a href="tel:+919907800600" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white/40 bg-white/10 text-white hover:bg-white hover:text-[#0A1F66] sm:w-auto"
              >
                <Phone size={17} />
                <span>+91 9907800600</span>
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
