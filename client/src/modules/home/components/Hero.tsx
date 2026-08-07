"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Search } from "lucide-react";

import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";

const popularServices = [
  "Coworking",
  "Virtual Office",
  "GST Registration",
  "Company Registration",
  "Meeting Room",
];

export default function Hero() {
  return (
    <section className="overflow-hidden py-10 sm:py-14 lg:py-18">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Badge */}
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-blue-100 px-3 py-2 text-xs font-semibold text-[#1E5BFF] sm:px-5 sm:text-sm">
              <Building2 className="shrink-0" size={16} />

              <span>NOT JUST A COWORKING</span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-2xl font-extrabold leading-[1.15] tracking-tight text-[#0A1F66] sm:mt-8 sm:text-4xl md:text-4xl lg:text-6xl">
              100+ Plug &amp; Play{" "}
              <span className="text-[#1E5BFF]">
                Business Support
                <br className="hidden sm:block" /> Services
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
              Everything your business needs under one roof - from Coworking
              Spaces, Virtual Offices, Mentorship, Compliance, Marketing, HR,
              Technology &amp; Growth.
            </p>

            {/* Search */}
            {/* <div className="relative mt-7 w-full max-w-xl sm:mt-10">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 sm:left-5"
                size={20}
              />

              <input
                type="text"
                placeholder="Search workspace or business services..."
                className="h-14 w-full min-w-0 rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm shadow-lg outline-none transition-all placeholder:text-gray-400 focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100 sm:h-16 sm:pl-14 sm:pr-5 sm:text-base lg:text-lg"
              />
            </div> */}

            {/* Popular Services */}
            <div className="mt-5 sm:mt-6">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {popularServices.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-[#0A1F66] sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-7 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
              <Link href="/services" className="w-full sm:w-auto">
                <Button className="flex w-full items-center justify-center gap-2 sm:w-auto">
                  Explore Services
                  <ArrowRight size={18} />
                </Button>
              </Link>

              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Book a Visit
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative mx-auto w-full max-w-[650px] min-w-0 lg:mx-0 lg:-translate-y-10 xl:-translate-y-14">
            {/* Background Glow */}
            <div className="absolute -left-10 top-5 h-32 w-32 rounded-full bg-blue-200 blur-3xl sm:h-40 sm:w-40" />

            <div className="absolute -bottom-5 -right-5 h-40 w-40 rounded-full bg-blue-100 blur-3xl sm:-right-10 sm:bottom-10 sm:h-52 sm:w-52" />

            {/* Image */}
            <div className="relative z-10 overflow-hidden rounded-2xl sm:rounded-3xl">
              <Image
                src="/images/hero.jpg"
                alt="I-Vantage Business Hub"
                width={650}
                height={650}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 650px"
                className="h-auto w-full rounded-2xl object-cover shadow-2xl sm:rounded-3xl"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}