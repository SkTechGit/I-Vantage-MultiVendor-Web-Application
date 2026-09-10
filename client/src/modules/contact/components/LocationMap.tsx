import { MapPin, Navigation, Clock3 } from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import { contactConfig } from "../constants/contactConfig";

export default function LocationMap() {
  return (
    <section id="location" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E5BFF]">
            Strategic Gurgaon Location
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
            Find Us at Welldone Tech Park
          </h2>
          <p className="mt-3.5 text-sm leading-relaxed text-slate-600 sm:text-base">
            Centrally situated on Sohna Road in Sector 48, offering swift
            connectivity to Golf Course Extension Road, NH-48, Subhash Chowk,
            and rapid metro hubs.
          </p>
        </div>

        {/* 2-Column: Details Card & Interactive Map */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          {/* Left Details */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
            {/* Primary Address */}
            <div className="group rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs transition-all duration-300 hover:border-blue-200 hover:shadow-md sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100/60 bg-blue-50/80 text-[#1E5BFF] shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:bg-[#1E5BFF] group-hover:text-white">
                  <MapPin size={21} strokeWidth={1.85} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A1F66]">
                    {contactConfig.brandName}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {contactConfig.address.building}
                  </p>
                  <p className="text-xs font-medium text-slate-700 sm:text-sm">
                    {contactConfig.address.unit}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {contactConfig.address.street}, {contactConfig.address.city}, {contactConfig.address.state} – {contactConfig.address.pincode}
                  </p>
                  <div className="mt-3 inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    {contactConfig.brandDivision}
                  </div>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="group rounded-2xl border border-slate-200/80 bg-[#FDFEFF] p-6 shadow-xs transition-all duration-300 hover:border-blue-200 hover:shadow-md sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100/60 bg-blue-50/80 text-[#1E5BFF] shadow-2xs transition-all duration-300 group-hover:scale-105 group-hover:bg-[#1E5BFF] group-hover:text-white">
                  <Clock3 size={21} strokeWidth={1.85} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#0A1F66]">
                    Operating &amp; Access Timings
                  </h4>
                  <div>
                    <span className="text-xs font-semibold text-[#1E5BFF]">
                      Member Access:
                    </span>
                    <p className="text-sm font-bold text-slate-800">
                      {contactConfig.memberAccess}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500">
                      Reception &amp; Desk Support:
                    </span>
                    <p className="text-sm font-medium text-slate-700">
                      {contactConfig.supportHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions CTA */}
            <div>
              <a
                href={contactConfig.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center gap-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/20"
                >
                  <Navigation size={17} strokeWidth={1.85} className="transition-transform duration-200 group-hover:-rotate-12" />
                  <span>Get Directions &rarr;</span>
                </Button>
              </a>
              <p className="mt-2 text-center text-xs text-slate-500">
                Coordinates: {contactConfig.coordinates.lat},{" "}
                {contactConfig.coordinates.lng}
              </p>
            </div>
          </div>

          {/* Right Map Embed */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-md lg:col-span-7">
            <div className="relative h-80 w-full sm:h-96 lg:h-full min-h-[380px]">
              <iframe
                title="i-VANTAGE Business Hub Location at Welldone Tech Park, Sector 48, Gurgaon"
                src={contactConfig.mapEmbedUrl}
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
