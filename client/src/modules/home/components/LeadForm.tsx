"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X, Check, ShoppingBag } from "lucide-react";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import { leadSchema, LeadFormData } from "@/modules/lead/lead.schema";

import { createLead } from "@/modules/lead/lead.api";

import { Service } from "@/modules/service/service.types";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

interface Props {
  open: boolean;
  services: Service[];
  onRemoveService: (serviceId: string) => void;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LeadForm({
  open,
  services,
  onRemoveService,
  onClose,
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = (values: LeadFormData) => {
  startTransition(async () => {
    try {
      await createLead({
        ...values,
        services: services.map((service) => service._id),
      });

      // Track successful lead submission in Google Tag Manager
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: "lead_form_submit",

        // Useful non-personal information for analytics
        service_count: services.length,
        location: values.location,
      });

      toast.success("Enquiry submitted successfully.");

      reset();

      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong."
      );
    }
  });
};

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-2xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1E5BFF]">
                <ShoppingBag size={16} />
              </div>

              <h2 className="text-base font-bold text-[#0A1F66] sm:text-lg">
                Tell us your Requirement
              </h2>
            </div>

            <p className="mt-1 pl-10 text-[11px] text-slate-500 sm:text-xs">
              Share your details and we&apos;ll help you find the right
              solution.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* =====================================================
            SCROLLABLE CONTENT
        ===================================================== */}

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
          <div className="space-y-6 p-4 sm:p-6">
            {/* =================================================
                SELECTED SERVICES
            ================================================= */}

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#0A1F66] sm:text-sm">
                    Services you&apos;re interested in
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                    {services.length}{" "}
                    {services.length === 1 ? "service" : "services"} selected
                  </p>
                </div>
              </div>

              {services.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[10px] font-medium text-[#0A1F66] sm:text-xs"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1E5BFF] text-white">
                        <Check size={9} />
                      </span>

                      <span className="max-w-[180px] truncate sm:max-w-none">
                        {service.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => onRemoveService(service._id)}
                        className="ml-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${service.name}`}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                  No specific service selected. We&apos;ll understand your
                  requirement and suggest the right solution.
                </p>
              )}
            </div>

            {/* =================================================
                YOUR DETAILS
            ================================================= */}

            <div>
              <h3 className="mb-3 text-xs font-bold text-[#0A1F66] sm:text-sm">
                Your Details
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Full Name"
                  {...register("fullName")}
                  error={errors.fullName?.message}
                />

                <Input
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />

                <Input
                  label="Mobile"
                  type="tel"
                  {...register("mobile")}
                  error={errors.mobile?.message}
                />
                <Input
                  label="Preferred office Location"
                  {...register("location")}
                  error={errors.location?.message}
                />
                <Input
                  label="Company"
                  {...register("companyName")}
                  error={errors.companyName?.message}
                />
              </div>
            </div>

            {/* =================================================
                REQUIREMENT
            ================================================= */}

            <div>
              <Textarea
                label="Requirement"
                {...register("message")}
                error={errors.message?.message}
              />
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="sticky bottom-0 border-t border-slate-100 bg-white p-4 sm:px-6">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
