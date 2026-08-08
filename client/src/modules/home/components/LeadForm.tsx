"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import {
  leadSchema,
  LeadFormData,
} from "@/modules/lead/lead.schema";

import { createLead } from "@/modules/lead/lead.api";

import { Service } from "@/modules/service/service.types";

interface Props {
  services: Service[];
  onRemoveService: (serviceId: string) => void;
  onSuccess: () => void;
}

export default function LeadForm({
  services,
  onRemoveService,
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
    if (!services.length) {
      toast.error("Please select at least one service.");
      return;
    }

    startTransition(async () => {
      try {
        await createLead({
          ...values,
          services: services.map((service) => service._id),
        });

        toast.success("Enquiry submitted successfully.");

        reset();

        // Clear selected services in parent component
        onSuccess();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong."
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-10 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8"
    >
      {/* =========================================================
          FORM HEADING
      ========================================================= */}
      <div>
        <h2 className="text-xl font-bold text-[#0A1F66] sm:text-2xl">
          Tell us your Requirement
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Share your details and we&apos;ll help you find the right
          solution.
        </p>
      </div>

      {/* =========================================================
          SELECTED SERVICES
      ========================================================= */}
      <div className="mt-6">
        {services.length > 0 ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:p-5">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#0A1F66] sm:text-base">
                Services you&apos;re interested in
              </h3>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {services.length}{" "}
                {services.length === 1 ? "service" : "services"} selected
              </p>
            </div>

            {/* Selected Services */}
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-[#0A1F66] shadow-sm sm:text-sm"
                >
                  {/* Check */}
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1E5BFF] text-[9px] font-bold text-white">
                    ✓
                  </span>

                  {/* Service Name */}
                  <span className="max-w-[180px] truncate sm:max-w-none">
                    {service.name}
                  </span>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      onRemoveService(service._id)
                    }
                    aria-label={`Remove ${service.name}`}
                    className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-sm leading-none text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-5">
            <p className="text-sm font-semibold text-slate-600">
              No services selected yet.
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Select one or more services above to include them in
              your enquiry.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================
          YOUR DETAILS
      ========================================================= */}
      <div className="mt-7">
        <h3 className="mb-4 text-sm font-bold text-[#0A1F66] sm:text-base">
          Your Details
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
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
            label="Company"
            {...register("companyName")}
            error={errors.companyName?.message}
          />
        </div>
      </div>

      {/* =========================================================
          REQUIREMENT
      ========================================================= */}
      <div className="mt-6">
        <Textarea
          label="Requirement"
          {...register("message")}
          error={errors.message?.message}
        />
      </div>

      {/* =========================================================
          SUBMIT
      ========================================================= */}
      <div className="mt-7">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? "Submitting..." : "Submit Enquiry"}
        </Button>
      </div>
    </form>
  );
}