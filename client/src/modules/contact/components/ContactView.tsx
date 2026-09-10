"use client";

import ContactHero from "./ContactHero";
import ContactCards from "./ContactCards";
import ContactForm from "./ContactForm";
import QuickContact from "./QuickContact";
import LocationMap from "./LocationMap";
import BusinessSolutionsLinks from "./BusinessSolutionsLinks";
import WhyVisitTrustStrip from "./WhyVisitTrustStrip";
import ContactFinalCTA from "./ContactFinalCTA";

export default function ContactView() {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero */}
      <ContactHero />

      {/* 2. Contact Cards */}
      <ContactCards />

      {/* 3. Contact / Enquiry Form */}
      <ContactForm />

      {/* 4. Quick Contact / WhatsApp Strip */}
      <QuickContact />

      {/* 5. Location / Map */}
      <LocationMap />

      {/* 6. Business Solutions Quick Links */}
      <BusinessSolutionsLinks />

      {/* 7. Why Visit / Trust Strip */}
      <WhyVisitTrustStrip />

      {/* 8. Final CTA */}
      <ContactFinalCTA />
    </div>
  );
}
