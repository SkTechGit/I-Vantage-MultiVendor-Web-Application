"use client";

import Link from "next/link";
import { useState } from "react";
import Container from "@/components/common/Container";
import { Service } from "@/modules/service/service.types";
import LeadForm from "@/modules/home/components/LeadForm";
import { Sparkles, ArrowRight, ShieldCheck, PhoneCall } from "lucide-react";

export default function CTASection() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  return (
    <section className="relative py-8 sm:py-12 overflow-hidden">
      <Container>
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0A1F66] via-[#0E2A84] to-[#1E5BFF] px-5 py-7 sm:px-8 sm:py-9 text-center text-white shadow-xl border border-blue-400/20">
          {/* Subtle Ambient Lighting Orbs */}
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#F4A900]/15 blur-2xl pointer-events-none" />

          {/* Eyebrow Badge */}
          <div className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-white/10 px-3 py-1 text-center backdrop-blur-sm shadow-xs mb-3">
            <Sparkles className="w-3 h-3 text-[#F4A900]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FDE68A]">
              Workspace Advisory
            </span>
          </div>

          {/* Heading */}
          <h2 className="relative z-10 mx-auto max-w-2xl text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tight text-white">
            Ready to Find the Perfect Workspace{" "}
            <span className="text-[#F4A900]">
              for Your Growing Team?
            </span>
          </h2>

          {/* Description */}
          <p className="relative z-10 mx-auto mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-blue-100/90">
            From single private cabins in Sector 48 to 100+ seat enterprise managed floors across DLF Cyber City & Sohna Road — get direct-operator rates with zero brokerage.
          </p>

          {/* High-Converting CTA Buttons */}
          <div className="relative z-10 mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedServices([]);
                setIsLeadFormOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#F4A900] hover:bg-[#e09b00] text-[#0A1F66] text-xs font-black shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>Schedule Free Workspace Tour</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20 transition-all active:scale-95"
            >
              <span>Explore Corporate Services</span>
            </Link>
          </div>

          {/* Trust Guarantees Row */}
          <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-5 text-[11px] font-semibold text-blue-200">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F4A900]" />
              <span>Zero Brokerage Direct Partner Rates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#F4A900]" />
              <span>Dedicated Relationship Manager</span>
            </div>
          </div>
        </div>

        {/* Lead Form Modal */}
        <LeadForm
          open={isLeadFormOpen}
          services={selectedServices}
          onRemoveService={(serviceId) => {
            setSelectedServices((prev) =>
              prev.filter((service) => service._id !== serviceId)
            );
          }}
          onClose={() => setIsLeadFormOpen(false)}
          onSuccess={() => {
            setSelectedServices([]);
            setIsLeadFormOpen(false);
          }}
        />
      </Container>
    </section>
  );
}