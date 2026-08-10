import Container from "@/components/common/Container";
import WorkspaceGallery from "@/components/common/WorkspaceGallery";

import { conferenceImages, coworkingImages, receptionImages, pantryImages } from "@/data/workspace-gallery";

export default function WorkspaceShowcase() {
  return (
    <section className="overflow-hidden py-16 sm:py-20 lg:py-28">
      <Container>
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#1E5BFF] sm:text-sm">
            i-VANTAGE Business Hub
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[#0A1F66] sm:text-2xl md:text-4xl">
            Spaces Designed for
            <span className="block text-[#1E5BFF]">
              Business & Growth
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-7">
            Explore our professionally designed workspaces, meeting
            rooms and business amenities built to help you work,
            connect and grow.
          </p>
        </div>

        {/* =====================================================
            CONFERENCE ROOMS
        ===================================================== */}
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E5BFF]">
                Meeting Spaces
              </p>

              <h3 className="mt-2 text-xl font-bold text-[#0A1F66] sm:text-2xl lg:text-3xl">
                Conference & Meeting Rooms
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
                Professional meeting spaces for presentations,
                discussions, client meetings and team collaboration.
              </p>
            </div>
          </div>

          <WorkspaceGallery images={conferenceImages} />
        </div>

        {/* =====================================================
            COWORKING
        ===================================================== */}
        <div className="mt-20 sm:mt-24 lg:mt-32">
          <div className="mb-6 max-w-2xl sm:mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E5BFF]">
              Flexible Workspace
            </p>

            <h3 className="mt-2 text-xl font-bold text-[#0A1F66] sm:text-2xl lg:text-3xl">
              Open Seats & Coworking
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
              Plug-and-play workstations designed for professionals,
              freelancers, startups and growing teams.
            </p>
          </div>

          <WorkspaceGallery images={coworkingImages} />
        </div>

        {/* =====================================================
            AMENITIES
        ===================================================== */}
        <div className="mt-20 sm:mt-24 lg:mt-32">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E5BFF]">
              More Than Workspace
            </p>

            <h3 className="mt-2 text-xl font-bold text-[#0A1F66] sm:text-2xl lg:text-3xl">
              Designed Around Your Business
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Reception */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="p-3 sm:p-4">
                <WorkspaceGallery images={receptionImages} />
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <h4 className="text-lg font-bold text-[#0A1F66]">
                  Reception & Lounge
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A professional reception and comfortable lounge
                  area for welcoming clients and visitors.
                </p>
              </div>
            </div>

            {/* Pantry */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="p-3 sm:p-4">
                <WorkspaceGallery images={pantryImages} />
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <h4 className="text-lg font-bold text-[#0A1F66]">
                  Premium Pantry
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A clean and comfortable common area where you can
                  take a break, refresh and connect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}