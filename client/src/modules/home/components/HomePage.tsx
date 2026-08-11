import Hero from "./Hero";
import ServicesSection from "./ServicesSection";
import HowItWorks from "./HowItWorks";
import WhyChooseUs from "./WhyChooseUs";
import CTASection from "./Ctasection";

import { HomePageProps } from "../home.types";
import WorkspaceShowcase from "./WorkspaceShowcase";
import CategoryMarquee from "./CategoryMarquee";


export default function HomePage({
  categories,
  services,
}: HomePageProps) {
  return (
    <>
      <Hero />
      <CategoryMarquee categories={categories} />


 <HowItWorks />
      <ServicesSection
  categories={categories}
  services={services}
/>

     
     <WorkspaceShowcase />
      <WhyChooseUs />

      <CTASection />
    </>
  );
}