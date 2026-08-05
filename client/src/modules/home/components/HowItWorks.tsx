import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import {
  Search,
  MousePointerClick,
  FileText,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Services",
    description:
      "Find the workspace or business support services you need using our smart search.",
  },
  {
    icon: MousePointerClick,
    title: "Select Services",
    description:
      "Choose one or multiple services from different business categories.",
  },
  {
    icon: FileText,
    title: "Submit Enquiry",
    description:
      "Fill in your contact details and business requirements in a simple enquiry form.",
  },
  {
    icon: CheckCircle,
    title: "Our Team Contacts You",
    description:
      "Our experts will connect with you quickly to understand your needs and provide the right solution.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <SectionHeading
          title="How It Works"
          subtitle="Getting started with I-Vantage Business Hub is quick and easy."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-[#1E5BFF]">
                  <Icon size={30} />
                </div>

                <span className="text-sm font-semibold text-[#D99000]">
                  Step {index + 1}
                </span>

                <h3 className="mt-3 text-xl font-bold text-[#0A1F66]">
                  {step.title}
                </h3>

                <p className="mt-4 text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}