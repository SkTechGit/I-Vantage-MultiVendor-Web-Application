import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/ui/Button";

interface ComparisonRow {
  solution: string;
  bestFor: string;
  capacity: string;
  price: string;
  period: string;
  highlight?: boolean;
}

const comparisonData: ComparisonRow[] = [
  {
    solution: "Dedicated Workstation",
    bestFor: "Individuals / professionals",
    capacity: "1 seat (120 total)",
    price: "₹7,000",
    period: "/ seat / month",
    highlight: true,
  },
  {
    solution: "Small Private Cabin",
    bestFor: "Small teams & startups",
    capacity: "1 manager + 2 guests",
    price: "₹25,000",
    period: "/ cabin / month",
  },
  {
    solution: "Executive Boss Cabin",
    bestFor: "Leadership / professionals",
    capacity: "1 manager + 2 guests",
    price: "₹40,000",
    period: "/ cabin / month",
  },
  {
    solution: "Meeting Room",
    bestFor: "Client meetings & pitches",
    capacity: "6 seats (2 rooms)",
    price: "Contact Us",
    period: "On demand",
  },
  {
    solution: "Conference Room",
    bestFor: "Summits & larger team sessions",
    capacity: "20 seats (1 room)",
    price: "Contact Us",
    period: "On booking",
  },
  {
    solution: "Virtual Office",
    bestFor: "Professional business presence",
    capacity: "Corporate Address & GST",
    price: "₹11,000",
    period: "/ year",
  },
  {
    solution: "Managed Office",
    bestFor: "Growing businesses & teams",
    capacity: "Flexible turnkey",
    price: "Custom",
    period: "Tailored plan",
  },
];

export default function ServicesComparison() {
  return (
    <section id="comparison" className="bg-[#F8FAFC] py-10 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Compare Workspace Solutions"
          subtitle="A quick side-by-side comparison of capacity, intended usage, and structured pricing across all i-VANTAGE workspace options."
        />

        {/* Desktop / Tablet View: Full Table */}
        <div className="mt-12 hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm md:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-[#0A1F66]">
                  <th className="py-4.5 px-6">Solution</th>
                  <th className="py-4.5 px-6">Best For</th>
                  <th className="py-4.5 px-6">Capacity</th>
                  <th className="py-4.5 px-6">Structured Price</th>
                  <th className="py-4.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {comparisonData.map((row) => (
                  <tr
                    key={row.solution}
                    className={`transition-colors hover:bg-blue-50/40 ${
                      row.highlight ? "bg-blue-50/20 font-medium" : ""
                    }`}
                  >
                    <td className="py-4 px-6 font-bold text-[#0A1F66]">
                      {row.solution}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{row.bestFor}</td>
                    <td className="py-4 px-6 text-slate-700">{row.capacity}</td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-[#0A1F66]">
                        {row.price}
                      </span>{" "}
                      <span className="text-xs text-slate-500">{row.period}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link href="/contact">
                        <Button
                          variant={row.highlight ? "primary" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          <span>Enquire</span>
                          <ArrowRight size={13} />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View: Compact Stacked Comparison Cards */}
        <div className="mt-6 space-y-2.5 md:hidden">
          {comparisonData.map((row) => (
            <div
              key={row.solution}
              className={`rounded-xl border p-3.5 shadow-2xs ${
                row.highlight
                  ? "border-[#1E5BFF]/50 bg-white ring-1 ring-[#1E5BFF]/20"
                  : "border-slate-200/80 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-[#0A1F66]">
                    {row.solution}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">{row.bestFor}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-[#0A1F66]">
                    {row.price}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {row.period}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between pt-0.5 text-[11px]">
                <span className="font-medium text-slate-600">
                  Capacity:{" "}
                  <strong className="text-slate-800">{row.capacity}</strong>
                </span>

                <Link href="/contact">
                  <Button
                    variant={row.highlight ? "primary" : "outline"}
                    size="sm"
                    className="h-7 px-2.5 text-[11px] font-semibold"
                  >
                    <span>Enquire</span>
                    <ArrowRight size={11} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
