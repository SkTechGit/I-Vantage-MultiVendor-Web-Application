"use client";

import { useState } from "react";
import ServicesHero from "./ServicesHero";
import CategorySwitcher from "./CategorySwitcher";
import FeaturedManagedOffice from "./FeaturedManagedOffice";
import WorkspaceSolutionsGrid from "./WorkspaceSolutionsGrid";
import BusinessSupportGrid from "./BusinessSupportGrid";
import ServicesComparison from "./ServicesComparison";
import ServicesAmenities from "./ServicesAmenities";
import ServicesWhyChooseUs from "./ServicesWhyChooseUs";
import ServicesLocation from "./ServicesLocation";
import ServicesFinalCTA from "./ServicesFinalCTA";

export default function ServicesView() {
  const [activeTab, setActiveTab] = useState<"workspace" | "business">("workspace");

  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero */}
      <ServicesHero />

      {/* 2. Category Switcher (Sticky navigation between categories) */}
      <CategorySwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Featured Managed Office Solutions (Visual anchor) */}
      <FeaturedManagedOffice />

      {/* 4. Workspace Solutions Grid (7 Cards) */}
      <WorkspaceSolutionsGrid />

      {/* 5. Business Support Grid (8 Cards) */}
      <BusinessSupportGrid />

      {/* 6. Workspace Comparison Table & Mobile Cards */}
      <ServicesComparison />

      {/* 7. Workplace Amenities & Infrastructure */}
      <ServicesAmenities />

      {/* 8. Why Businesses Choose i-VANTAGE Services */}
      <ServicesWhyChooseUs />

      {/* 9. Strategic Location & Google Maps */}
      <ServicesLocation />

      {/* 10. Final Call to Action */}
      <ServicesFinalCTA />
    </div>
  );
}
