import Link from "next/link";
import { Check, ArrowRight, Sparkles, Tag } from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/ui/Button";

interface PlanItem {
  name: string;
  price: string;
  period: string;
  tagline: string;
  promo?: string;
  featured?: boolean;
  features: string[];
}

const plans: PlanItem[] = [
  {
    name: "Dedicated Coworking",
    price: "₹6,500",
    period: "per seat / month",
    tagline: "Ideal for individual professionals & agile teams",
    promo: "1 complimentary service for every 5 seats booked",
    features: [
      "Ergonomic workstation & chair",
      "High-speed enterprise internet",
      "100% full power backup & AC",
      "Pantry & cafeteria access",
    ],
  },
  {
    name: "Small Private Cabin",
    price: "₹25,000",
    period: "per cabin / month",
    tagline: "Private 3-seat lockable suite for small teams",
    features: [
      "1 manager workstation + 2 guest seats",
      "Lockable door & private acoustic setup",
      "Reception & daily housekeeping",
      "Pantry & common area access",
    ],
  },
  {
    name: "Executive / Boss Cabin",
    price: "₹40,000",
    period: "per cabin / month",
    tagline: "Premium executive suite for founders & leaders",
    featured: true,
    features: [
      "1 executive manager desk + 2 visitor chairs",
      "Executive privacy & premium finishes",
      "Reception support & lounge access",
      "Priority meeting room scheduling",
    ],
  },
  {
    name: "Virtual Office",
    price: "₹11,000",
    period: "annual plan / year",
    tagline: "Established Gurgaon commercial address",
    features: [
      "Unit 213–14, Welldone Tech Park address",
      "Company registration & GST documentation",
      "Mail & courier receiving assistance",
      "Meeting room access available on-demand",
    ],
  },
];

export default function AboutPricingSnapshot() {
  return (
    <section className="bg-[#F5F9FF] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl text-center md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1E5BFF] sm:text-xs">
              Transparent Pricing
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
              Flexible Plans Built Around Your Business
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Predictable, all-inclusive monthly and annual plans with zero
              hidden maintenance costs.
            </p>
          </div>

          <Link href="/contact" className="shrink-0">
            <Button variant="outline" size="md">
              <span>View Workspace Options</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 sm:p-7 ${
                plan.featured
                  ? "border-[#0A1F66] bg-white shadow-xl ring-2 ring-[#0A1F66]/10"
                  : "border-slate-200/80 bg-white shadow-xs hover:border-blue-200 hover:shadow-lg"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0A1F66] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Executive Pick
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-[#0A1F66]">
                  {plan.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {plan.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-5 border-b border-slate-100 pb-5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tracking-tight text-[#0A1F66] sm:text-4xl">
                      {plan.price}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {plan.period}
                  </span>

                  {/* Promo Badge */}
                  {plan.promo && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                      <Tag size={12} className="shrink-0 text-emerald-600" />
                      <span>{plan.promo}</span>
                    </div>
                  )}
                </div>

                {/* Bullets */}
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-xs text-slate-700 sm:text-sm"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-[#1E5BFF]"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="mt-7 pt-2">
                <Link href="/contact" className="block w-full">
                  <Button
                    variant={plan.featured ? "primary" : "outline"}
                    size="sm"
                    className="w-full text-xs sm:text-sm"
                  >
                    Reserve / Enquire
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
