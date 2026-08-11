"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Search,
  X,
  ArrowRight,
  ShoppingBag,
  Check,
} from "lucide-react";

import { Service } from "@/modules/service/service.types";
import { Category } from "@/modules/category/category.types";

import LeadForm from "./LeadForm";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

type CategoryWithServices = Category & {
  services: Service[];
};

interface Props {
  categories: Category[];
  services: Service[];
}

export default function ServicesSection({
  categories,
  services,
}: Props) {
  const [search, setSearch] = useState("");

  const [selectedServices, setSelectedServices] =
    useState<Service[]>([]);

  // Currently opened category
  const [activeCategory, setActiveCategory] =
    useState<CategoryWithServices | null>(null);

  // Lead form modal
  const [isLeadFormOpen, setIsLeadFormOpen] =
    useState(false);

  const groupedCategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      services: services.filter(
        (service) =>
          service.category._id === category._id
      ),
    }));
  }, [categories, services]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) {
      return groupedCategories;
    }

    return groupedCategories
      .map((category) => ({
        ...category,
        services: category.services.filter((service) =>
          service.name
            .toLowerCase()
            .includes(search.toLowerCase())
        ),
      }))
      .filter(
        (category) => category.services.length > 0
      );
  }, [search, groupedCategories]);
  
  const handleSelectService = (service: Service) => {
    const exists = selectedServices.some(
      (item) => item._id === service._id
    );

    if (exists) {
      setSelectedServices((prev) =>
        prev.filter(
          (item) => item._id !== service._id
        )
      );
    } else {
      setSelectedServices((prev) => [
        ...prev,
        service,
      ]);
    }
  };

  const isSelected = (id: string) => {
    return selectedServices.some(
      (item) => item._id === id
    );
  };

  const removeSelectedService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.filter(
        (service) => service._id !== serviceId
      )
    );
  };

  /*
   * Close category popup with Escape
   * Close lead popup with Escape
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (activeCategory) {
        setActiveCategory(null);
      }

      if (isLeadFormOpen) {
        setIsLeadFormOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [activeCategory, isLeadFormOpen]);

  /*
   * Prevent background scrolling while modal is open
   */
  useEffect(() => {
    if (activeCategory || isLeadFormOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeCategory, isLeadFormOpen]);

  return (
    <>
      <section id="serviceSection">
        <Container>

          {/* =====================================================
              SECTION HEADING
          ===================================================== */}

          <SectionHeading
            title="Business Support Services"
            subtitle="Find Your Custom Business Solution in Minutes, Search and select one or more services you need."
          />

          {/* =====================================================
              PROGRESS
          ===================================================== */}

          <div className="mb-5 flex items-center justify-center gap-2 text-xs sm:gap-3 sm:text-sm">
            {/* Step 1 */}
            <div className="flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E5BFF] text-xs font-semibold text-white">
                1
              </span>

              <span className="font-medium text-[#1E5BFF]">
                Select Services
              </span>
            </div>

            <span className="text-slate-300">
              ---
            </span>

            {/* Step 2 */}
            <div className="flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs font-medium text-slate-500">
                2
              </span>

              <span className="text-slate-500">
                Your Details
              </span>
            </div>
          </div>
          {/* =====================================================
              SEARCH
          ===================================================== */}

          <div className="relative mx-auto mb-8 max-w-2xl">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search services..."
              className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-12 pr-5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100 sm:h-14 sm:text-base"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            )}

          </div>

          {/* =====================================================
              SELECTED SERVICES PREVIEW
          ===================================================== */}

          {selectedServices.length > 0 && (
            <div className="mb-7 rounded-xl border border-blue-100 bg-blue-50/50 p-3 sm:p-4">

              <div className="flex items-center justify-between gap-3">

                <div>
                  <p className="text-xs font-semibold text-[#0A1F66] sm:text-sm">
                    Selected Services
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                    {selectedServices.length}{" "}
                    {selectedServices.length === 1
                      ? "service"
                      : "services"}{" "}
                    selected
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsLeadFormOpen(true)
                  }
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1E5BFF] px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:px-4 sm:text-sm"
                >
                  <ShoppingBag size={15} />

                  View Selected
                </button>

              </div>

              {/* Small selected service pills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedServices
                  .slice(0, 4)
                  .map((service) => (
                    <span
                      key={service._id}
                      className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-[#0A1F66] shadow-sm sm:text-xs"
                    >
                      {service.name}
                    </span>
                  ))}

                {selectedServices.length > 4 && (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500 shadow-sm sm:text-xs">
                    +{selectedServices.length - 4} more
                  </span>
                )}
              </div>

            </div>
          )}

          {/* =====================================================
              CATEGORIES
          ===================================================== */}

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">

            {filteredCategories.map((category) => (

              <button
                key={category._id}
                type="button"
                onClick={() =>
                  setActiveCategory(category)
                }
                className="group rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:border-blue-200 hover:shadow-md sm:rounded-2xl sm:p-4"
              >

                <div className="flex items-start justify-between gap-2">

                  <h3 className="line-clamp-2 text-sm md:text-xl font-semibold leading-5 text-slate-800 sm:text-sm">
                    {category.name}
                  </h3>

                  <span className="shrink-0 text-slate-400 transition  group-hover:text-[#1E5BFF]">
                    <ArrowRight size={14} />
                  </span>

                </div>

                <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-slate-500 sm:text-xs">
                  {category.description}
                </p>

                <div className="mt-3 flex items-center justify-between">

                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-semibold text-[#1E5BFF] sm:px-2.5 sm:text-[10px]">
                    {category.services.length} Services
                  </span>

                  {category.services.some(
                    (service) =>
                      isSelected(service._id)
                  ) && (
                    <span className="flex items-center gap-1 text-[9px] font-medium text-green-600 sm:text-[10px]">
                      <Check size={12} />
                      Selected
                    </span>
                  )}

                </div>

              </button>

            ))}

          </div>

          {/* =====================================================
              NO SEARCH RESULTS
          ===================================================== */}
   {/* <div className="mt-8 text-center">
  <p className="mb-2 text-xs text-slate-500 sm:text-sm">
    Can't find the service you need?
  </p>

  <button
    type="button"
    onClick={() => setIsLeadFormOpen(true)}
    className="text-xs font-semibold text-[#1E5BFF] hover:underline sm:text-sm"
  >
    Tell us what you need →
  </button>
</div> */}
          {filteredCategories.length === 0 && (
            <div className="py-10 text-center">

              <Search
                size={28}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-medium text-slate-600">
                No services found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try searching for another service.
              </p>

            </div>
          )}

        </Container>
      </section>

      {/* =========================================================
          CATEGORY SERVICES MODAL
      ========================================================= */}

      {activeCategory && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setActiveCategory(null);
            }
          }}
        >

          <div className="flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">

              <div className="min-w-0">

                <h2 className="truncate text-sm font-bold text-[#0A1F66] sm:text-base">
                  {activeCategory.name}
                </h2>

                
<p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-gray-700 sm:text-xs">
                  {activeCategory.description}
                </p>
               
                <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                  Select the services you need
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveCategory(null)
                }
                className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
                aria-label="Close"
              >
                <X size={17} />
              </button>

            </div>

            {/* Services */}

            <div className="overflow-y-auto p-4 sm:p-6">

              <div className="space-y-2.5">

                {activeCategory.services.map(
                  (service) => {
                    const selected = isSelected(
                      service._id
                    );

                    return (
                      <button
                        key={service._id}
                        type="button"
                        onClick={() =>
                          handleSelectService(service)
                        }
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition sm:p-4 ${
                          selected
                            ? "border-blue-200 bg-blue-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >

                        {/* Checkbox */}

                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            selected
                              ? "border-[#1E5BFF] bg-[#1E5BFF] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {selected && (
                            <Check size={13} />
                          )}
                        </span>

                        {/* Service */}

                        <span className="min-w-0 flex-1">

                          <span className="block text-xs font-semibold text-slate-800 sm:text-sm">
                            {service.name}
                          </span>

                          {service.shortDescription && (
                            <span className="mt-0.5 block line-clamp-2 text-[10px] leading-4 text-slate-500 sm:text-xs">
                              {service.shortDescription}
                            </span>
                          )}

                        </span>

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* Modal Footer */}

            <div className="border-t border-slate-100 bg-white p-3 sm:p-4">

              <button
                type="button"
                onClick={() =>
                  setActiveCategory(null)
                }
                className="w-full rounded-xl bg-[#1E5BFF] py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 sm:py-3 sm:text-sm"
              >
                Done
                {selectedServices.length > 0 &&
                  ` • ${selectedServices.length} Selected`}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================
          MOBILE / DESKTOP SELECTED SERVICES CTA
      ========================================================= */}

      {selectedServices.length > 0 && !isLeadFormOpen && (
        <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-24px)] max-w-md -translate-x-1/2">
          <button
            type="button"
            onClick={() =>
              setIsLeadFormOpen(true)
            }
            className="flex w-full items-center justify-between rounded-2xl bg-[#0A1F66] px-4 py-3 text-white shadow-2xl transition hover:bg-[#081950] sm:px-5"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <ShoppingBag size={18} />
              </div>

              <div className="text-left">

                <p className="text-xs font-semibold sm:text-sm">
                  {selectedServices.length}{" "}
                  {selectedServices.length === 1
                    ? "Service"
                    : "Services"}{" "}
                  Selected
                </p>

                <p className="text-[10px] text-blue-100 sm:text-xs">
                  Continue to your details
                </p>

              </div>

            </div>

            <ArrowRight size={18} />

          </button>
        </div>
      )}

      {/* =========================================================
          LEAD FORM MODAL
      ========================================================= */}

      <LeadForm
        open={isLeadFormOpen}
        services={selectedServices}
        onRemoveService={removeSelectedService}
        onClose={() =>
          setIsLeadFormOpen(false)
        }
        onSuccess={() => {
          setSelectedServices([]);
          setIsLeadFormOpen(false);
        }}
      />
    </>
  );
}