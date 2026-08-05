import { z } from "zod";

export const leadSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name is required."),

  email: z
    .string()
    .email("Invalid email."),

  mobile: z
    .string()
    .min(10, "Invalid mobile number."),

  companyName: z.string().optional(),

  message: z
    .string()
    .min(10, "Please describe your requirement."),
});

export type LeadFormData = z.infer<typeof leadSchema>;