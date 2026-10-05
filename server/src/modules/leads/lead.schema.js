import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

function normalizePhone(val) {
  if (!val) return "";
  const digits = String(val).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

export const createLeadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address."
    ),

  mobile: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message: "Invalid mobile number. Please provide a valid 10-digit Indian mobile number.",
    }),

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