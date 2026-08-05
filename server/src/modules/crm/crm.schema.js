import { z } from "zod";

export const createCrmSchema = z.object({
  expectedValue: z.coerce.number().optional(),

  expectedClosingDate: z.string().optional(),

  priority: z.string().optional(),

  tags: z.array(z.string()).optional(),
});

export const updateCrmSchema =
  createCrmSchema.partial();