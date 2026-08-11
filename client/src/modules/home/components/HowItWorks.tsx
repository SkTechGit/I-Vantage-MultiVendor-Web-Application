import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import {
  Search,
  MousePointerClick,
  FileText,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Services",
    description: "Search and explore the services you need.",
  },
  {
    icon: MousePointerClick,
    title: "Select Services",
    description: "Choose as many services that fit your needs.",
  },
  {
    icon: FileText,
    title: "Share Details",
    description: "Submit your contact details and support services.",
  },
  {
    icon: CheckCircle,
    title: "Get Connected",
    description: "Our team will contact you within 1 hour.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          title="How It Works"
          subtitle="Get the right business support in just a few simple steps."
        />

        <div className="mx-auto mt-10 max-w-6xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={step.title}
                  className="flex flex-1 items-stretch lg:items-center"
                >
                  {/* Step Card */}
                  <div className="flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 transition-all hover:border-blue-200 hover:bg-blue-50/40 sm:p-6 lg:min-h-[220px] lg:flex-col lg:items-center lg:justify-center lg:p-5 lg:text-center">
                    {/* Icon */}
                    <div className="relative shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-[#1E5BFF] shadow-sm ring-1 ring-slate-200">
                        <Icon size={25} strokeWidth={2} />
                      </div>

                      {/* Step Number */}
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1E5BFF] text-[10px] font-bold text-white shadow-sm">
                        {index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#D99000]">
                        Step {index + 1}
                      </p>

                      <h3 className="mt-1 text-base font-bold text-[#0A1F66] sm:text-lg">
                        {step.title}
                      </h3>

                      <p className="mx-auto mt-2 max-w-[210px] text-xs leading-5 text-slate-500 sm:text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Connector */}
                  {!isLast && (
                    <>
                      {/* Desktop Arrow */}
                      <div className="hidden w-8 shrink-0 items-center justify-center lg:flex">
                        <ArrowRight
                          size={17}
                          className="text-slate-800"
                        />
                      </div>

                      {/* Mobile Arrow */}
                      <div className="flex h-4 shrink-0 items-center justify-center lg:hidden">
                        <ArrowRight
                          size={16}
                          className="rotate-90 text-slate-300"
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}