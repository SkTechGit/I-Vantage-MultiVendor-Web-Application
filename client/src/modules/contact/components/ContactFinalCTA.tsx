import Link from "next/link";
import { ArrowRight, ArrowUp, Phone } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import { contactConfig } from "../constants/contactConfig";

export default function ContactFinalCTA() {
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
              Start Today
            </span>
          </div>

          {/* Heading */}
          <h2 className="relative z-10 mx-auto mt-6 max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:mt-7 sm:text-3xl md:text-4xl lg:text-4xl">
            Ready to Find the Right Space?
          </h2>

          {/* Description */}
          <p className="relative z-10 mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-blue-100 sm:mt-6 sm:text-base sm:leading-8">
            Tell us what your business needs and we&apos;ll help you choose the
            right workspace or business solution.
          </p>

          {/* Buttons */}
          <div className="relative z-10 mt-8 flex flex-col items-center justify-center gap-3.5 sm:mt-10 sm:flex-row sm:gap-4">
            <Link href="/services" className="group w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full justify-center gap-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/20 sm:w-auto"
              >
                Explore Services
                <ArrowRight size={17} strokeWidth={1.85} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>

            <a href="#enquiry-form" className="group w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center gap-2 border-white/40 bg-white/10 text-white transition-all duration-300 hover:bg-white hover:text-[#0A1F66] sm:w-auto"
              >
                <ArrowUp size={16} strokeWidth={1.85} className="transition-transform duration-200 group-hover:-translate-y-1" />
                <span>Enquire Above</span>
              </Button>
            </a>

            <a href={`tel:${contactConfig.phone}`} className="group w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center gap-2 border-white/40 bg-white/10 text-white transition-all duration-300 hover:bg-white hover:text-[#0A1F66] sm:w-auto"
              >
                <Phone size={16} strokeWidth={1.85} className="transition-transform duration-200 group-hover:rotate-12" />
                <span>{contactConfig.displayPhone}</span>
              </Button>
            </a>
          </div>

          {/* Location note */}
          <p className="relative z-10 mt-6 text-xs text-blue-200/80">
            Welldone Tech Park, Sector 48, Sohna Road, Gurgaon &bull; Member
            Access 24/7
          </p>
        </div>
      </Container>
    </section>
  );
}
