"use client";
import Link from "next/link";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import { Service } from "@/modules/service/service.types";
import LeadForm from "@/modules/home/components/LeadForm";
import { useState } from "react";

export default function CTASection() {
   const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
      const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  return (
    <section className="py-13 sm:py-26 lg:py-22">
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
          <h2 className="relative z-10 mx-auto mt-6 max-w-4xl text-2xl font-bold leading-tight tracking-tight sm:mt-8 sm:text-2xl md:text-3xl lg:text-3xl">
            Ready to Find the Perfect Workspace

            <span className="mt-2 block text-[#F7D78A]">
              for Your Business?
            </span>
          </h2>

          {/* Description */}
          <p className="relative z-10 mx-auto mt-6 max-w-3xl text-lg leading-7 text-blue-100 sm:mt-8 sm:text-lg sm:leading-8 md:text-lg">
            Whether you're a startup, growing team, or enterprise,
            i-VANTAGE Business Hub helps you discover premium coworking
            spaces, managed offices, commercial properties, and business
            support services across India.
          </p>

          {/* Buttons */}
          <div className="relative z-10 mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:justify-center">
  <Button
    onClick={() => {
      setSelectedServices([]);
      setIsLeadFormOpen(true);
    }}
    size="lg"
    variant="secondary"
    className="w-full px-5 sm:w-auto sm:px-6"
  >
    Book a Free Consultation
  </Button>

  <Link
    href="#serviceSection"
    className="w-full sm:w-auto"
  >
    <Button
      size="lg"
      variant="outline"
      className="
        w-full
        border-white
        bg-white/10
        px-5
        text-white
        hover:border-white
        hover:text-[#0A1F66]
        sm:w-auto
        sm:px-6
      "
    >
      Explore Services
    </Button>
  </Link>
</div>

        </div>
        <LeadForm
                  open={isLeadFormOpen}
                  services={selectedServices}
                  onRemoveService={(serviceId) => {
                    setSelectedServices((prev) =>
                      prev.filter(
                        (service) => service._id !== serviceId
                      )
                    );
                  }}
                  onClose={() => {
                    setIsLeadFormOpen(false);
                  }}
                  onSuccess={() => {
                    setSelectedServices([]);
                    setIsLeadFormOpen(false);
                  }}
                />
      </Container>
    </section>
  );
}