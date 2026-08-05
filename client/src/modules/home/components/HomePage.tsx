import Hero from "./Hero";
import ServicesSection from "./ServicesSection";
import HowItWorks from "./HowItWorks";
import WhyChooseUs from "./WhyChooseUs";
import CTASection from "./Ctasection";

import { HomePageProps } from "../home.types";

export default function HomePage({
  categories,
}: HomePageProps) {
  return (
    <>
      <Hero />

      <ServicesSection categories={categories} />

      <HowItWorks />

      <WhyChooseUs />

      <CTASection />
    </>
  );
}