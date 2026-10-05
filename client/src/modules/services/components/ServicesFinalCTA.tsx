import Link from "next/link";
import { ArrowRight, Phone, MessageSquare } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

export default function ServicesFinalCTA() {
  return (
    <section className="bg-white py-10 sm:py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#071F66] via-[#0A1F66] to-[#1E5BFF] px-5 py-8 text-center text-white shadow-2xl sm:rounded-3xl sm:px-10 sm:py-18 lg:rounded-[32px] lg:px-16 lg:py-22">
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
          <div className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-[#C8942C]/40 bg-[#C8942C]/10 px-3 py-1 shadow-xs sm:px-4 sm:py-1.5">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#F7D78A]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F7D78A] sm:text-xs">
              Get Started Today
            </span>
          </div>

          {/* Heading */}
          <h2 className="relative z-10 mx-auto mt-4 max-w-3xl text-xl font-bold leading-tight tracking-tight sm:mt-7 sm:text-3xl md:text-4xl">
            Ready to Find the Right Workspace or Business Solution?
          </h2>

          {/* Description */}
          <p className="relative z-10 mx-auto mt-2.5 max-w-2xl text-xs sm:text-base leading-relaxed text-blue-100 sm:mt-6 sm:leading-8">
            Speak with our team to explore office configurations, check seat
            availability, schedule a personalized walkthrough, or consult on
            business support services tailored to your operations.
          </p>

          {/* Buttons: 2-column side-by-side on mobile, centered row on desktop */}
          <div className="relative z-10 mt-6 grid grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-4 sm:mt-10">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs sm:text-sm sm:size-lg justify-center py-2.5 sm:py-3.5"
              >
                <span>Talk to Team</span>
                <ArrowRight size={14} />
              </Button>
            </Link>

            <a href="tel:+919907800600" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-white/40 bg-white/10 text-white hover:bg-white hover:text-[#0A1F66] text-xs sm:text-sm sm:size-lg justify-center py-2.5 sm:py-3.5"
              >
                <Phone size={14} />
                <span>Call Now</span>
              </Button>
            </a>
          </div>

          {/* Quick note */}
          <p className="relative z-10 mt-4 sm:mt-6 text-[11px] sm:text-xs text-blue-200/80">
            Welldone Tech Park, Sector 48, Sohna Road, Gurgaon &bull; 24/7 Member
            Access
          </p>
        </div>
      </Container>
    </section>
  );
}
