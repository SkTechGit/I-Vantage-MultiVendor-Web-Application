import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createLeadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required."),

  email: z
    .string()
    .trim()
    .email("Invalid email address."),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number."),

  companyName: z
    .string()
    .trim()
    .optional(),

  companyWebsite: z
    .string()
    .trim()
    .optional(),

  role: z
    .string()
    .trim()
    .optional(),

  industry: z
    .string()
    .trim()
    .optional(),

  businessSize: z
    .enum([
      "JUST_STARTING",
      "ONE_TO_TEN",
      "TEN_TO_TWENTY",
      "MORE_THAN_TWENTY",
    ])
    .nullable()
    .optional(),

  hearAboutUs: z
    .string()
    .trim()
    .optional(),

  location: z
    .string()
    .trim()
    .optional(),

  services: z.array(
    z.string().regex(objectIdRegex, "Invalid service id.")
  ),

  message: z
    .string()
    .trim()
    .min(5, "Message is required.")
    .max(1000),
});

export const updateLeadSchema = createLeadSchema.partial();