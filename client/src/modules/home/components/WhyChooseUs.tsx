import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import {
  Building2,
  Users,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "100+ Business Services",
    description:
      "Everything from coworking spaces to legal, compliance and business support under one roof.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Experienced professionals dedicated to helping startups, SMEs and enterprises grow.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted & Reliable",
    description:
      "Transparent processes and dependable support for every business requirement.",
  },
  {
    icon: Briefcase,
    title: "Business Growth Partner",
    description:
      "Beyond workspace, we help you with registrations, mentorship, networking and expansion.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 py-24">
      <Container>
        <SectionHeading
          title="Why Choose I-Vantage?"
          subtitle="A complete business ecosystem designed to help your company succeed."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-6 inline-flex rounded-xl bg-blue-100 p-4 text-[#1E5BFF]">
                  <Icon size={30} />
                </div>

                <h3 className="text-xl font-bold text-[#0A1F66]">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}