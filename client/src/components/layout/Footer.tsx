import Link from "next/link";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

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
    <footer className="mt-24 border-t-4 border-[#D89A17] bg-white">

      <Container>

        <div className="grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}

          <div>

            <Logo width={220} height={70} />

            <p className="mt-6 leading-7 text-slate-600">
              I-Vantage Business Hub provides premium coworking
              spaces and 100+ business support services to help
              startups, entrepreneurs and enterprises work,
              connect and grow.
            </p>

            <div className="mt-8 flex gap-4">

              <Link
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1E5BFF] text-white transition-all duration-300 hover:bg-[#D89A17]"
              >
                <FaFacebookF />
              </Link>

              <Link
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1E5BFF] text-white transition-all duration-300 hover:bg-[#D89A17]"
              >
                <FaInstagram />
              </Link>

              <Link
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1E5BFF] text-white transition-all duration-300 hover:bg-[#D89A17]"
              >
                <FaLinkedinIn />
              </Link>

            </div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="mb-6 text-xl font-bold text-[#0A1F66]">
              Quick Links
            </h3>

            <div className="space-y-4">

              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-slate-600 transition hover:translate-x-1 hover:text-[#1E5BFF]"
                >
                  {item.label}
                </Link>
              ))}

            </div>

          </div>

          {/* Services */}

          <div>

            <h3 className="mb-6 text-xl font-bold text-[#0A1F66]">
              Business Services
            </h3>

            <div className="space-y-4">

              {FOOTER_SERVICES.map((service) => (
                <p
                  key={service}
                  className="cursor-pointer text-slate-600 transition hover:translate-x-1 hover:text-[#1E5BFF]"
                >
                  {service}
                </p>
              ))}

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-6 text-xl font-bold text-[#0A1F66]">
              Contact Us
            </h3>

            <div className="space-y-5">

              <div className="flex gap-4">

                <MapPin
                  className="mt-1 text-[#D89A17]"
                  size={20}
                />

                <p className="text-slate-600">
                  I-Vantage Business Hub
                  <br />
                  Gurugram, Haryana
                </p>

              </div>

              <div className="flex gap-4">

                <Phone
                  className="text-[#D89A17]"
                  size={20}
                />

                <p className="text-slate-600">
                  +91 99078 00600
                </p>

              </div>

              <div className="flex gap-4">

                <Mail
                  className="text-[#D89A17]"
                  size={20}
                />

                <p className="text-slate-600">
                  info@i-vantage.in
                </p>

              </div>

              <div className="flex gap-4">

                <Clock
                  className="text-[#D89A17]"
                  size={20}
                />

                <p className="text-slate-600">
                  Monday - Saturday
                  <br />
                  09:00 AM - 07:00 PM
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-8 text-sm md:flex-row">

          <p className="text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-[#0A1F66]">
              I-Vantage Business Hub
            </span>
            . All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">

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