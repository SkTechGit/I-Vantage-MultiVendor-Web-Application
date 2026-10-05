import { z } from "zod";
import { isValidIndianPhone, isValidEmail, VALIDATION_MESSAGES } from "@/lib/validation";

export const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required (minimum 2 characters)."),

  email: z
    .string({ required_error: VALIDATION_MESSAGES.EMAIL_REQUIRED })
    .trim()
    .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .refine(isValidEmail, { message: VALIDATION_MESSAGES.EMAIL_INVALID }),

  mobile: z
    .string({ required_error: VALIDATION_MESSAGES.PHONE_REQUIRED })
    .trim()
    .min(1, VALIDATION_MESSAGES.PHONE_REQUIRED)
    .refine(isValidIndianPhone, { message: VALIDATION_MESSAGES.PHONE_INVALID }),

  companyName: z
    .string()
    .optional(),

  companyWebsite: z
    .string()
    .optional(),

  role: z
    .string()
    .optional(),

  termsAccepted: z
  .boolean()
  .refine((value) => value === true, {
    message: "You must accept the Terms of Use.",
  }),

  industry: z
    .string()
    .optional(),

  businessSize: z
    .enum([
      "JUST_STARTING",
      "ONE_TO_TEN",
      "TEN_TO_TWENTY",
      "MORE_THAN_TWENTY",
    ])
    .or(z.literal(""))
    .optional(),

  hearAboutUs: z
    .string()
    .optional(),

  location: z
    .string()
    .optional(),

  message: z
    .string()
    .min(10, "Please describe your requirement."),
});

export type LeadFormData = z.infer<typeof leadSchema>;