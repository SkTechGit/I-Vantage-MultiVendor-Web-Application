import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Building,
  Navigation,
} from "lucide-react";
import Container from "@/components/common/Container";

export default function AboutLocation() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1E5BFF] sm:text-xs">
            Our Location
          </p>

          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-[#0A1F66] sm:mt-3 sm:text-3xl lg:text-4xl">
            Strategically Located in Gurgaon
          </h2>

          <p className="mt-3.5 text-sm leading-relaxed text-slate-600 sm:text-base">
            Situated on Sohna Road in Sector 48, Welldone Tech Park offers
            seamless connectivity across Gurugram, Golf Course Extension, NH-48,
            and Cyber City.
          </p>
        </div>

        {/* 2-Column: Info & Map */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          {/* Left Column: Address & Details Cards */}
          <div className="flex flex-col justify-between space-y-4 lg:col-span-5">
            {/* Address Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF]">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A1F66]">
                    Welldone Tech Park
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    Unit No. 213–14, 2nd Floor
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    Sector 48, Sohna Road, Gurgaon, Haryana – 122001, India
                  </p>
                  <span className="mt-3 inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    ASW (Asset Sense Workspaces)
                  </span>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF]">
                  <Clock size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#0A1F66]">
                    Operating Hours
                  </h3>
                  <div>
                    <span className="text-xs font-semibold text-[#1E5BFF]">
                      Member Access:
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      24/7 Access (All Days)
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500">
                      Support &amp; Desk Hours:
                    </span>
                    <p className="text-sm font-medium text-slate-700">
                      Monday–Saturday, 10:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs sm:p-7">
              <h3 className="text-sm font-bold text-[#0A1F66]">
                Direct Contact &amp; Enquiries
              </h3>
              <div className="mt-3 space-y-2.5">
                <a
                  href="tel:+919907800600"
                  className="flex items-center gap-3 text-xs font-medium text-slate-700 transition hover:text-[#1E5BFF] sm:text-sm"
                >
                  <Phone size={16} className="text-[#1E5BFF]" />
                  <span>+91 9907800600</span>
                </a>
                <a
                  href="mailto:info@assetsense.in"
                  className="flex items-center gap-3 text-xs font-medium text-slate-700 transition hover:text-[#1E5BFF] sm:text-sm"
                >
                  <Mail size={16} className="text-[#1E5BFF]" />
                  <span>info@assetsense.in</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-md lg:col-span-7">
            <div className="relative h-80 w-full sm:h-96 lg:h-full min-h-[360px]">
              <iframe
                title="i-VANTAGE Business Hub at Welldone Tech Park Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14035.292126011822!2d77.02529949086778!3d28.424596283426347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d23ac952fe5ed%3A0x2d354a104d995c73!2sWelldone%20Techpark!5e0!3m2!1sen!2sin!4v1787210456538!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
