"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  ArrowRight,
  ShoppingBag,
  Check,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Service } from "@/modules/service/service.types";
import { Category } from "@/modules/category/category.types";
import LeadForm from "./LeadForm";
import Container from "@/components/common/Container";

type CategoryWithServices = Category & {
  services: Service[];
};

interface Props {
  categories: Category[];
  services: Service[];
}

export default function ServicesSection({ categories, services }: Props) {
  const [search, setSearch] = useState("");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryWithServices | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const groupedCategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      services: services.filter(
        (service) => service.category._id === category._id,
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
          service.name.toLowerCase().includes(search.toLowerCase()),
        ),
      }))
      .filter((category) => category.services.length > 0);
  }, [search, groupedCategories]);

  const handleSelectService = (service: Service) => {
    const exists = selectedServices.some((item) => item._id === service._id);

    if (exists) {
      setSelectedServices((prev) =>
        prev.filter((item) => item._id !== service._id),
      );
    } else {
      setSelectedServices((prev) => [...prev, service]);
    }
  };

  const isSelected = (id: string) => {
    return selectedServices.some((item) => item._id === id);
  };

  const removeSelectedService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.filter((service) => service._id !== serviceId),
    );
  };

  /* Close modal with Escape */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeCategory) setActiveCategory(null);
      if (isLeadFormOpen) setIsLeadFormOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeCategory, isLeadFormOpen]);

  /* Prevent background scrolling while modal is open */
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
      <section id="serviceSection" className="relative py-20 sm:py-24 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 overflow-hidden">
        {/* Subtle Architectural Lighting */}
        <div className="absolute left-1/4 top-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 bottom-0 w-96 h-96 bg-[#F4A900]/5 rounded-full blur-3xl pointer-events-none" />

        <Container>
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-blue-50 border border-blue-100 text-[#0A1F66] uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F4A900]" />
              <span>Full-Spectrum Enterprise Services</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0A1F66] tracking-tight leading-tight">
              Business Support &{" "}
              <span className="bg-gradient-to-r from-[#1E5BFF] via-[#0A1F66] to-[#1E5BFF] bg-clip-text text-transparent">
                Corporate Infrastructure
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tailor-fit support covering company registrations, taxation, corporate legal advisory, and managed office operations under a single transparent umbrella.
            </p>
          </div>

          {/* Workflow Indicator */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200/80 shadow-2xs">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1E5BFF] text-[10px] font-black text-white">
                1
              </span>
              <span className="text-xs font-bold text-[#0A1F66]">
                Select Services
              </span>
            </div>

            <span className="h-0.5 w-6 bg-slate-200" />

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-slate-200 text-slate-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold">
                2
              </span>
              <span className="text-xs font-medium">
                Submit Consultation
              </span>
            </div>
          </div>

          {/* Search Console */}
          <div className="relative mx-auto mb-10 max-w-2xl">
            <div className="relative flex items-center rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(10,31,102,0.05)] transition-all focus-within:border-[#1E5BFF] focus-within:ring-4 focus-within:ring-blue-100">
              <Search
                size={19}
                className="absolute left-4.5 text-slate-400 pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search across corporate services, compliance, legal..."
                className="h-13 w-full rounded-2xl bg-transparent pl-12 pr-11 text-xs sm:text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-normal"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Selected Services Preview Bar */}
          {selectedServices.length > 0 && (
            <div className="mb-10 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A1F66] text-white shadow-xs">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-[#0A1F66]">
                      {selectedServices.length} {selectedServices.length === 1 ? "Service" : "Services"} Selected For Request
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Submit for instant quotation & relationship manager assignment
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLeadFormOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] px-5 py-2.5 text-xs font-black text-white shadow-md transition hover:brightness-110 active:scale-95"
                >
                  <span>Review & Submit</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Service Pills */}
              <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-blue-100">
                {selectedServices.map((service) => (
                  <span
                    key={service._id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-[#0A1F66] border border-blue-100 shadow-2xs"
                  >
                    <span>{service.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSelectedService(service._id)}
                      className="text-slate-400 hover:text-red-500 transition"
                      aria-label={`Remove ${service.name}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredCategories.map((category) => {
              const selectedInCat = category.services.filter((s) => isSelected(s._id)).length;
              return (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/85 bg-white p-6 sm:p-7 text-left shadow-[0_4px_16px_rgba(10,31,102,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1E5BFF]/50 hover:shadow-[0_16px_36px_rgba(30,91,255,0.08)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#1E5BFF] border border-blue-100/70 transition-all duration-300 group-hover:bg-[#0A1F66] group-hover:text-white group-hover:border-[#0A1F66]">
                        <Layers size={20} strokeWidth={2.2} />
                      </div>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-[#1E5BFF] group-hover:text-white">
                        <ArrowUpRight size={15} />
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#0A1F66] transition-colors group-hover:text-[#1E5BFF]">
                      {category.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {category.description || "Comprehensive enterprise services and legal support."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50/80 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-[#1E5BFF]">
                      {category.services.length} Solutions
                    </span>

                    {selectedInCat > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <Check size={13} /> {selectedInCat} Selected
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-[#1E5BFF] transition-colors">
                        View Details →
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
                <Search size={26} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No matching services found
              </h3>
              <p className="mt-1.5 text-xs text-slate-500">
                Try searching for another service term or clear your search query.
              </p>
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
              >
                Clear Search
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* Category Services Modal */}
      {activeCategory && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setActiveCategory(null);
          }}
        >
          <div className="flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-gradient-to-b from-slate-50/60 to-white">
              <div className="min-w-0 pr-4">
                <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#1E5BFF]">
                  <ShieldCheck className="w-3 h-3" /> i-VANTAGE Verified Services
                </div>
                <h2 className="truncate text-lg sm:text-xl font-bold text-[#0A1F66] mt-0.5">
                  {activeCategory.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  Select one or more services to include in your package
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Services List */}
            <div className="overflow-y-auto p-5 sm:p-6 max-h-[55vh]">
              <div className="space-y-3">
                {activeCategory.services.map((service) => {
                  const selected = isSelected(service._id);
                  return (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => handleSelectService(service)}
                      className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                        selected
                          ? "border-[#1E5BFF] bg-blue-50/50 shadow-xs"
                          : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      {/* Custom Checkbox */}
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          selected
                            ? "border-[#1E5BFF] bg-[#1E5BFF] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {selected && <Check size={13} strokeWidth={3} />}
                      </span>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs sm:text-sm font-bold text-slate-900">
                          {service.name}
                        </span>
                        {service.shortDescription && (
                          <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                            {service.shortDescription}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5 flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-500">
                {selectedServices.length} Selected Total
              </span>

              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] text-xs sm:text-sm font-black text-white shadow-md hover:brightness-110 active:scale-95 transition"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating CTA Pill */}
      {selectedServices.length > 0 && !isLeadFormOpen && (
        <div className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-32px)] max-w-md -translate-x-1/2">
          <button
            type="button"
            onClick={() => setIsLeadFormOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-[#0A1F66] px-5 py-3.5 text-white shadow-2xl shadow-blue-950/40 border border-white/10 hover:bg-[#081850] transition active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E5BFF] text-white shadow-xs">
                <ShoppingBag size={18} />
              </div>

              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold">
                  {selectedServices.length}{" "}
                  {selectedServices.length === 1 ? "Service" : "Services"}{" "}
                  Ready For Consultation
                </p>
                <p className="text-[10px] text-blue-200">
                  Tap to request instant callback
                </p>
              </div>
            </div>

            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Lead Form Modal */}
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
    </>
  );
}
