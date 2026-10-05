"use client";

import { useState, useEffect, useCallback } from "react";
import ServicesHero from "./ServicesHero";
import CategorySwitcher from "./CategorySwitcher";
import FeaturedManagedOffice from "./FeaturedManagedOffice";
import WorkspaceSolutionsGrid from "./WorkspaceSolutionsGrid";
import BusinessSupportGrid from "./BusinessSupportGrid";
import CategoryServicesModal, { CategoryWithServices } from "./CategoryServicesModal";
import SelectedServicesFloatingBar from "./SelectedServicesFloatingBar";
import ServicesComparison from "./ServicesComparison";
import ServicesAmenities from "./ServicesAmenities";
import ServicesWhyChooseUs from "./ServicesWhyChooseUs";
import ServicesLocation from "./ServicesLocation";
import ServicesFinalCTA from "./ServicesFinalCTA";

import LeadForm from "@/modules/home/components/LeadForm";
import { getCategories } from "@/modules/category/category.api";
import { getServices } from "@/modules/service/service.api";
import { Service } from "@/modules/service/service.types";
import { Category } from "@/modules/category/category.types";

export default function ServicesView() {
  const [activeTab, setActiveTab] = useState<"workspace" | "business">("business");

  // Selection & Modal States
  const [categoriesWithServices, setCategoriesWithServices] = useState<CategoryWithServices[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryWithServices | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync activeTab on scroll between business and workspace sections
  useEffect(() => {
    const handleScrollSync = () => {
      const workspaceElem = document.getElementById("workspace-solutions");
      if (!workspaceElem) return;
      const rect = workspaceElem.getBoundingClientRect();
      if (rect.top <= 240) {
        setActiveTab("workspace");
      } else {
        setActiveTab("business");
      }
    };

    window.addEventListener("scroll", handleScrollSync, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSync);
  }, []);

  // Fetch Categories & Services from backend
  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      try {
        setIsLoading(true);
        const [catsData, srvsData] = await Promise.all([
          getCategories().catch(() => []),
          getServices().catch(() => []),
        ]);

        if (!isMounted) return;

        const cats: Category[] = Array.isArray(catsData) ? catsData : [];
        const srvs: Service[] = Array.isArray(srvsData) ? srvsData : [];

        // Group services under their respective categories
        const grouped: CategoryWithServices[] = cats.map((cat) => ({
          ...cat,
          services: srvs.filter((s) => {
            const catId = typeof s.category === "object" ? s.category?._id : s.category;
            return catId === cat._id;
          }),
        }));

        setCategoriesWithServices(grouped);
      } catch (err) {
        console.error("Error loading services catalog:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle service in or out of selectedServices
  const handleToggleService = useCallback((service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s._id === service._id);
      if (exists) {
        return prev.filter((s) => s._id !== service._id);
      }
      return [...prev, service];
    });
  }, []);

  // Remove individual service from LeadForm chip
  const removeSelectedService = useCallback((serviceId: string) => {
    setSelectedServices((prev) => prev.filter((s) => s._id !== serviceId));
  }, []);

  return (
    <div className="flex flex-col bg-white relative">
      {/* 1. Hero */}
      <ServicesHero />

      {/* 2. Category Switcher (Sticky navigation between categories) */}
      <CategorySwitcher activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Business Support Grid (Hooked directly under Hero Headline & Text) */}
      <BusinessSupportGrid
        categories={categoriesWithServices}
        selectedServices={selectedServices}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        isLoading={isLoading}
      />

      {/* 4. Featured Managed Office Solutions (Visual anchor) */}
      <FeaturedManagedOffice />

      {/* 5. Workspace Solutions Grid (Interactive selection supported) */}
      <WorkspaceSolutionsGrid
        selectedServices={selectedServices}
        onToggleService={handleToggleService}
        onOpenLeadForm={() => setIsLeadFormOpen(true)}
      />

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

      {/* =========================================================
          DYNAMIC INTERACTIVE MODALS & FLOATING ACTION BAR
      ========================================================= */}

      {/* Category Services Modal with checkboxes */}
      <CategoryServicesModal
        category={activeCategory}
        selectedServices={selectedServices}
        onToggleService={handleToggleService}
        onClose={() => setActiveCategory(null)}
        onOpenLeadForm={() => setIsLeadFormOpen(true)}
      />

      {/* Dynamic Floating Bottom Blue Pill Bar */}
      {!isLeadFormOpen && (
        <SelectedServicesFloatingBar
          selectedServices={selectedServices}
          onOpenLeadForm={() => setIsLeadFormOpen(true)}
        />
      )}

      {/* Pre-filled Consultation Lead Form */}
      <LeadForm
        open={isLeadFormOpen}
        services={selectedServices}
        onRemoveService={removeSelectedService}
        onClose={() => setIsLeadFormOpen(false)}
        onSuccess={() => {
          setSelectedServices([]);
          setIsLeadFormOpen(false);
        }}
      />
    </div>
  );
}
