"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Phone,
  MessageCircle,
  Mail,
  UserRound,
  BriefcaseBusiness,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import Container from "@/components/common/Container";
import Button from "@/components/ui/Button";
import { createLead } from "@/modules/lead/lead.api";
import {
  isValidIndianPhone,
  isValidEmail,
  normalizeIndianPhone,
  VALIDATION_MESSAGES,
} from "@/lib/validation";
import { contactConfig } from "../constants/contactConfig";

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  serviceRequirement: string;
  contactMethod: "Phone" | "WhatsApp" | "Email";
  message: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  serviceRequirement?: string;
  message?: string;
}

const serviceOptions = [
  "Virtual Office",
  "Coworking Seat",
  "Dedicated Desk",
  "Private Cabin",
  "Managed Office",
  "Meeting Room",
  "GST Registration",
  "Business Support",
  "Other",
];

const initialValues: FormState = {
  fullName: "",
  phone: "",
  email: "",
  serviceRequirement: "",
  contactMethod: "Phone",
  message: "",
};

interface ContactFormProps {
  isCardOnly?: boolean;
}

export default function ContactForm({ isCardOnly = false }: ContactFormProps) {
  const [formData, setFormData] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    // Phone Number (10 digits starting with 6-9)
    if (!formData.phone.trim()) {
      newErrors.phone = VALIDATION_MESSAGES.PHONE_REQUIRED;
    } else if (!isValidIndianPhone(formData.phone)) {
      newErrors.phone = VALIDATION_MESSAGES.PHONE_INVALID;
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
    }

    // Service Requirement
    if (!formData.serviceRequirement) {
      newErrors.serviceRequirement = "Please select a service or requirement.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPhone = normalizeIndianPhone(formData.phone);
      const fullMessage = [
        `Requirement: ${formData.serviceRequirement}`,
        `Preferred Contact Method: ${formData.contactMethod}`,
        formData.message.trim()
          ? `Message: ${formData.message.trim()}`
          : "Message: Interested in workspace & business support.",
      ].join("\n");

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: cleanPhone,
        services: [], // Backend automatically maps empty array to General Enquiry
        location: "Gurgaon - Welldone Tech Park",
        message: fullMessage,
      };

      await createLead(payload);

      // Track analytics if GTM is present
      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: "contact_form_submit",
          service: formData.serviceRequirement,
          contact_method: formData.contactMethod,
        });
      }

      setIsSuccess(true);
      setFormData(initialValues);
    } catch (err: any) {
      const backendMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while submitting your enquiry. Please try again or contact us directly.";
      setErrorMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    setFormData(initialValues);
    setErrors({});
  };

  const formContent = isSuccess ? (
              /* Success State */
              <div className="py-8 text-center sm:py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">
                  <CheckCircle2 size={36} strokeWidth={1.85} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#0A1F66] sm:text-2xl">
                  Thank you! Your enquiry has been received.
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
                  Our team will review your requirements and get back to you
                  shortly via your preferred contact channel.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw size={15} strokeWidth={1.85} />
                    <span>Submit Another Enquiry</span>
                  </Button>

                  <a
                    href={contactConfig.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="secondary" className="w-full sm:w-auto">
                      <MessageCircle size={15} strokeWidth={1.85} />
                      <span>Chat on WhatsApp</span>
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              /* Main Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Global Error Banner if submission failed */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 sm:text-sm"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        size={18}
                        strokeWidth={1.85}
                        className="mt-0.5 shrink-0 text-red-500"
                      />
                      <div className="space-y-2">
                        <p className="font-semibold">{errorMessage}</p>
                        <p className="text-xs text-red-600">
                          If this continues, call us directly at{" "}
                          <a
                            href={`tel:${contactConfig.phone}`}
                            className="font-bold underline"
                          >
                            {contactConfig.displayPhone}
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fullName"
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700"
                    >
                      <UserRound size={14} strokeWidth={2} className="text-[#1E5BFF]" />
                      <span>Full Name</span> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={
                        errors.fullName ? "fullName-error" : undefined
                      }
                      className={`mt-1.5 block w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 ${
                        errors.fullName
                          ? "border-red-300 bg-red-50/40 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 focus:bg-white focus:border-[#1E5BFF] focus:ring-blue-100/60 shadow-2xs"
                      }`}
                    />
                    {errors.fullName && (
                      <p
                        id="fullName-error"
                        className="mt-1 text-xs font-semibold text-red-600"
                      >
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700"
                    >
                      <Phone size={14} strokeWidth={2} className="text-[#1E5BFF]" />
                      <span>Phone Number</span> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={`mt-1.5 block w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 ${
                        errors.phone
                          ? "border-red-300 bg-red-50/40 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 focus:bg-white focus:border-[#1E5BFF] focus:ring-blue-100/60 shadow-2xs"
                      }`}
                    />
                    {errors.phone && (
                      <p
                        id="phone-error"
                        className="mt-1 text-xs font-semibold text-red-600"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="email"
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700"
                    >
                      <Mail size={14} strokeWidth={2} className="text-[#1E5BFF]" />
                      <span>Email Address</span> <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rahul@company.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`mt-1.5 block w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 ${
                        errors.email
                          ? "border-red-300 bg-red-50/40 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 focus:bg-white focus:border-[#1E5BFF] focus:ring-blue-100/60 shadow-2xs"
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-1 text-xs font-semibold text-red-600"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Service / Requirement Dropdown */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="serviceRequirement"
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700"
                    >
                      <BriefcaseBusiness size={14} strokeWidth={2} className="text-[#1E5BFF]" />
                      <span>I&apos;m Interested In</span> <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1.5">
                      <select
                        id="serviceRequirement"
                        name="serviceRequirement"
                        value={formData.serviceRequirement}
                        onChange={handleChange}
                        aria-invalid={!!errors.serviceRequirement}
                        aria-describedby={
                          errors.serviceRequirement
                            ? "serviceRequirement-error"
                            : undefined
                        }
                        className={`block w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 transition-all duration-200 focus:outline-none focus:ring-4 cursor-pointer ${
                          errors.serviceRequirement
                            ? "border-red-300 bg-red-50/40 focus:border-red-500 focus:ring-red-100"
                            : "border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 focus:bg-white focus:border-[#1E5BFF] focus:ring-blue-100/60 shadow-2xs"
                        }`}
                      >
                        <option value="">Select a service or requirement...</option>
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.serviceRequirement && (
                      <p
                        id="serviceRequirement-error"
                        className="mt-1 text-xs font-semibold text-red-600"
                      >
                        {errors.serviceRequirement}
                      </p>
                    )}
                  </div>

                  {/* Preferred Contact Method */}
                  <div className="sm:col-span-2">
                    <span className="block text-xs font-bold text-slate-700">
                      Preferred Contact Method
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2.5 sm:gap-3">
                      {[
                        { method: "Phone" as const, icon: Phone },
                        { method: "WhatsApp" as const, icon: MessageCircle },
                        { method: "Email" as const, icon: Mail },
                      ].map(({ method, icon: MethodIcon }) => (
                        <label
                          key={method}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                            formData.contactMethod === method
                              ? "border-[#1E5BFF] bg-blue-50/90 text-[#0A1F66] shadow-2xs ring-1 ring-[#1E5BFF]/30"
                              : "border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/60"
                          }`}
                        >
                          <input
                            type="radio"
                            name="contactMethod"
                            value={method}
                            checked={formData.contactMethod === method}
                            onChange={() =>
                              setFormData((prev) => ({
                                ...prev,
                                contactMethod: method,
                              }))
                            }
                            className="sr-only"
                          />
                          <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            formData.contactMethod === method
                              ? "border-[#1E5BFF] bg-[#1E5BFF]"
                              : "border-slate-300 bg-white"
                          }`}>
                            {formData.contactMethod === method && (
                              <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </span>
                          <MethodIcon size={13} strokeWidth={2} className={formData.contactMethod === method ? "text-[#1E5BFF]" : "text-slate-400"} />
                          <span>{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-700"
                    >
                      <MessageSquare size={14} strokeWidth={2} className="text-[#1E5BFF]" />
                      <span>Message / Special Requirements (Optional)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Share any specific requirements, team size, preferred move-in date, or questions..."
                      className="mt-1.5 block w-full rounded-2xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 focus:bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-[#1E5BFF] focus:outline-none focus:ring-4 focus:ring-blue-100/60 shadow-2xs resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0A1F66] via-[#12319A] to-[#1E5BFF] hover:brightness-110 px-6 py-3.5 sm:py-4 text-sm sm:text-base font-black text-white shadow-[0_12px_28px_rgba(30,91,255,0.32)] transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Request</span>
                        <Send
                          size={15}
                          strokeWidth={2.2}
                          className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                        />
                      </>
                    )}
                  </button>
                  <p className="mt-2.5 text-center text-[11px] text-slate-400">
                    We respect your privacy. Your information is strictly used
                    to respond to your enquiry.
                  </p>
                </div>
              </form>
  );

  if (isCardOnly) {
    return formContent;
  }

  return (
    <section
      id="enquiry-form"
      className="scroll-mt-24 bg-slate-50/70 py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E5BFF]">
              Get in Touch
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1F66] sm:text-3xl lg:text-4xl">
              How Can We Help?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              Tell us what you are looking for and our team will help you find
              the right solution.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl sm:p-10">
            {formContent}
          </div>
        </div>
      </Container>
    </section>
  );
}
