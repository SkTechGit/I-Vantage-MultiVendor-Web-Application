import {
  Building2,
  Users,
  Shield,
  Briefcase,
  Presentation,
  Globe,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: typeof Building2;
  features: string[];
}

const services: ServiceItem[] = [
  {
    id: "managed-offices",
    title: "Managed Offices",
    badge: "Turnkey Solution",
    icon: Building2,
    description:
      "Turnkey workspace solutions for businesses looking for a professional office environment without the complexity of setting up everything from scratch.",
    features: [
      "Customizable layout & branding",
      "Full infrastructure management",
      "Zero capital expenditure on fit-outs",
    ],
  },
  {
    id: "coworking-workstations",
    title: "Dedicated Coworking Workstations",
    badge: "120 Workstations",
    icon: Users,
    description:
      "Ergonomic dedicated desks with high-speed Wi-Fi, power backup, air conditioning, reception and housekeeping support, plus pantry and cafeteria access.",
    features: [
      "Ergonomic chair & dedicated desk",
      "High-speed enterprise internet",
      "Full pantry & cafeteria privileges",
    ],
  },
  {
    id: "private-cabins",
    title: "Private Cabins",
    badge: "5 Total Units",
    icon: Shield,
    description:
      "Lockable private cabins configured with a manager workstation and two guest seats, suitable for professionals and small teams.",
    features: [
      "1 manager seat + 2 guest seats",
      "Fully lockable & sound-insulated",
      "Dedicated power backup & cooling",
    ],
  },
  {
    id: "boss-cabins",
    title: "Executive / Boss Cabins",
    badge: "4 Total Units",
    icon: Briefcase,
    description:
      "A more premium private cabin setup with an executive manager desk and dedicated visitor seating for client meetings and focused executive work.",
    features: [
      "1 executive manager desk + 2 visitor chairs",
      "Premium finish & executive privacy",
      "Reception support & lounge access",
    ],
  },
  {
    id: "meeting-rooms",
    title: "Meeting & Conference Rooms",
    badge: "2 Rooms + 1 Conference",
    icon: Presentation,
    description:
      "Two meeting rooms along with a 20-seater conference room for collaborative discussions, presentations and larger team meetings.",
    features: [
      "Two 6-seater meeting rooms",
      "One 20-seater conference room",
      "Presentation display & high-speed Wi-Fi",
    ],
  },
  {
    id: "virtual-office",
    title: "Virtual Office",
    badge: "Annual Plan · ₹11,000/yr",
    icon: Globe,
    description:
      "A professional virtual office option with an annual plan providing an established corporate address in Gurgaon for company and GST registration.",
    features: [
      "Prestigious Welldone Tech Park address",
      "Courier & mail handling assistance",
      "Meeting room access available on demand",
    ],
  },
];

export default function AboutWhatWeOffer() {
  return (
    <section id="spaces" className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          title="Flexible Workspace Solutions for Different Business Needs"
          subtitle="Whether you need a single dedicated desk, a private cabin, or an entire managed floor, i-VANTAGE provides workspace options tailored to your workflow."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {services.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-7"
              >
                {/* Top content */}
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF] transition-colors duration-300 group-hover:bg-[#1E5BFF] group-hover:text-white">
                      <Icon size={24} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="mt-5 text-xl font-bold text-[#0A1F66] transition-colors group-hover:text-[#1E5BFF]">
                    {item.title}
                  </h3>

                  {/* Card Description */}
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  {/* Features Bullet List */}
                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {item.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-2 text-xs font-medium text-slate-700"
                      >
                        <Check size={14} className="shrink-0 text-[#1E5BFF]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Link */}
                <div className="mt-6 pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5BFF] transition-all group-hover:gap-2.5"
                  >
                    <span>Inquire About This Space</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
