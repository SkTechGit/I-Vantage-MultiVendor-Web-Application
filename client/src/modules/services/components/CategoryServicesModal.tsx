"use client";

import React, { useEffect } from "react";
import { X, Check, ShieldCheck, ArrowRight } from "lucide-react";
import { Service } from "@/modules/service/service.types";
import { Category } from "@/modules/category/category.types";

export type CategoryWithServices = Category & {
  services: Service[];
};

interface Props {
  category: CategoryWithServices | null;
  selectedServices: Service[];
  onToggleService: (service: Service) => void;
  onClose: () => void;
  onOpenLeadForm: () => void;
}

export default function CategoryServicesModal({
  category,
  selectedServices,
  onToggleService,
  onClose,
  onOpenLeadForm,
}: Props) {
  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (category) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [category]);

  if (!category) return null;

  const isSelected = (id: string) => {
    return selectedServices.some((s) => s._id === id);
  };

  const selectedInThisCategory = category.services.filter((s) => isSelected(s._id)).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/65 backdrop-blur-sm p-0 sm:items-center sm:p-4 animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-7 sm:py-4.5 bg-gradient-to-b from-slate-50/70 to-white">
          <div className="min-w-0 pr-3">
            <div className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#1E5BFF]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>i-VANTAGE Verified Business Desk</span>
            </div>

            <h2 className="truncate text-base sm:text-xl font-black text-[#0A1F66] mt-0.5">
              {category.name}
            </h2>

            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
              Select one or more services to include in your customized consultation package
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition active:scale-95 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} className="sm:w-4.5 sm:h-4.5" />
          </button>
        </div>

        {/* Services List with Checkboxes */}
        <div className="overflow-y-auto p-3 sm:p-6 max-h-[60vh] divide-y divide-slate-100/80">
          <div className="space-y-2 sm:space-y-2.5">
            {category.services.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <p className="text-xs sm:text-sm">No individual services currently listed under this desk.</p>
              </div>
            ) : (
              category.services.map((service) => {
                const selected = isSelected(service._id);

                return (
                  <button
                    key={service._id}
                    type="button"
                    onClick={() => onToggleService(service)}
                    className={`group flex w-full items-start gap-2.5 sm:gap-3.5 rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 text-left transition-all duration-200 cursor-pointer ${
                      selected
                        ? "border-[#1E5BFF] bg-blue-50/70 shadow-xs ring-1 ring-[#1E5BFF]/30"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    {/* Custom Checkbox */}
                    <span
                      className={`mt-0.5 flex h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                        selected
                          ? "border-[#1E5BFF] bg-[#1E5BFF] text-white shadow-2xs"
                          : "border-slate-300 bg-white group-hover:border-[#1E5BFF]/50"
                      }`}
                    >
                      {selected && <Check size={12} strokeWidth={3} />}
                    </span>

                    {/* Service Content */}
                    <div className="flex-1 min-w-0">
                      <span className={`block text-xs sm:text-sm font-bold transition-colors ${
                        selected ? "text-[#0A1F66]" : "text-slate-800 group-hover:text-[#1E5BFF]"
                      }`}>
                        {service.name}
                      </span>

                      {service.shortDescription && (
                        <span className="mt-0.5 block text-[11px] sm:text-xs leading-relaxed text-slate-500 line-clamp-2">
                          {service.shortDescription}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50/80 p-3 sm:p-5 flex items-center justify-between gap-2">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-600 truncate">
            {selectedInThisCategory > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{selectedInThisCategory} in desk ({selectedServices.length} total)</span>
              </span>
            ) : (
              <span>{selectedServices.length} Selected Total</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 hover:bg-white text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              Done
            </button>

            {selectedServices.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLeadForm();
                }}
                className="inline-flex items-center gap-1 px-3.5 py-2 sm:px-4.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#0A1F66] to-[#1E5BFF] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-blue-900/15 transition active:scale-95 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
