import Hero from "./Hero";
import ServicesSection from "./ServicesSection";
import HowItWorks from "./HowItWorks";
import WhyChooseUs from "./WhyChooseUs";
import CTASection from "./Ctasection";

import { HomePageProps } from "../home.types";

export default function HomePage({
  categories,
  services,
}: HomePageProps) {
  return (
    <>
      <Hero />

      <ServicesSection
  categories={categories}
  services={services}
/>

      <HowItWorks />

      <WhyChooseUs />

      <CTASection />
    </>
  );
}