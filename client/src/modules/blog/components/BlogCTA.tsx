import Link from "next/link";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function BlogCTA() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#0A1F66] p-8 sm:p-12 lg:p-16 text-white shadow-xl">
      {/* Decorative Glow Elements */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#1E5BFF]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#C8942C]/20 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-900/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#D89A17]">
          Accelerate Your Enterprise
        </span>

        {/* Headline */}
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-4xl sm:leading-tight">
          Establish Your Business Presence with i-VANTAGE
        </h2>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-blue-100 sm:text-base sm:leading-7">
          Looking for a verified Virtual Office for GST & Company Registration in Gurgaon, or an enterprise Coworking Space at Welldone Tech Park? Let our business architects assist you today.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/services">
            <Button className="bg-[#1E5BFF] text-white hover:bg-[#1546CC]">
              Explore Business Solutions
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>

          <Link href="/contact">
            <Button
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-[#0A1F66] backdrop-blur-sm"
            >
              Talk to an Advisor
            </Button>
          </Link>
        </div>

        {/* Quick Contact Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-blue-800/80 pt-6 text-xs text-blue-200">
          <a
            href="tel:+919907800600"
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Phone size={14} className="text-[#C8942C]" />
            +91 99078 00600
          </a>

          <span>•</span>

          <a
            href="https://wa.me/919907800600"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <MessageCircle size={14} className="text-emerald-400" />
            WhatsApp Direct Desk
          </a>
        </div>
      </div>
    </section>
  );
}
