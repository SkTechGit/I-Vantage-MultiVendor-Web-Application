import { ArrowDown, Navigation, Sparkles } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import { contactConfig } from "../constants/contactConfig";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-[#F5F9FF] via-white to-white py-14 sm:py-20 lg:py-24">
      {/* Subtle ambient blur glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-40 h-72 w-72 rounded-full bg-amber-50/40 blur-3xl"
      />

      <Container>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/80 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#1E5BFF] shadow-2xs">
            <Sparkles size={13} />
            <span>CONTACT i-VANTAGE</span>
          </div>

          {/* Main Heading */}
          <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-[#0A1F66] sm:text-4xl md:text-5xl lg:text-[52px]">
            Let&apos;s Build Your Business Together
          </h1>

          {/* Supporting Copy */}
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
            Whether you need a professional workspace, virtual office, private
            cabin, meeting room or business support service, the i-VANTAGE team
            is here to help.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
            <a href="#enquiry-form" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                <span>Talk to Us</span>
                <ArrowDown size={16} />
              </Button>
            </a>

            <a
              href={contactConfig.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Navigation size={16} />
                <span>Get Directions</span>
              </Button>
            </a>
          </div>

          {/* Trust strip badge */}
          <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:text-sm">
            <span>Workspace</span>
            <span className="text-[#C8942C]">&bull;</span>
            <span>Business Support</span>
            <span className="text-[#C8942C]">&bull;</span>
            <span>Professional Services</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
