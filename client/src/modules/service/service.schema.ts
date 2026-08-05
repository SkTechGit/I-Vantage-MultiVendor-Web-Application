import { z } from "zod";

export const serviceSchema = z.object({
  category: z.string().min(1, "Category is required."),

  name: z
    .string()
    .trim()
    .min(2, "Service name is required."),

  shortDescription: z
    .string()
    .trim()
    .min(5, "Short description is required."),

  sortOrder: z.coerce.number(),

  isActive: z.boolean(),
});

export type ServiceFormData = z.infer<
  typeof serviceSchema
>;