import AboutHero from "./AboutHero";
import AboutWhoWeAre from "./AboutWhoWeAre";
import AboutWhatWeOffer from "./AboutWhatWeOffer";
import AboutWhyUs from "./AboutWhyUs";
import AboutMetrics from "./AboutMetrics";
import AboutAmenities from "./AboutAmenities";
import AboutPricingSnapshot from "./AboutPricingSnapshot";
import AboutLocation from "./AboutLocation";
import AboutFinalCTA from "./AboutFinalCTA";

export default function AboutView() {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero Section */}
      <AboutHero />

      {/* 2. Who We Are */}
      <AboutWhoWeAre />

      {/* 3. What We Offer (6 Service Cards) */}
      <AboutWhatWeOffer />

      {/* 4. Why i-VANTAGE (Value Pillars) */}
      <AboutWhyUs />

      {/* 5. By The Numbers (Workspace Metrics) */}
      <AboutMetrics />

      {/* 6. Amenities & Infrastructure (4 Categories) */}
      <AboutAmenities />

      {/* 7. Flexible Plans & Pricing Snapshot */}
      <AboutPricingSnapshot />

      {/* 8. Location & Operating Hours */}
      <AboutLocation />

      {/* 9. Final Call to Action */}
      <AboutFinalCTA />
    </div>
  );
}
