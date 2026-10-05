"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import {
  X,
  Check,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import {
  leadSchema,
  LeadFormData,
} from "@/modules/lead/lead.schema";

import { normalizeIndianPhone } from "@/lib/validation";

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
  const [showMoreInformation, setShowMoreInformation] = useState(false);

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
      const { termsAccepted, ...leadValues } = values;

      const payload = {
        ...leadValues,
        email: values.email.trim().toLowerCase(),
        mobile: normalizeIndianPhone(values.mobile),
        services: services.map((service) => service._id),
      };

      await createLead(payload);

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
      setShowMoreInformation(false);

      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong."
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto"
        >
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
                    {services.length === 1
                      ? "service"
                      : "services"}{" "}
                    selected
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
                        onClick={() =>
                          onRemoveService(service._id)
                        }
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
                  No specific service selected. We&apos;ll understand
                  your requirement and suggest the right solution.
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

                {/* Required */}
                <Input
                  label="Full Name *"
                  {...register("fullName")}
                  error={errors.fullName?.message}
                />

                {/* Required */}
                <Input
                  label="Email *"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />

                {/* Required */}
                <Input
                  label="Mobile *"
                  type="tel"
                  {...register("mobile")}
                  error={errors.mobile?.message}
                />

                {/* Optional */}
                <Input
                  label="Business Location"
                  placeholder="City / Area"
                  {...register("location")}
                  error={errors.location?.message}
                />

                {/* Optional */}
                <Input
                  label="Company"
                  {...register("companyName")}
                  error={errors.companyName?.message}
                />

                {/* Optional - Beside Company */}
                <Input
                  label="Company Website"
                  type="url"
                  placeholder="https://example.com"
                  {...register("companyWebsite")}
                  error={errors.companyWebsite?.message}
                />
              </div>
            </div>

            {/* =================================================
                MORE INFORMATION
            ================================================= */}

            <div className="overflow-hidden rounded-xl border border-slate-200">

              <button
                type="button"
                onClick={() =>
                  setShowMoreInformation(
                    !showMoreInformation
                  )
                }
                className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-slate-50"
                aria-expanded={showMoreInformation}
              >
                <div>
                  <h3 className="text-xs font-bold text-[#0A1F66] sm:text-sm">
                    More Information
                  </h3>

                  <p className="mt-0.5 text-[10px] text-slate-500 sm:text-xs">
                    Optional details to help us understand your business
                  </p>
                </div>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                    showMoreInformation
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {showMoreInformation && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                  <div className="grid gap-4 md:grid-cols-2">

                    {/* Your Role */}
                    <div>
                      <label
                        htmlFor="role"
                        className="mb-1.5 block text-xs font-medium text-slate-700"
                      >
                        Your Role
                      </label>

                      <select
                        id="role"
                        {...register("role")}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10"
                      >
                        <option value="">
                          Select your role
                        </option>
                        <option value="FOUNDER">
                          Founder / Co-Founder
                        </option>
                        <option value="OWNER">
                          Owner
                        </option>
                        <option value="DIRECTOR">
                          Director
                        </option>
                        <option value="CEO">
                          CEO / Managing Director
                        </option>
                        <option value="MANAGER">
                          Manager
                        </option>
                        <option value="HR_ADMIN">
                          HR / Admin
                        </option>
                        <option value="MARKETING">
                          Marketing
                        </option>
                        <option value="SALES">
                          Sales
                        </option>
                        <option value="OPERATIONS">
                          Operations
                        </option>
                        <option value="OTHER">
                          Other
                        </option>
                      </select>

                      {errors.role && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.role.message}
                        </p>
                      )}
                    </div>

                    {/* Business / Industry */}
                    <div>
                      <label
                        htmlFor="industry"
                        className="mb-1.5 block text-xs font-medium text-slate-700"
                      >
                        Business / Industry
                      </label>

                      <select
                        id="industry"
                        {...register("industry")}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10"
                      >
                        <option value="">
                          Select your industry
                        </option>
                        <option value="REAL_ESTATE">
                          Real Estate
                        </option>
                        <option value="IT_SOFTWARE">
                          IT / Software
                        </option>
                        <option value="CONSULTING">
                          Consulting
                        </option>
                        <option value="FINANCE">
                          Finance
                        </option>
                        <option value="EDUCATION">
                          Education
                        </option>
                        <option value="HEALTHCARE">
                          Healthcare
                        </option>
                        <option value="MANUFACTURING">
                          Manufacturing
                        </option>
                        <option value="RETAIL">
                          Retail
                        </option>
                        <option value="ECOMMERCE">
                          E-commerce
                        </option>
                        <option value="PROFESSIONAL_SERVICES">
                          Professional Services
                        </option>
                        <option value="OTHER">
                          Other
                        </option>
                      </select>

                      {errors.industry && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.industry.message}
                        </p>
                      )}
                    </div>

                    {/* Business Size */}
                    <div>
                      <label
                        htmlFor="businessSize"
                        className="mb-1.5 block text-xs font-medium text-slate-700"
                      >
                        How large is your business?
                      </label>

                      <select
                        id="businessSize"
                        {...register("businessSize")}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10"
                      >
                        <option value="">
                          Select business size
                        </option>
                        <option value="JUST_STARTING">
                          Just starting
                        </option>
                        <option value="ONE_TO_TEN">
                          1–10 employees
                        </option>
                        <option value="TEN_TO_TWENTY">
                          10–20 employees
                        </option>
                        <option value="MORE_THAN_TWENTY">
                          More than 20 employees
                        </option>
                      </select>

                      {errors.businessSize && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.businessSize.message}
                        </p>
                      )}
                    </div>

                    {/* How did you hear about us */}
                    <div>
                      <label
                        htmlFor="hearAboutUs"
                        className="mb-1.5 block text-xs font-medium text-slate-700"
                      >
                        How did you hear about i-VANTAGE?
                      </label>

                      <select
                        id="hearAboutUs"
                        {...register("hearAboutUs")}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/10"
                      >
                        <option value="">
                          Select an option
                        </option>
                        <option value="GOOGLE_SEARCH">
                          Google Search
                        </option>
                        <option value="GOOGLE_BUSINESS">
                          Google Business Profile
                        </option>
                        <option value="FACEBOOK">
                          Facebook
                        </option>
                        <option value="INSTAGRAM">
                          Instagram
                        </option>
                        <option value="LINKEDIN">
                          LinkedIn
                        </option>
                        <option value="WHATSAPP">
                          WhatsApp
                        </option>
                        <option value="REFERRAL">
                          Referral
                        </option>
                        <option value="EXISTING_CLIENT">
                          Existing Client
                        </option>
                        <option value="ADVERTISEMENT">
                          Advertisement
                        </option>
                        <option value="OTHER">
                          Other
                        </option>
                      </select>

                      {errors.hearAboutUs && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.hearAboutUs.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                REQUIREMENT
            ================================================= */}

            <div>
              <Textarea
                label="Requirement *"
                {...register("message")}
                error={errors.message?.message}
              />
            </div>
          </div>

          {/* TERMS AND CONDITIONS */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
  <div className="flex items-start gap-3">
    <input
      id="termsAccepted"
      type="checkbox"
      {...register("termsAccepted")}
      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#1E5BFF] focus:ring-[#1E5BFF]"
    />

    <div className="text-xs leading-5 text-slate-600">
      <label
        htmlFor="termsAccepted"
        className="cursor-pointer"
      >
        I have read and agree to the{" "}
        <Link
          href="/terms-of-use"
          target="_blank"
          className="font-semibold text-[#1E5BFF] hover:underline"
        >
          Terms of Use
        </Link>
        .
      </label>

      {errors.termsAccepted && (
        <p className="mt-1 text-xs text-red-500">
          {errors.termsAccepted.message}
        </p>
      )}
    </div>
  </div>
</div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="sticky bottom-0 border-t border-slate-100 bg-white p-4 sm:px-6">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending
                ? "Submitting..."
                : "Submit Enquiry"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}