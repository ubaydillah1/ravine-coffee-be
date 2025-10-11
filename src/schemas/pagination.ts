import { z } from "zod";

export const PaginationSchema = z.object({
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, "Limit must be a positive number")
    .default(12),

  page: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val) && val > 0, "Page must be a positive number")
    .default(1),
});
