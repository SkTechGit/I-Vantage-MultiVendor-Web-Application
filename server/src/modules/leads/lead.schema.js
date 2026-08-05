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

  services: z
    .array(
      z.string().regex(objectIdRegex, "Invalid service id.")
    )
    .min(1, "Select at least one service."),

  message: z
    .string()
    .trim()
    .min(5, "Message is required.")
    .max(1000),
});

export const updateLeadSchema = createLeadSchema.partial();