"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Search,
} from "lucide-react";

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
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Container className="grid min-h-[88vh] items-center gap-16 py-16 lg:grid-cols-2">

        {/* Left Content */}

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-[#1E5BFF]">
            <Building2 size={16} />

           NOT JUST A COWORKING
          </div>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-[#0A1F66] lg:text-6xl">
            100+ Plug & Play{" "}
            <span className="text-[#1E5BFF]">
             Business Support 
              <br />
              Services
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Everything your business needs under one roof - from Coworking Spaces,
            Virtual Offices, Mentorship, Compliance, Marketing, HR & Technology.
          </p>

          {/* Search */}

          <div className="relative mt-10 max-w-xl">

            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={22}
            />

            <input
              type="text"
              placeholder="Search workspace or business services..."
              className="h-16 w-full rounded-2xl border border-gray-200 bg-white pl-14 pr-5 text-lg shadow-lg outline-none transition-all focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* Popular Services */}

          <div className="mt-6 flex flex-wrap gap-3">

            {popularServices.map((service) => (
              <span
                key={service}
                className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-[#0A1F66]"
              >
                {service}
              </span>
            ))}

          </div>

          {/* Buttons */}

          <div className="mt-10 flex flex-wrap gap-4">

            <Link href="/services">

              <Button className="flex items-center gap-2">

                Explore Services

                <ArrowRight size={18} />

              </Button>

            </Link>

            <Link href="/contact">

              <Button variant="outline">

                Book a Visit

              </Button>

            </Link>

          </div>

        </div>

        {/* Right Image */}

        <div className="relative">

          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-blue-200 blur-3xl" />

          <div className="absolute -right-10 bottom-10 h-52 w-52 rounded-full bg-blue-100 blur-3xl" />

          <Image
            src="/images/hero.jpg"
            alt="I-Vantage Business Hub"
            width={650}
            height={650}
            priority
            className="relative z-10 rounded-3xl shadow-2xl"
          />

        </div>

      </Container>
    </section>
  );
}