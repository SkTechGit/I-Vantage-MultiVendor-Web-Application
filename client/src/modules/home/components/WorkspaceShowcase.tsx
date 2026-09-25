import Container from "@/components/common/Container";
import WorkspaceGallery from "@/components/common/WorkspaceGallery";
import { Sparkles, MapPin, Building2, Coffee } from "lucide-react";

import {
  conferenceImages,
  coworkingImages,
  receptionImages,
  pantryImages,
} from "@/data/workspace-gallery";

export default function WorkspaceShowcase() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-white via-slate-50/40 to-white border-t border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-blue-50 border border-blue-100 text-[#0A1F66] uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
            <span>Infrastructure & Architectural Excellence</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0A1F66] tracking-tight leading-tight">
            Spaces Engineered for{" "}
            <span className="bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#1E5BFF] bg-clip-text text-transparent">
              Focus & High Growth
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
            Tour our flagship physical hub at Welldone Tech Park, Sector 48 Gurugram, equipped with ergonomic workstations, high-tech AV meeting suites, and executive reception.
          </p>
        </div>

        {/* Conference Rooms Section */}
        <div className="mb-20 sm:mb-24">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-4 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5BFF]">
                <Building2 className="w-3.5 h-3.5" /> Meeting & Collaboration
              </div>
              <h3 className="mt-1.5 text-xl font-black text-[#0A1F66] sm:text-2xl lg:text-3xl">
                Conference & Boardroom Suites
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full w-fit">
              <MapPin className="w-3.5 h-3.5 text-[#F4A900]" />
              <span>Welldone Tech Park, Gurugram</span>
            </div>
          </div>

          <WorkspaceGallery images={conferenceImages} />
        </div>

        {/* Coworking & Open Seats Section */}
        <div className="mb-20 sm:mb-24">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-4 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5BFF]">
                <Building2 className="w-3.5 h-3.5" /> High-Performance Workspaces
              </div>
              <h3 className="mt-1.5 text-xl font-black text-[#0A1F66] sm:text-2xl lg:text-3xl">
                Open Desks & Private Team Cabins
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full w-fit">
              <span>Ergonomic Seating & 1 Gbps Leased Fiber</span>
            </div>
          </div>

          <WorkspaceGallery images={coworkingImages} />
        </div>

        {/* Hospitality & Amenities Section */}
        <div>
          <div className="mb-8 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1E5BFF]">
              <Coffee className="w-3.5 h-3.5 text-[#F4A900]" /> Hospitality & Comfort
            </div>
            <h3 className="text-xl font-black text-[#0A1F66] sm:text-2xl lg:text-3xl">
              World-Class Front-Office Experience
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Reception */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(10,31,102,0.04)] hover:shadow-[0_16px_32px_rgba(10,31,102,0.08)] transition-all duration-300">
              <div className="p-4 sm:p-5">
                <WorkspaceGallery images={receptionImages} />
              </div>

              <div className="px-6 pb-6">
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-[11px] font-bold text-[#1E5BFF] mb-2">
                  Branded Reception
                </div>
                <h4 className="text-lg font-bold text-[#0A1F66]">
                  Executive Reception & Concierge Lounge
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  A front office that reflects credibility. Welcome guests, investors, and clients with professional concierge receptionists and stylish waiting lounges.
                </p>
              </div>
            </div>

            {/* Pantry */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_4px_20px_rgba(10,31,102,0.04)] hover:shadow-[0_16px_32px_rgba(10,31,102,0.08)] transition-all duration-300">
              <div className="p-4 sm:p-5">
                <WorkspaceGallery images={pantryImages} />
              </div>

              <div className="px-6 pb-6">
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 text-[11px] font-bold text-[#B45309] mb-2">
                  Beverages & Refreshments
                </div>
                <h4 className="text-lg font-bold text-[#0A1F66]">
                  Cafeteria & Artisan Pantry
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  Fully stocked pantry with gourmet coffee machines, purified water, refrigerator, microwave, and breakout areas for rejuvenation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}