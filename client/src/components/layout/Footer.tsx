import Link from "next/link";

import { MapPin, Phone, Mail, Clock } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import Container from "../common/Container";
import Logo from "../common/Logo";

import {
  FOOTER_SERVICES,
  NAVIGATION,
} from "@/constants/navigation";

export default function Footer() {
  return (
    <footer className="overflow-hidden border-t border-[#1E5BFF] bg-white">
      <Container>
        {/* Main Footer */}
        <div className="grid gap-9 py-10 sm:gap-10 sm:py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-16">
          {/* Company */}
          <div className="min-w-0">
            {/* Responsive Logo */}
            <div className="w-[140px] sm:w-[170px] lg:w-[190px]">
              <Logo width={220} height={70} />
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-7">
              i-VANTAGE Business Hub provides premium coworking spaces and
              100+ business support services to help startups, entrepreneurs
              and enterprises work, connect and grow.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex gap-3 sm:mt-6 sm:gap-4">
              <Link
                href="https://www.facebook.com/iVANTAGEBusinessHub"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E5BFF] text-sm text-white transition-all duration-300 hover:bg-[#D89A17] sm:h-10 sm:w-10"
              >
                <FaFacebookF />
              </Link>

              <Link
                href="https://www.instagram.com/i_vantage_business_hub/"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E5BFF] text-sm text-white transition-all duration-300 hover:bg-[#D89A17] sm:h-10 sm:w-10"
              >
                <FaInstagram />
              </Link>

              <Link
                href="https://linkedin.com/company/i-vantage-business-hub"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E5BFF] text-sm text-white transition-all duration-300 hover:bg-[#D89A17] sm:h-10 sm:w-10"
              >
                <FaLinkedinIn />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-bold text-[#0A1F66] sm:mb-5 sm:text-lg">
              Quick Links
            </h3>

            <div className="space-y-2.5 sm:space-y-3">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-slate-600 transition hover:translate-x-1 hover:text-[#1E5BFF] sm:text-base"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-base font-bold text-[#0A1F66] sm:mb-5 sm:text-lg">
              Business Services
            </h3>

            <div className="space-y-2.5 sm:space-y-3">
              {FOOTER_SERVICES.map((service) => (
                <p
                  key={service}
                  className="cursor-pointer text-sm text-slate-600 transition hover:translate-x-1 hover:text-[#1E5BFF] sm:text-base"
                >
                  {service}
                </p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-bold text-[#0A1F66] sm:mb-5 sm:text-lg">
              Contact Us
            </h3>

            <div className="space-y-4 sm:space-y-5">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 shrink-0 text-[#D89A17]"
                  size={18}
                />

                <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                  I-Vantage Business Hub
                  <br />
                  Gurugram, Haryana
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <Phone
                  className="shrink-0 text-[#D89A17]"
                  size={18}
                />

                <a
                  href="tel:+919907800600"
                  className="text-sm text-slate-600 transition hover:text-[#1E5BFF] sm:text-base"
                >
                  +91 99078 00600
                </a>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 shrink-0 text-[#D89A17]"
                  size={18}
                />

                <a
                  href="mailto:info@i-vantage.in"
                  className="break-all text-sm text-slate-600 transition hover:text-[#1E5BFF] sm:text-base"
                >
                  info@i-vantage.in
                </a>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <Clock
                  className="mt-0.5 shrink-0 text-[#D89A17]"
                  size={18}
                />

                <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                  Monday - Saturday
                  <br />
                  09:00 AM - 07:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-[#1E5BFF]/30 py-5 sm:py-6 md:flex-row md:items-center md:justify-between">
          {/* Copyright */}
          <p className="text-center text-xs leading-5 text-slate-500 sm:text-sm md:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-[#0A1F66]">
              I-Vantage Business Hub
            </span>
            . All Rights Reserved.
          </p>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs sm:gap-x-6 sm:text-sm md:justify-end">
            <Link
              href="/privacy-policy"
              className="text-slate-500 transition hover:text-[#1E5BFF]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="text-slate-500 transition hover:text-[#1E5BFF]"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/refund-policy"
              className="text-slate-500 transition hover:text-[#1E5BFF]"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}