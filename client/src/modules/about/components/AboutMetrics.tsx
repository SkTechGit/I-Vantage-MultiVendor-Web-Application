import Container from "@/components/common/Container";

interface StatItem {
  number: string;
  label: string;
  detail: string;
}

const stats: StatItem[] = [
  {
    number: "120",
    label: "Dedicated Coworking Workstations",
    detail: "Ergonomic seating with individual power & LAN points",
  },
  {
    number: "5",
    label: "Small Private Cabins",
    detail: "Configured with 1 manager workstation + 2 guest seats",
  },
  {
    number: "4",
    label: "Executive / Boss Cabins",
    detail: "Premium executive manager desk + 2 visitor chairs",
  },
  {
    number: "2",
    label: "Meeting Rooms",
    detail: "6-seater presentation & collaborative discussion spaces",
  },
  {
    number: "1",
    label: "20-Seater Conference Room",
    detail: "Large conference facility equipped for team summits",
  },
];

export default function AboutMetrics() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#071F66] via-[#0A1F66] to-[#143AA2] py-16 text-white sm:py-20 lg:py-24">
      {/* Decorative ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#C8942C]/15 blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#F7D78A] sm:text-xs">
            Workspace Capacity
          </p>

          <h2 className="mt-2.5 text-2xl font-bold tracking-tight sm:mt-3 sm:text-3xl lg:text-4xl">
            i-VANTAGE By The Numbers
          </h2>

          <p className="mt-3.5 text-sm leading-relaxed text-blue-100 sm:text-base">
            Verified space inventory at Welldone Tech Park, Sector 48, Sohna
            Road, Gurgaon designed to accommodate individuals up to scaling
            teams.
          </p>
        </div>

        {/* Numbers Grid */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10 sm:p-6 ${
                idx === 4 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <div>
                <span className="block text-4xl font-extrabold tracking-tight text-[#F7D78A] sm:text-5xl lg:text-5xl">
                  {stat.number}
                </span>

                <h3 className="mt-3 text-sm font-bold leading-snug text-white sm:text-base">
                  {stat.label}
                </h3>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-blue-200/80">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
