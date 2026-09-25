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
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1F66] via-[#0E2A84] to-[#1E5BFF] px-6 py-14 text-center text-white shadow-2xl sm:rounded-4xl sm:px-12 sm:py-20 lg:px-16 border border-blue-400/20">
          {/* Subtle Ambient Lighting Orbs */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[#F4A900]/15 blur-3xl pointer-events-none" />

          {/* Architectural Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          {/* Eyebrow Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/10 px-4 py-1.5 text-center backdrop-blur-sm shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FDE68A] sm:text-xs">
              Tailored Enterprise Workspace Consultation
            </span>
          </div>

          {/* Heading */}
          <h2 className="relative z-10 mx-auto mt-6 max-w-3xl text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
            Ready to Find the Perfect Workspace{" "}
            <span className="text-[#F4A900]">
              for Your Growing Team?
            </span>
          </h2>

          {/* Description */}
          <p className="relative z-10 mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-blue-100/90">
            From single private cabins in Sector 48 to 100+ seat enterprise managed floors across DLF Cyber City and Golf Course Road — get direct-operator rates with zero brokerage.
          </p>

          {/* High-Converting CTA Buttons */}
          <div className="relative z-10 mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => {
                setSelectedServices([]);
                setIsLeadFormOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#F4A900] hover:bg-[#e09b00] text-[#0A1F66] text-xs sm:text-sm font-black shadow-xl shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>Schedule Free Workspace Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="#serviceSection"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-sm border border-white/20 transition-all active:scale-95"
            >
              <span>Explore Corporate Services</span>
            </Link>
          </div>

          {/* Trust Guarantees Row */}
          <div className="relative z-10 mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-blue-200">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F4A900]" />
              <span>Zero Brokerage Direct Partner Rates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#F4A900]" />
              <span>Dedicated 1-Hour SLA Relationship Manager</span>
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